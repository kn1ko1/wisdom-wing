// storage.js - Wisdom Archive Persistent Storage
// Manages user progress, bookmarks, and offline answer queue

const ArchiveStorage = (function() {
    const DB_NAME = 'WisdomArchiveDB';
    const DB_VERSION = 2;
    const STORES = {
        PROGRESS: 'userProgress',
        BOOKMARKS: 'bookmarks',
        OFFLINE_ANSWERS: 'offlineAnswers',
        DISCOVERY_HISTORY: 'discoveryHistory'
    };

    let db = null;

    // Initialize database
    async function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('[ArchiveStorage] Database error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                db = request.result;
                console.log('[ArchiveStorage] Database initialized');
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create stores if they don't exist
                if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
                    const progressStore = db.createObjectStore(STORES.PROGRESS, { keyPath: 'categoryId' });
                    progressStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
                    const bookmarkStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'id', autoIncrement: true });
                    bookmarkStore.createIndex('questionId', 'questionId', { unique: false });
                    bookmarkStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.OFFLINE_ANSWERS)) {
                    const offlineStore = db.createObjectStore(STORES.OFFLINE_ANSWERS, { keyPath: 'id', autoIncrement: true });
                    offlineStore.createIndex('synced', 'synced', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.DISCOVERY_HISTORY)) {
                    const historyStore = db.createObjectStore(STORES.DISCOVERY_HISTORY, { keyPath: 'id', autoIncrement: true });
                    historyStore.createIndex('timestamp', 'timestamp', { unique: false });
                    historyStore.createIndex('categoryId', 'categoryId', { unique: false });
                }
            };
        });
    }

    // User Progress Tracking
    const Progress = {
        async updateProgress(categoryId, questionId, correct) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.PROGRESS], 'readwrite');
            const store = transaction.objectStore(STORES.PROGRESS);
            
            const progress = await this.getProgress(categoryId) || {
                categoryId,
                totalAttempts: 0,
                correctAnswers: 0,
                completedQuestions: [],
                lastAccessed: new Date().toISOString()
            };
            
            progress.totalAttempts++;
            if (correct) progress.correctAnswers++;
            
            if (!progress.completedQuestions.includes(questionId)) {
                progress.completedQuestions.push(questionId);
            }
            
            progress.lastAccessed = new Date().toISOString();
            
            return new Promise((resolve, reject) => {
                const request = store.put(progress);
                request.onsuccess = () => resolve(progress);
                request.onerror = () => reject(request.error);
            });
        },

        async getProgress(categoryId) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.PROGRESS], 'readonly');
            const store = transaction.objectStore(STORES.PROGRESS);
            
            return new Promise((resolve, reject) => {
                const request = store.get(categoryId);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async getAllProgress() {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.PROGRESS], 'readonly');
            const store = transaction.objectStore(STORES.PROGRESS);
            
            return new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
    };

    // Bookmark System
    const Bookmarks = {
        async addBookmark(questionId, categoryId, notes = '') {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.BOOKMARKS], 'readwrite');
            const store = transaction.objectStore(STORES.BOOKMARKS);
            
            const bookmark = {
                questionId,
                categoryId,
                notes,
                timestamp: new Date().toISOString()
            };
            
            return new Promise((resolve, reject) => {
                const request = store.add(bookmark);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async removeBookmark(bookmarkId) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.BOOKMARKS], 'readwrite');
            const store = transaction.objectStore(STORES.BOOKMARKS);
            
            return new Promise((resolve, reject) => {
                const request = store.delete(bookmarkId);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },

        async getBookmarks(categoryId = null) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.BOOKMARKS], 'readonly');
            const store = transaction.objectStore(STORES.BOOKMARKS);
            
            return new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => {
                    let bookmarks = request.result;
                    if (categoryId) {
                        bookmarks = bookmarks.filter(b => b.categoryId === categoryId);
                    }
                    resolve(bookmarks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                };
                request.onerror = () => reject(request.error);
            });
        }
    };

    // Offline Answer Queue
    const OfflineQueue = {
        async queueAnswer(answerData) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.OFFLINE_ANSWERS], 'readwrite');
            const store = transaction.objectStore(STORES.OFFLINE_ANSWERS);
            
            const offlineAnswer = {
                ...answerData,
                timestamp: new Date().toISOString(),
                synced: false
            };
            
            return new Promise((resolve, reject) => {
                const request = store.add(offlineAnswer);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async getUnsyncedAnswers() {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.OFFLINE_ANSWERS], 'readonly');
            const store = transaction.objectStore(STORES.OFFLINE_ANSWERS);
            const index = store.index('synced');
            
            return new Promise((resolve, reject) => {
                const request = index.getAll(false);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async markAsSynced(answerIds) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.OFFLINE_ANSWERS], 'readwrite');
            const store = transaction.objectStore(STORES.OFFLINE_ANSWERS);
            
            return Promise.all(answerIds.map(id => {
                return new Promise((resolve, reject) => {
                    const getRequest = store.get(id);
                    getRequest.onsuccess = () => {
                        const answer = getRequest.result;
                        answer.synced = true;
                        const putRequest = store.put(answer);
                        putRequest.onsuccess = () => resolve();
                        putRequest.onerror = () => reject(putRequest.error);
                    };
                    getRequest.onerror = () => reject(getRequest.error);
                });
            }));
        }
    };

    // Discovery History
    const DiscoveryHistory = {
        async addDiscovery(discoveryData) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.DISCOVERY_HISTORY], 'readwrite');
            const store = transaction.objectStore(STORES.DISCOVERY_HISTORY);
            
            const entry = {
                ...discoveryData,
                timestamp: new Date().toISOString()
            };
            
            return new Promise((resolve, reject) => {
                const request = store.add(entry);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async getRecentDiscoveries(limit = 10) {
            if (!db) await initDB();
            
            const transaction = db.transaction([STORES.DISCOVERY_HISTORY], 'readonly');
            const store = transaction.objectStore(STORES.DISCOVERY_HISTORY);
            const index = store.index('timestamp');
            
            return new Promise((resolve, reject) => {
                const request = index.getAll();
                request.onsuccess = () => {
                    const discoveries = request.result
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, limit);
                    resolve(discoveries);
                };
                request.onerror = () => reject(request.error);
            });
        }
    };

    // Public API
    return {
        init: initDB,
        progress: Progress,
        bookmarks: Bookmarks,
        offlineQueue: OfflineQueue,
        discoveries: DiscoveryHistory,
        
        // Utility: Clear all data (for testing)
        async clearAll() {
            if (!db) await initDB();
            
            const stores = Object.values(STORES);
            const transaction = db.transaction(stores, 'readwrite');
            
            return Promise.all(stores.map(storeName => {
                const store = transaction.objectStore(storeName);
                return new Promise((resolve, reject) => {
                    const request = store.clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            }));
        }
    };
})();

// Auto-initialize
ArchiveStorage.init().catch(console.error);
