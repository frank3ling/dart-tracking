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
        this.generateTargetGrid();
        this.updateTargetSelection();
        this.updateInputButtons();
        this.updateThrowDisplay();
    }

    generateTargetGrid() {
        const grid = document.getElementById('targetGrid');
        grid.innerHTML = '';

        // Numbers 1-20
        for (let i = 1; i <= 20; i++) {
            const btn = document.createElement('button');
            btn.className = 'target-btn';
            btn.textContent = i;
            btn.setAttribute('data-target', i);
            btn.addEventListener('click', () => this.setTarget(i));
            grid.appendChild(btn);
        }

        // Add 25 (Bull)
        const bullBtn = document.createElement('button');
        bullBtn.className = 'target-btn';
        bullBtn.textContent = '25';
        bullBtn.setAttribute('data-target', '25');
        bullBtn.addEventListener('click', () => this.setTarget(25));
        grid.appendChild(bullBtn);
    }

    setTarget(target) {
        this.currentTarget = target;
        this.updateTargetSelection();
        this.updateInputButtons();
    }

    updateTargetSelection() {
        // Update active button
        document.querySelectorAll('.target-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') == this.currentTarget);
        });

        // Update display
        document.getElementById('currentTarget').textContent = this.currentTarget;
    }

    updateInputButtons() {
        const singlePoints = calculatePoints(this.currentTarget, 'single');
        const doublePoints = calculatePoints(this.currentTarget, 'double');
        const triplePoints = calculatePoints(this.currentTarget, 'triple');

        document.getElementById('singlePoints').textContent = singlePoints;
        document.getElementById('doublePoints').textContent = doublePoints;
        document.getElementById('triplePoints').textContent = triplePoints;

        // Enable/disable buttons based on current dart
        const buttonsDisabled = this.currentThrow.currentDartIndex >= 3;
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.disabled = buttonsDisabled;
        });
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
            this.showError('Wurf bereits vollständig!');
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
        this.updateInputButtons();

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

            this.showSuccess(`Wurf gespeichert: ${throwData.totalPoints} Punkte`);
        } catch (error) {
            console.error('Error saving throw:', error);
            this.showError('Fehler beim Speichern des Wurfs');
        }

        // Reset for next throw
        this.resetCurrentThrow();
        this.updateHistoryDisplay();
    }

    resetCurrentThrow() {
        this.currentThrow = {
            darts: [null, null, null],
            currentDartIndex: 0
        };
        this.updateThrowDisplay();
        this.updateInputButtons();
    }

    updateThrowDisplay() {
        for (let i = 0; i < 3; i++) {
            const resultElement = document.getElementById(`dart${i + 1}Result`);
            const statusElement = document.querySelector(`[data-dart="${i + 1}"]`);
            
            const dart = this.currentThrow.darts[i];
            
            if (dart) {
                resultElement.textContent = formatDartResult(dart);
                statusElement.classList.add('completed');
            } else if (i === this.currentThrow.currentDartIndex) {
                resultElement.textContent = '?';
                statusElement.classList.remove('completed');
            } else {
                resultElement.textContent = '?';
                statusElement.classList.remove('completed');
            }
        }
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.recentThrows.length === 0) {
            historyList.innerHTML = '<div class="history-placeholder">Noch keine Würfe erfasst</div>';
            return;
        }

        const historyHTML = this.recentThrows.slice(0, 3).map(throwData => {
            const dartResults = throwData.darts.map(dart => formatDartResult(dart)).join('/');
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
            this.updateInputButtons();
            this.showInfo('Letzter Pfeil entfernt');
            return;
        }

        // Otherwise, undo last completed throw
        try {
            const removedThrow = await dartDB.removeLastThrow();
            if (removedThrow) {
                this.recentThrows = this.recentThrows.filter(t => t.id !== removedThrow.id);
                this.updateHistoryDisplay();
                this.showInfo('Letzter Wurf rückgängig gemacht');
            } else {
                this.showError('Keine Würfe zum Rückgängigmachen vorhanden');
            }
        } catch (error) {
            console.error('Error undoing throw:', error);
            this.showError('Fehler beim Rückgängigmachen');
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
        this.updateInputButtons();
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

    showSuccess(message) {
        this.showMessage(message, 'success', '#27ae60');
    }

    showError(message) {
        this.showMessage(message, 'error', '#e74c3c');
    }

    showInfo(message) {
        this.showMessage(message, 'info', '#3498db');
    }

    showMessage(message, type, color) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `status-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.background = color + '20';
        messageDiv.style.border = `1px solid ${color}`;
        messageDiv.style.color = color;
        messageDiv.style.padding = '12px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.marginBottom = '15px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.fontSize = '14px';
        messageDiv.style.fontWeight = '500';

        // Insert at top of main content
        const main = document.querySelector('.app-main');
        main.insertBefore(messageDiv, main.firstChild);

        // Remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dartApp = new DartInputApp();
});