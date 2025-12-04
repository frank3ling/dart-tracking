// === DATA MANAGEMENT PAGE LOGIC ===

class DataManagementApp {
    constructor() {
        this.recentThrows = [];
        this.init();
    }

    async init() {
        try {
            await dartDB.init();
            await this.loadRecentThrows();
            this.updateDisplay();
        } catch (error) {
            console.error('Failed to initialize data management:', error);
            this.showError('Fehler beim Laden der Daten');
        }

        this.bindEvents();
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
        this.updateRecentThrowsList();
    }

    updateRecentThrowsList() {
        const container = document.getElementById('recentThrowsList');
        
        if (this.recentThrows.length === 0) {
            container.innerHTML = '<div class="empty-state">Keine Würfe vorhanden</div>';
            return;
        }

        const listHTML = this.recentThrows.map(throwData => {
            const dartResults = throwData.darts.map(dart => formatDartResult(dart)).join(' / ');
            const timestamp = formatDateTime(new Date(throwData.timestamp));
            const points = throwData.totalPoints;
            
            return `
                <div class="history-item-with-delete">
                    <div class="history-content">
                        <div class="history-throws">${dartResults}</div>
                        <div class="history-meta">${points}p • ${timestamp}</div>
                    </div>
                    <button class="delete-item-btn" onclick="dataApp.deleteThrow('${throwData.id}')" title="Diesen Wurf löschen">
                        ✕
                    </button>
                </div>
            `;
        }).join('');

        container.innerHTML = listHTML;
    }

    async deleteThrow(throwId) {
        const confirmed = confirm(
            'Diesen Wurf wirklich löschen?\\n\\n' +
            'Diese Aktion kann nicht rückgängig gemacht werden.'
        );

        if (!confirmed) return;

        try {
            // Remove from IndexedDB
            const transaction = dartDB.db.transaction(['throws'], 'readwrite');
            const store = transaction.objectStore('throws');
            await new Promise((resolve, reject) => {
                const request = store.delete(throwId);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });

            // Update local data
            this.recentThrows = this.recentThrows.filter(t => t.id !== throwId);
            this.updateDisplay();
            this.showSuccess('Wurf gelöscht');

        } catch (error) {
            console.error('Error deleting throw:', error);
            this.showError('Fehler beim Löschen des Wurfs');
        }
    }

    async clearAllData() {
        const step1 = confirm(
            'WARNUNG: Alle Trainingsdaten löschen?\\n\\n' +
            'Dies löscht unwiderruflich:\\n' +
            `• ${this.recentThrows.length} gespeicherte Würfe\\n` +
            '• Alle Trainingsstatistiken\\n' +
            '• Alle historischen Daten\\n\\n' +
            'Fortfahren?'
        );

        if (!step1) return;

        const step2 = prompt(
            'Zur Bestätigung geben Sie "ALLES LÖSCHEN" ein:'
        );

        if (step2 !== 'ALLES LÖSCHEN') {
            this.showError('Löschvorgang abgebrochen');
            return;
        }

        try {
            await dartDB.clearAllData();
            this.recentThrows = [];
            this.updateDisplay();
            this.showSuccess('Alle Daten wurden gelöscht');
        } catch (error) {
            console.error('Error clearing all data:', error);
            this.showError('Fehler beim Löschen aller Daten');
        }
    }

    async refreshData() {
        await this.loadRecentThrows();
        this.updateDisplay();
    }

    bindEvents() {
        // Auto-refresh when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });

        // Refresh on page focus
        window.addEventListener('focus', () => {
            this.refreshData();
        });
    }

    showSuccess(message) {
        this.showMessage(message, '#27ae60');
    }

    showError(message) {
        this.showMessage(message, '#e74c3c');
    }

    showMessage(message, color) {
        // Create message element
        const messageDiv = document.createElement('div');
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

// Global function for clear all data button
async function clearAllData() {
    if (window.dataApp) {
        await window.dataApp.clearAllData();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataApp = new DataManagementApp();
});