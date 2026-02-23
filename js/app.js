// app.js
document.addEventListener('DOMContentLoaded', () => {
    const categories = WisdomArchive.getAllCategories();
    console.log("Archive Link Established:", categories);
    
    // If this logs an empty array or undefined, you've failed the first step.
});

// App State Management
const AppState = {
    currentCategory: null,
    currentQuestion: null,
    score: {
        correct: 0,
        total: 0
    },
    questionHistory: [],
    bookmarks: [],
    recentDiscoveries: [],
    loading: false
};

// Game Engine
const GameEngine = {
    submitAnswer: async function(categoryId, questionId, answer) {
        const question = WisdomArchive.getQuestion(categoryId, questionId);
        if (!question) {
            Utils.showError('Question not found in archive');
            return;
        }

        const result = WisdomArchive.validateAnswer(categoryId, questionId, answer);
        
        // Store progress
        await ArchiveStorage.progress.updateProgress(categoryId, questionId, result.isCorrect);
        
        // Store discovery in history
        await ArchiveStorage.discoveries.addDiscovery({
            categoryId,
            questionId,
            title: result.discoveryCard.title,
            correct: result.isCorrect
        });
        
        // If offline, queue for sync
        if (!navigator.onLine) {
            await ArchiveStorage.offlineQueue.queueAnswer({
                categoryId,
                questionId,
                answer,
                timestamp: new Date().toISOString()
            });
        }
        
        // Update score
        AppState.questionHistory.push({
            questionId,
            correct: result.isCorrect
        });
        
        if (result.isCorrect) {
            AppState.score.correct++;
        }
        AppState.score.total++;

        // Always show discovery card
        Views.renderDiscovery(question, result);
    },

    // Add bookmark functionality
    toggleBookmark: async function(questionId, categoryId) {
        const bookmarks = await ArchiveStorage.bookmarks.getBookmarks();
        const existing = bookmarks.find(b => b.questionId === questionId);
        
        if (existing) {
            await ArchiveStorage.bookmarks.removeBookmark(existing.id);
            return false; // removed
        } else {
            await ArchiveStorage.bookmarks.addBookmark(questionId, categoryId);
            return true; // added
        }
    }
};

// Utility functions
const Utils = {
    showError: function(message) {
        console.error('[Wisdom Archive]', message);
        // TODO: Implement UI error display
    }
};

// View rendering module
const Views = {
    renderDiscovery: function(question, result) {
        console.log('Discovery Card:', result.discoveryCard);
        // TODO: Implement discovery card rendering
    }
};
