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
                
                // Create throws store
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

    async removeLastThrow() {
        if (!this.db) throw new Error('Database not initialized');
        
        const throws = await this.getAllThrows();
        if (throws.length === 0) return null;
        
        // Find most recent throw
        const lastThrow = throws.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        
        const transaction = this.db.transaction(['throws'], 'readwrite');
        const store = transaction.objectStore('throws');
        
        return new Promise((resolve, reject) => {
            const request = store.delete(lastThrow.id);
            
            request.onsuccess = () => resolve(lastThrow);
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
    
    const prefix = dart.type === 'single' ? '' : 
                  dart.type === 'double' ? 'D' : 'T';
    
    return `${prefix}${dart.points / (dart.type === 'single' ? 1 : dart.type === 'double' ? 2 : 3)}`;
}

function calculatePoints(target, type) {
    if (type === 'miss') return 0;
    
    if (target === 25) { // Bull
        return type === 'single' ? 25 : 50; // Outer Bull vs Bull
    }
    
    const multiplier = type === 'single' ? 1 : 
                      type === 'double' ? 2 : 3;
    
    return target * multiplier;
}

// === STATISTICS CALCULATIONS ===
function calculateStatistics(throws) {
    const stats = {
        totalDarts: 0,
        totalThrows: 0,
        totalPoints: 0,
        categories: {
            zero: 0,
            sixtyPlus: 0,
            eightyPlus: 0,
            hundredPlus: 0,
            hundredFortyPlus: 0,
            oneEighty: 0
        },
        lastTenThrows: {
            zero: 0,
            hundredPlus: 0,
            hundredFortyPlus: 0,
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
    let actualDartsCount = 0;

    throws.forEach(throwData => {
        stats.totalPoints += throwData.totalPoints;

        // Categorize throw
        const points = throwData.totalPoints;
        if (points === 0) stats.categories.zero++;
        else if (points >= 60 && points < 80) stats.categories.sixtyPlus++;
        else if (points >= 80 && points < 100) stats.categories.eightyPlus++;
        else if (points >= 100 && points < 140) stats.categories.hundredPlus++;
        else if (points >= 140 && points < 180) stats.categories.hundredFortyPlus++;
        else if (points === 180) stats.categories.oneEighty++;

        // Count hits for accuracy (only count actual darts)
        throwData.darts.forEach((dart, index) => {
            if (dart && dart !== null) {
                actualDartsCount++;
                if (dart.hit) {
                    totalHits++;
                    positionHits[index]++;
                }
            }
        });
    });

    stats.totalDarts = actualDartsCount;

    // Calculate accuracy
    stats.accuracy.overall = stats.totalDarts > 0 ? (totalHits / stats.totalDarts) : 0;
    // For each position: hits at position / total darts at position (= totalThrows for positions 1-3)
    stats.accuracy.byPosition = positionHits.map(hits => stats.totalThrows > 0 ? hits / stats.totalThrows : 0);

    // Last 10 throws statistics
    const lastTen = throws.slice(-10);
    lastTen.forEach(throwData => {
        const points = throwData.totalPoints;
        if (points === 0) stats.lastTenThrows.zero++;
        else if (points >= 100 && points < 140) stats.lastTenThrows.hundredPlus++;
        else if (points >= 140 && points < 180) stats.lastTenThrows.hundredFortyPlus++;
        else if (points === 180) stats.lastTenThrows.oneEighty++;

        throwData.darts.forEach(dart => {
            stats.lastTenThrows.dartTypes[dart.type]++;
        });
    });

    return stats;
}

// Global database instance
const dartDB = new DartDB();