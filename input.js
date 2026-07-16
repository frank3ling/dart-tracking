// === DART INPUT PAGE LOGIC ===

class DartInputApp {
    constructor() {
        this.currentTarget = 20;
        this.currentThrow = {
            darts: [null, null, null],
            currentDartIndex: 0
        };
        this.recentThrows = [];
        this.completeThrowTimer = null;

        this.init();
    }

    async init() {
        try {
            await dartDB.init();
            await this.loadRecentThrows();
        } catch (error) {
            console.error('Database initialization failed:', error);
        }

        this.setupTargetDropdown();
        this.loadCurrentState();

        // Wiederhergestellter Wurf war bereits vollständig → direkt abschließen
        if (this.currentThrow.currentDartIndex >= 3) {
            await this.completeThrow();
        }

        this.updateDisplay();
        this.bindEvents();
    }

    setupTargetDropdown() {
        const dropdown = document.getElementById('targetSelect');
        dropdown.addEventListener('change', (e) => {
            this.setTarget(parseInt(e.target.value, 10));
        });

        const savedTarget = parseInt(localStorage.getItem('dartTarget'), 10);
        if (!Number.isNaN(savedTarget)) {
            this.currentTarget = savedTarget;
        } else {
            this.currentTarget = parseInt(dropdown.value, 10);
        }
        this.syncTargetUI();
    }

    setTarget(target) {
        this.currentTarget = target;
        localStorage.setItem('dartTarget', target.toString());
        this.syncTargetUI();
    }

    syncTargetUI() {
        const dropdown = document.getElementById('targetSelect');
        dropdown.value = this.currentTarget;

        // Triple Bull existiert nicht: Triple-Button bei Ziel 25 sperren
        const tripleBtn = document.querySelector('.input-btn[data-type="triple"]');
        const buttonsLocked = this.currentThrow.currentDartIndex >= 3;
        tripleBtn.disabled = buttonsLocked || this.currentTarget === 25;
    }

    bindEvents() {
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.inputDart(type);
            });
        });

        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undoLastAction();
        });

        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });

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

        const dart = {
            type: type,
            hit: type !== 'miss',
            points: calculatePoints(this.currentTarget, type),
            target: this.currentTarget
        };

        this.currentThrow.darts[this.currentThrow.currentDartIndex] = dart;
        this.currentThrow.currentDartIndex++;

        this.updateThrowDisplay();
        this.saveCurrentState();

        // Auto-complete throw after 3 darts
        if (this.currentThrow.currentDartIndex >= 3) {
            this.completeThrowTimer = setTimeout(() => this.completeThrow(), 500);
        }

        this.updateUndoButton();
    }

    async completeThrow() {
        this.completeThrowTimer = null;

        const darts = this.currentThrow.darts;
        if (darts.some(dart => !dart)) return; // Undo während des Timers

        const throwData = {
            id: generateUUID(),
            target: this.currentTarget,
            darts: [...darts],
            totalPoints: darts.reduce((sum, dart) => sum + dart.points, 0),
            timestamp: new Date().toISOString()
        };

        try {
            await dartDB.saveThrow(throwData);
            this.recentThrows.unshift(throwData);

            if (this.recentThrows.length > 10) {
                this.recentThrows = this.recentThrows.slice(0, 10);
            }
        } catch (error) {
            console.error('Error saving throw:', error);
        }

        this.resetCurrentThrow();
        this.clearCurrentState();
        this.updateDisplay();
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
            const element = document.getElementById(`dart${i + 1}`);
            const dart = this.currentThrow.darts[i];

            if (dart) {
                element.textContent = dart.type === 'miss' ? '0' : formatDartResult(dart);
                element.classList.add('dart-completed');
                element.classList.toggle('dart-miss', dart.type === 'miss');
            } else {
                element.textContent = '-';
                element.classList.remove('dart-completed', 'dart-miss');
            }
        }

        const buttonsDisabled = this.currentThrow.currentDartIndex >= 3;
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.disabled = buttonsDisabled;
        });
        this.syncTargetUI();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        historyList.textContent = '';

        if (this.recentThrows.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'history-placeholder';
            placeholder.textContent = 'Noch keine Würfe erfasst';
            historyList.appendChild(placeholder);
            return;
        }

        this.recentThrows.slice(0, 3).forEach(throwData => {
            const item = document.createElement('div');
            item.className = 'history-item';

            const throwsDiv = document.createElement('div');
            throwsDiv.className = 'history-throws';
            throwsDiv.textContent = throwData.darts.map(dart => formatDartResult(dart)).join(' / ');

            const metaDiv = document.createElement('div');
            metaDiv.className = 'history-meta';
            metaDiv.textContent = formatDateTime(new Date(throwData.timestamp));

            item.append(throwsDiv, metaDiv);
            historyList.appendChild(item);
        });
    }

    undoLastAction() {
        // Nur Dart-Eingaben zurücknehmen, nie gespeicherte Würfe
        if (this.currentThrow.currentDartIndex === 0) return;

        // Läuft der Auto-Complete-Timer noch, abbrechen
        if (this.completeThrowTimer !== null) {
            clearTimeout(this.completeThrowTimer);
            this.completeThrowTimer = null;
        }

        this.currentThrow.currentDartIndex--;
        this.currentThrow.darts[this.currentThrow.currentDartIndex] = null;
        this.updateThrowDisplay();
        this.updateUndoButton();
        this.saveCurrentState();
    }

    updateUndoButton() {
        const undoBtn = document.getElementById('undoBtn');
        undoBtn.disabled = this.currentThrow.currentDartIndex === 0;
    }

    async loadRecentThrows() {
        try {
            this.recentThrows = await dartDB.getRecentThrows(10);
        } catch (error) {
            console.error('Error loading throws:', error);
            this.recentThrows = [];
        }
    }

    updateDisplay() {
        this.updateHistoryDisplay();
        this.updateThrowDisplay();
        this.updateUndoButton();
    }

    saveCurrentState() {
        if (this.currentThrow.currentDartIndex > 0) {
            localStorage.setItem('dartAppCurrentThrow', JSON.stringify(this.currentThrow));
        } else {
            this.clearCurrentState();
        }
    }

    loadCurrentState() {
        const savedThrow = localStorage.getItem('dartAppCurrentThrow');
        if (!savedThrow) return;

        localStorage.removeItem('dartAppCurrentThrow');
        try {
            const parsed = JSON.parse(savedThrow);
            if (parsed && Array.isArray(parsed.darts) && parsed.darts.length === 3 &&
                Number.isInteger(parsed.currentDartIndex) &&
                parsed.currentDartIndex >= 0 && parsed.currentDartIndex <= 3) {
                this.currentThrow = parsed;
            }
        } catch (error) {
            console.error('Could not restore saved throw:', error);
        }
    }

    clearCurrentState() {
        localStorage.removeItem('dartAppCurrentThrow');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dartApp = new DartInputApp();
});
