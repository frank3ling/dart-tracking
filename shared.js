// === SHARED APP UTILITIES ===
class DartDB {
    constructor() {
        this.db = null;
        this.dbName = 'DartTrainingDB';
        this.version = 1;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('IndexedDB Error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                if (!this.db.objectStoreNames.contains('throws')) {
                    const throwStore = this.db.createObjectStore('throws', { keyPath: 'id' });
                    throwStore.createIndex('timestamp', 'timestamp', { unique: false });
                    throwStore.createIndex('target', 'target', { unique: false });
                    throwStore.createIndex('totalPoints', 'totalPoints', { unique: false });
                }
            };
        });
    }

    async saveThrow(throwData) {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['throws'], 'readwrite');
        const store = transaction.objectStore('throws');

        return new Promise((resolve, reject) => {
            const request = store.add(throwData);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllThrows() {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['throws'], 'readonly');
        const store = transaction.objectStore('throws');

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getRecentThrows(limit = 10) {
        const allThrows = await this.getAllThrows();
        return allThrows
            .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
            .slice(0, limit);
    }

    async deleteThrow(throwId) {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['throws'], 'readwrite');
        const store = transaction.objectStore('throws');

        return new Promise((resolve, reject) => {
            const request = store.delete(throwId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearAllData() {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['throws'], 'readwrite');
        const store = transaction.objectStore('throws');

        return new Promise((resolve, reject) => {
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// === UTILITY FUNCTIONS ===
function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function formatDartResult(dart) {
    if (dart.type === 'miss') return 'Miss';

    const label = dart.target === 25 ? 'B' : dart.target;
    const prefix = dart.type === 'single' ? '' :
                  dart.type === 'double' ? 'D' : 'T';

    return `${prefix}${label}`;
}

function calculatePoints(target, type) {
    if (type === 'miss') return 0;

    if (target === 25) { // Bull: nur Single (25) und Double (50), Triple existiert nicht
        return type === 'single' ? 25 : 50;
    }

    const multiplier = type === 'single' ? 1 :
                      type === 'double' ? 2 : 3;

    return target * multiplier;
}

// === STATISTICS CALCULATIONS ===
// Kategorien als Punktebänder: low = 1-59, band60 = 60-79, band80 = 80-99,
// band100 = 100-139, band140 = 140-179, oneEighty = 180
function calculateStatistics(throws) {
    const stats = {
        totalDarts: 0,
        totalThrows: 0,
        totalPoints: 0,
        categories: {
            zero: 0,
            low: 0,
            band60: 0,
            band80: 0,
            band100: 0,
            band140: 0,
            oneEighty: 0
        },
        lastTenThrows: {
            zero: 0,
            band100: 0,
            band140: 0,
            oneEighty: 0,
            dartTypes: {
                single: 0,
                double: 0,
                triple: 0,
                miss: 0
            }
        },
        accuracy: {
            overall: 0,
            byPosition: [0, 0, 0]
        }
    };

    if (throws.length === 0) return stats;

    stats.totalThrows = throws.length;

    let totalHits = 0;
    const positionHits = [0, 0, 0];
    const positionDarts = [0, 0, 0];
    let actualDartsCount = 0;

    throws.forEach(throwData => {
        stats.totalPoints += throwData.totalPoints;

        const points = throwData.totalPoints;
        if (points === 0) stats.categories.zero++;
        else if (points < 60) stats.categories.low++;
        else if (points < 80) stats.categories.band60++;
        else if (points < 100) stats.categories.band80++;
        else if (points < 140) stats.categories.band100++;
        else if (points < 180) stats.categories.band140++;
        else stats.categories.oneEighty++;

        throwData.darts.forEach((dart, index) => {
            if (dart) {
                actualDartsCount++;
                positionDarts[index]++;
                if (dart.hit) {
                    totalHits++;
                    positionHits[index]++;
                }
            }
        });
    });

    stats.totalDarts = actualDartsCount;

    stats.accuracy.overall = stats.totalDarts > 0 ? (totalHits / stats.totalDarts) : 0;
    stats.accuracy.byPosition = positionHits.map((hits, index) =>
        positionDarts[index] > 0 ? hits / positionDarts[index] : 0);

    const lastTen = throws.slice(-10);
    lastTen.forEach(throwData => {
        const points = throwData.totalPoints;
        if (points === 0) stats.lastTenThrows.zero++;
        else if (points >= 100 && points < 140) stats.lastTenThrows.band100++;
        else if (points >= 140 && points < 180) stats.lastTenThrows.band140++;
        else if (points === 180) stats.lastTenThrows.oneEighty++;

        throwData.darts.forEach(dart => {
            if (dart && dart.type in stats.lastTenThrows.dartTypes) {
                stats.lastTenThrows.dartTypes[dart.type]++;
            }
        });
    });

    return stats;
}

// === SERVICE WORKER REGISTRATION ===
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}

// Global database instance (nur im Browser)
const dartDB = typeof indexedDB !== 'undefined' ? new DartDB() : null;

// Export für Unit-Tests (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateUUID, formatDartResult, calculatePoints, calculateStatistics, DartDB };
}
