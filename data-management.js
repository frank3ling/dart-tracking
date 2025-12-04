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
        const confirmed = confirm('Diesen Wurf wirklich löschen?');

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

        } catch (error) {
            console.error('Error deleting throw:', error);
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


}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataApp = new DataManagementApp();
});