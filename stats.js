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
            await this.refreshData();
        } catch (error) {
            console.error('Failed to initialize statistics:', error);
        }

        this.bindEvents();
    }

    async refreshData() {
        try {
            this.throws = await dartDB.getAllThrows();
            this.throws.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
        } catch (error) {
            console.error('Error loading throws:', error);
            this.throws = [];
        }

        this.stats = calculateStatistics(this.throws);
        this.updateDisplay();
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
        document.getElementById('lowCount').textContent = categories.low;
        document.getElementById('band60Count').textContent = categories.band60;
        document.getElementById('band80Count').textContent = categories.band80;
        document.getElementById('band100Count').textContent = categories.band100;
        document.getElementById('band140Count').textContent = categories.band140;
        document.getElementById('oneEightyCount').textContent = categories.oneEighty;
    }

    updateLastTenStats() {
        const lastTen = this.stats.lastTenThrows;

        document.getElementById('lastTenZero').textContent = lastTen.zero;
        document.getElementById('lastTenBand100').textContent = lastTen.band100;
        document.getElementById('lastTenBand140').textContent = lastTen.band140;
        document.getElementById('lastTenOneEighty').textContent = lastTen.oneEighty;

        document.getElementById('lastTenSingle').textContent = lastTen.dartTypes.single;
        document.getElementById('lastTenDouble').textContent = lastTen.dartTypes.double;
        document.getElementById('lastTenTriple').textContent = lastTen.dartTypes.triple;
        document.getElementById('lastTenMiss').textContent = lastTen.dartTypes.miss;
    }

    updateAccuracyStats() {
        this.stats.accuracy.byPosition.forEach((value, index) => {
            const element = document.getElementById(`accuracy${index + 1}`);
            const rating = this.getAccuracyRating(value);

            element.textContent = `${Math.round(value * 100)}%`;
            element.className = `accuracy-percent accuracy--${rating.level}`;

            const ratingElement = document.getElementById(`accuracyRating${index + 1}`);
            ratingElement.textContent = rating.label;
        });
    }

    // Bewertung als Level (CSS-Klasse) + Text, damit die Information
    // nicht nur über Farbe transportiert wird (WCAG 1.4.1)
    getAccuracyRating(value) {
        if (value >= 0.8) return { level: 'excellent', label: 'sehr gut' };
        if (value >= 0.6) return { level: 'good', label: 'gut' };
        if (value >= 0.4) return { level: 'fair', label: 'ausbaufähig' };
        return { level: 'poor', label: 'schwach' };
    }

    bindEvents() {
        // Auto-refresh when returning to this page
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });

        window.addEventListener('focus', () => {
            this.refreshData();
        });

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                this.refreshData();
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dartStatsApp = new DartStatisticsApp();
});
