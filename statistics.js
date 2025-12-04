// === STATISTICS PAGE LOGIC ===

class DartStatisticsApp {
    constructor() {
        this.stats = null;
        this.throws = [];
        this.init();
    }

    async init() {
        try {
            await dartDB.init();
            await this.loadData();
            this.calculateStatistics();
            this.updateDisplay();
        } catch (error) {
            console.error('Failed to initialize statistics:', error);
        }

        this.bindEvents();
    }

    async loadData() {
        try {
            this.throws = await dartDB.getAllThrows();
            this.throws.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        } catch (error) {
            console.error('Error loading throws:', error);
            this.throws = [];
        }
    }

    calculateStatistics() {
        this.stats = calculateStatistics(this.throws);
    }

    updateDisplay() {
        if (!this.stats) return;

        this.updateOverallStats();
        this.updateCategoryStats();
        this.updateLastTenStats();
        this.updateAccuracyStats();
    }

    updateOverallStats() {
        document.getElementById('totalDarts').textContent = this.stats.totalDarts;
        document.getElementById('totalThrows').textContent = this.stats.totalThrows;

        const accuracyPercent = Math.round(this.stats.accuracy.overall * 100);
        document.getElementById('overallAccuracy').textContent = `${accuracyPercent}%`;
    }

    updateCategoryStats() {
        const categories = this.stats.categories;
        
        document.getElementById('zeroCount').textContent = categories.zero;
        document.getElementById('sixtyPlusCount').textContent = categories.sixtyPlus;
        document.getElementById('eightyPlusCount').textContent = categories.eightyPlus;
        document.getElementById('hundredPlusCount').textContent = categories.hundredPlus;
        document.getElementById('hundredFortyPlusCount').textContent = categories.hundredFortyPlus;
        document.getElementById('oneEightyCount').textContent = categories.oneEighty;
    }

    updateLastTenStats() {
        const lastTen = this.stats.lastTenThrows;
        
        // Last 10 throw categories
        document.getElementById('lastTenZero').textContent = lastTen.zero;
        document.getElementById('lastTenHundredPlus').textContent = lastTen.hundredPlus;
        document.getElementById('lastTenHundredFortyPlus').textContent = lastTen.hundredFortyPlus;
        document.getElementById('lastTenOneEighty').textContent = lastTen.oneEighty;

        // Dart types in last 10 throws
        document.getElementById('lastTenSingle').textContent = lastTen.dartTypes.single;
        document.getElementById('lastTenDouble').textContent = lastTen.dartTypes.double;
        document.getElementById('lastTenTriple').textContent = lastTen.dartTypes.triple;
        document.getElementById('lastTenMiss').textContent = lastTen.dartTypes.miss;
    }

    updateAccuracyStats() {
        const accuracy = this.stats.accuracy.byPosition;
        
        document.getElementById('accuracy1').textContent = `${Math.round(accuracy[0] * 100)}%`;
        document.getElementById('accuracy2').textContent = `${Math.round(accuracy[1] * 100)}%`;
        document.getElementById('accuracy3').textContent = `${Math.round(accuracy[2] * 100)}%`;

        // Add visual color coding based on accuracy
        this.updateAccuracyColors('accuracy1', accuracy[0]);
        this.updateAccuracyColors('accuracy2', accuracy[1]);
        this.updateAccuracyColors('accuracy3', accuracy[2]);
    }

    updateAccuracyColors(elementId, accuracyValue) {
        const element = document.getElementById(elementId);
        
        if (accuracyValue >= 0.8) {
            element.style.color = '#27ae60'; // Green for excellent
        } else if (accuracyValue >= 0.6) {
            element.style.color = '#f39c12'; // Orange for good
        } else if (accuracyValue >= 0.4) {
            element.style.color = '#e67e22'; // Dark orange for fair
        } else {
            element.style.color = '#e74c3c'; // Red for poor
        }
    }

    async refreshData() {
        await this.loadData();
        this.calculateStatistics();
        this.updateDisplay();
    }

    async clearAllData() {
        const confirmed = confirm(
            'Wirklich ALLE Daten löschen?\n\n' +
            'Diese Aktion kann nicht rückgängig gemacht werden!\n\n' +
            `Aktuelle Daten:\n` +
            `• ${this.stats.totalThrows} Würfe\n` +
            `• ${this.stats.totalDarts} Darts\n` +
            `• ${this.stats.categories.oneEighty} × 180er\n\n` +
            'Zum Bestätigen "LÖSCHEN" eingeben:'
        );

        if (!confirmed) return;

        const verification = prompt('Geben Sie "LÖSCHEN" ein um zu bestätigen:');
        if (verification !== 'LÖSCHEN') {
            return;
        }

        try {
            await dartDB.clearAllData();
            this.throws = [];
            this.calculateStatistics();
            this.updateDisplay();
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }

    bindEvents() {
        // Auto-refresh when page becomes visible (useful when switching from input page)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });

        // Refresh on page focus
        window.addEventListener('focus', () => {
            this.refreshData();
        });

        // Handle back navigation
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                this.refreshData();
            }
        });
    }



    // Export data for backup (future feature)
    exportData() {
        if (this.throws.length === 0) {
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            totalThrows: this.throws.length,
            throws: this.throws,
            statistics: this.stats
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
    }
}

// Global function for clear data button - redirects to data management page
async function clearAllData() {
    window.location.href = 'data.html';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dartStatsApp = new DartStatisticsApp();
});

// Auto-refresh when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.dartStatsApp) {
        window.dartStatsApp.refreshData();
    }
});

// Refresh on page focus
window.addEventListener('focus', () => {
    if (window.dartStatsApp) {
        window.dartStatsApp.refreshData();
    }
});