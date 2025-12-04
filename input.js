// === DART INPUT PAGE LOGIC ===

class DartInputApp {
    constructor() {
        this.currentTarget = 20;
        this.currentThrow = {
            darts: [null, null, null],
            currentDartIndex: 0
        };
        this.recentThrows = [];
        
        this.init();
    }

    async init() {
        try {
            await dartDB.init();
            this.loadRecentThrows();
        } catch (error) {
            console.error('Database initialization failed:', error);
            this.showError('Datenspeicher nicht verfügbar. Daten gehen beim Schließen verloren.');
        }
        
        this.setupUI();
        this.updateDisplay();
        this.bindEvents();
    }

    setupUI() {
        this.setupTargetDropdown();
        this.updateThrowDisplay();
    }

    setupTargetDropdown() {
        const dropdown = document.getElementById('targetSelect');
        dropdown.addEventListener('change', (e) => {
            this.setTarget(parseInt(e.target.value));
        });
        
        // Set initial target
        this.currentTarget = parseInt(dropdown.value);
    }

    setTarget(target) {
        this.currentTarget = target;
        const dropdown = document.getElementById('targetSelect');
        dropdown.value = target;
    }



    bindEvents() {
        // Input buttons
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.inputDart(type);
            });
        });

        // Undo button
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undoLastAction();
        });

        // Auto-save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });

        // Handle visibility change for mobile
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveCurrentState();
            }
        });
    }

    inputDart(type) {
        if (this.currentThrow.currentDartIndex >= 3) {
            return;
        }

        const hit = type !== 'miss';
        const points = calculatePoints(this.currentTarget, type);

        const dart = {
            type: type,
            hit: hit,
            points: points,
            target: this.currentTarget
        };

        this.currentThrow.darts[this.currentThrow.currentDartIndex] = dart;
        this.currentThrow.currentDartIndex++;

        this.updateThrowDisplay();

        // Auto-complete throw after 3 darts
        if (this.currentThrow.currentDartIndex >= 3) {
            setTimeout(() => this.completeThrow(), 500);
        }
    }

    async completeThrow() {
        const throwData = {
            id: generateUUID(),
            target: this.currentTarget,
            darts: [...this.currentThrow.darts],
            totalPoints: this.currentThrow.darts.reduce((sum, dart) => sum + dart.points, 0),
            timestamp: new Date().toISOString()
        };

        try {
            await dartDB.saveThrow(throwData);
            this.recentThrows.unshift(throwData);
            
            // Keep only last 10 throws in memory
            if (this.recentThrows.length > 10) {
                this.recentThrows = this.recentThrows.slice(0, 10);
            }

        } catch (error) {
            console.error('Error saving throw:', error);
        }

        // Reset for next throw
        this.resetCurrentThrow();
        this.updateHistoryDisplay();
    }

    formatDartForDisplay(dart) {
        if (dart.type === 'miss') return '0';
        
        const target = dart.target === 25 ? 'B' : dart.target;
        const prefix = dart.type === 'single' ? '' : 
                      dart.type === 'double' ? 'D' : 'T';
        
        return `${prefix}${target}`;
    }

    resetCurrentThrow() {
        this.currentThrow = {
            darts: [null, null, null],
            currentDartIndex: 0
        };
        this.updateThrowDisplay();
    }

    updateThrowDisplay() {
        for (let i = 0; i < 3; i++) {
            const element = document.getElementById(`dart${i + 1}Simple`);
            const dart = this.currentThrow.darts[i];
            
            if (dart) {
                const displayText = this.formatDartForDisplay(dart);
                element.textContent = displayText;
                element.classList.add('dart-completed');
                if (dart.type === 'miss') {
                    element.classList.add('dart-miss');
                } else {
                    element.classList.remove('dart-miss');
                }
            } else {
                element.textContent = '-';
                element.classList.remove('dart-completed', 'dart-miss');
            }
        }
        
        // Enable/disable buttons
        const buttonsDisabled = this.currentThrow.currentDartIndex >= 3;
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.disabled = buttonsDisabled;
        });
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.recentThrows.length === 0) {
            historyList.innerHTML = '<div class="history-placeholder">Noch keine Würfe erfasst</div>';
            return;
        }

        const historyHTML = this.recentThrows.slice(0, 3).map(throwData => {
            const dartResults = throwData.darts.map(dart => formatDartResult(dart)).join(' / ');
            const timestamp = formatDateTime(new Date(throwData.timestamp));
            
            return `
                <div class="history-item">
                    <div class="history-throws">${dartResults}</div>
                    <div class="history-meta">${timestamp}</div>
                </div>
            `;
        }).join('');

        historyList.innerHTML = historyHTML;
    }

    async undoLastAction() {
        // If current throw has darts, undo last dart
        if (this.currentThrow.currentDartIndex > 0) {
            this.currentThrow.currentDartIndex--;
            this.currentThrow.darts[this.currentThrow.currentDartIndex] = null;
            this.updateThrowDisplay();
            return;
        }

        // Otherwise, undo last completed throw
        try {
            const removedThrow = await dartDB.removeLastThrow();
            if (removedThrow) {
                this.recentThrows = this.recentThrows.filter(t => t.id !== removedThrow.id);
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.error('Error undoing throw:', error);
        }
    }

    async loadRecentThrows() {
        try {
            const allThrows = await dartDB.getAllThrows();
            this.recentThrows = allThrows
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10);
        } catch (error) {
            console.error('Error loading throws:', error);
            this.recentThrows = [];
        }
    }

    updateDisplay() {
        this.updateHistoryDisplay();
        this.updateThrowDisplay();
    }

    saveCurrentState() {
        // Save current incomplete throw to localStorage as backup
        if (this.currentThrow.currentDartIndex > 0) {
            localStorage.setItem('dartAppCurrentThrow', JSON.stringify(this.currentThrow));
            localStorage.setItem('dartAppCurrentTarget', this.currentTarget.toString());
        }
    }

    loadCurrentState() {
        // Restore current throw from localStorage
        const savedThrow = localStorage.getItem('dartAppCurrentThrow');
        const savedTarget = localStorage.getItem('dartAppCurrentTarget');
        
        if (savedThrow) {
            this.currentThrow = JSON.parse(savedThrow);
            localStorage.removeItem('dartAppCurrentThrow');
        }
        
        if (savedTarget) {
            this.currentTarget = parseInt(savedTarget);
            localStorage.removeItem('dartAppCurrentTarget');
        }
    }


}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dartApp = new DartInputApp();
});