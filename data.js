// === DATA MANAGEMENT PAGE LOGIC ===

class DataManagementApp {
    constructor() {
        this.recentThrows = [];
        this.init();
    }

    async init() {
        try {
            await dartDB.init();
            await this.refreshData();
        } catch (error) {
            console.error('Failed to initialize data management:', error);
        }

        this.bindEvents();
    }

    async refreshData() {
        try {
            this.recentThrows = await dartDB.getRecentThrows(10);
        } catch (error) {
            console.error('Error loading throws:', error);
            this.recentThrows = [];
        }

        this.updateRecentThrowsList();
        await this.updateTotalSummary();
    }

    updateRecentThrowsList() {
        const container = document.getElementById('recentThrowsList');
        container.textContent = '';

        if (this.recentThrows.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'Keine Würfe vorhanden';
            container.appendChild(empty);
            return;
        }

        this.recentThrows.forEach(throwData => {
            const item = document.createElement('div');
            item.className = 'history-item-with-delete';

            const content = document.createElement('div');
            content.className = 'history-content';

            const throwsDiv = document.createElement('div');
            throwsDiv.className = 'history-throws';
            throwsDiv.textContent = throwData.darts.map(dart => formatDartResult(dart)).join(' / ');

            const metaDiv = document.createElement('div');
            metaDiv.className = 'history-meta';
            metaDiv.textContent = formatDateTime(new Date(throwData.timestamp));

            content.append(throwsDiv, metaDiv);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-item-btn';
            deleteBtn.dataset.id = throwData.id;
            deleteBtn.textContent = '✕';
            deleteBtn.setAttribute('aria-label', `Wurf ${throwsDiv.textContent} löschen`);

            item.append(content, deleteBtn);
            container.appendChild(item);
        });
    }

    async updateTotalSummary() {
        try {
            const allThrows = await dartDB.getAllThrows();
            const summaryContainer = document.getElementById('totalThrowsSummary');
            summaryContainer.textContent = allThrows.length > 0 ? `Gesamt: ${allThrows.length} Würfe` : '';
        } catch (error) {
            console.error('Error loading total throws count:', error);
        }
    }

    async deleteThrow(throwId) {
        const confirmed = confirm('Diesen Wurf wirklich löschen?');
        if (!confirmed) return;

        try {
            await dartDB.deleteThrow(throwId);
            await this.refreshData();
        } catch (error) {
            console.error('Error deleting throw:', error);
        }
    }

    async exportData() {
        try {
            const throws = await dartDB.getAllThrows();
            if (throws.length === 0) return;

            throws.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));

            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                totalThrows: throws.length,
                throws: throws,
                statistics: calculateStatistics(throws)
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dart-training-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    }

    bindEvents() {
        // Event-Delegation für die Lösch-Buttons
        document.getElementById('recentThrowsList').addEventListener('click', (event) => {
            const btn = event.target.closest('.delete-item-btn');
            if (btn) {
                this.deleteThrow(btn.dataset.id);
            }
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });

        window.addEventListener('focus', () => {
            this.refreshData();
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataApp = new DataManagementApp();
});
