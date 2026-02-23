// app.js - The Archeology Engine (Enhanced but Maintainable)
(function() {
    'use strict';

    // Simple state object
    const State = {
        currentView: 'landing',
        currentCategory: null,
        offline: !navigator.onLine,
        categories: []
    };

    // DOM cache
    const DOM = {
        container: null,
        grid: null,
        main: null
    };

    // Initialize
    function initArchive() {
        cacheDOM();
        setupEventListeners();
        checkOfflineStatus();
        renderLanding();
    }

    function cacheDOM() {
        DOM.container = document.querySelector('.archive-container');
        DOM.main = document.querySelector('main'); // Assuming you have a main element
    }

    function setupEventListeners() {
        window.addEventListener('online', updateOfflineStatus);
        window.addEventListener('offline', updateOfflineStatus);
    }

    function updateOfflineStatus() {
        State.offline = !navigator.onLine;
        if (State.currentView === 'landing') {
            renderLanding();
        }
    }

    function checkOfflineStatus() {
        State.offline = !navigator.onLine;
    }

    // Main render function
    function renderLanding() {
        State.currentView = 'landing';
        
        try {
            // 1. Get categories with error handling
            const categories = WisdomArchive.getAllCategories();
            State.categories = categories;
            
            // 2. Create grid if it doesn't exist
            let grid = document.querySelector('.dossier-grid');
            if (!grid) {
                grid = document.createElement('div');
                grid.className = 'dossier-grid';
                DOM.container.appendChild(grid);
            }
            
            // 3. Clear and render
            grid.innerHTML = '';
            
            categories.forEach(cat => {
                const tome = createTomeElement(cat);
                grid.appendChild(tome);
            });

            // 4. Show offline notice if needed
            if (State.offline) {
                showOfflineNotice();
            }

            // 5. Fade in with smooth transition
            requestAnimationFrame(() => {
                DOM.container.style.opacity = '1';
            });

        } catch (error) {
            console.error('Failed to load archive:', error);
            showErrorMessage('The Archive is temporarily unreachable.');
        }
    }

    function createTomeElement(category) {
        const tome = document.createElement('div');
        tome.className = 'tome';
        tome.setAttribute('role', 'button');
        tome.setAttribute('aria-label', `Open ${category.title}`);
        tome.setAttribute('data-category', category.id);
        
        tome.style.borderLeft = `5px solid ${category.color || '#5d7a5c'}`;

        tome.innerHTML = `
            <div class="tome-cover">
                <span class="tome-icon">${category.icon || '📚'}</span>
                <h2>${category.title}</h2>
            </div>
            <div class="tome-details">
                <p>${category.description || 'Excavate ancient wisdom'}</p>
                <span class="status">${category.questionCount || 0} Artifacts</span>
            </div>
        `;

        tome.addEventListener('click', () => enterDossier(category.id));
        
        return tome;
    }

    function enterDossier(categoryId) {
        // Find category
        const category = State.categories.find(c => c.id === categoryId);
        if (!category) {
            console.error('Category not found:', categoryId);
            return;
        }

        // Update state
        State.currentView = 'game';
        State.currentCategory = categoryId;

        // Smooth transition
        DOM.container.style.opacity = '0';
        
        setTimeout(() => {
            // Load first question
            loadQuestion(categoryId);
        }, 300); // Match CSS transition
    }

    function loadQuestion(categoryId) {
        try {
            const category = WisdomArchive.getCategory(categoryId);
            if (!category || !category.questions || !category.questions.length) {
                throw new Error('No questions found');
            }

            const question = category.questions[0]; // Start with first
            
            // Render question view
            renderQuestion(question, category);

        } catch (error) {
            console.error('Failed to load question:', error);
            showErrorMessage('Failed to excavate this artifact.');
            
            // Return to landing after error
            setTimeout(() => {
                DOM.container.style.opacity = '0';
                setTimeout(() => {
                    renderLanding();
                }, 300);
            }, 2000);
        }
    }

    function renderQuestion(question, category) {
        // Clear container
        DOM.container.innerHTML = '';
        DOM.container.style.opacity = '0';

        // Create question container
        const questionEl = document.createElement('div');
        questionEl.className = 'question-container';

        // Back button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-button';
        backBtn.innerHTML = '← Return to Archive';
        backBtn.addEventListener('click', () => {
            DOM.container.style.opacity = '0';
            setTimeout(() => {
                // Restore original container content (simplified - you'd want better restoration)
                location.reload(); // Quick fix - implement proper restoration later
            }, 300);
        });

        questionEl.appendChild(backBtn);

        // Question card
        const card = document.createElement('div');
        card.className = 'question-card';

        // Handle different question types
        if (question.quote) {
            // Missing Link type
            card.innerHTML = `
                <div class="question-meta">
                    <span class="category-badge">${category.title}</span>
                </div>
                <blockquote>${question.quote}</blockquote>
                <div class="input-group">
                    <input type="text" id="answer-input" placeholder="Enter the missing word...">
                    <button id="submit-answer">Verify</button>
                </div>
                <div class="source-hint">${question.source || ''}</div>
            `;
        } else if (question.claim) {
            // Fact or Phantasm type
            card.innerHTML = `
                <div class="claim-box">
                    <h3>Examine this claim:</h3>
                    <p>"${question.claim}"</p>
                </div>
                <div class="binary-choice">
                    <button class="fact-btn" data-value="true">FACT</button>
                    <button class="phantasm-btn" data-value="false">PHANTASM</button>
                </div>
            `;
        } else if (question.artifact) {
            // Roots type
            card.innerHTML = `
                <div class="artifact-box">
                    <h3>Artifact: ${question.artifact}</h3>
                    <p>${question.originPrompt || 'What is the origin?'}</p>
                </div>
                <div class="options-list">
                    ${question.options.map((opt, idx) => `
                        <button class="option-btn" data-index="${idx}">
                            <span class="option-marker">${String.fromCharCode(65 + idx)}</span>
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        questionEl.appendChild(card);
        DOM.container.appendChild(questionEl);

        // Attach event listeners based on question type
        if (question.quote) {
            document.getElementById('submit-answer').addEventListener('click', () => {
                const answer = document.getElementById('answer-input').value;
                validateAnswer(question, answer, category.id);
            });
            
            document.getElementById('answer-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const answer = e.target.value;
                    validateAnswer(question, answer, category.id);
                }
            });
        } else if (question.claim) {
            document.querySelectorAll('.fact-btn, .phantasm-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const answer = e.target.dataset.value === 'true';
                    validateAnswer(question, answer, category.id);
                });
            });
        } else if (question.options) {
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const answer = parseInt(e.currentTarget.dataset.index);
                    validateAnswer(question, answer, category.id);
                });
            });
        }

        // Fade in
        requestAnimationFrame(() => {
            DOM.container.style.opacity = '1';
        });
    }

    function validateAnswer(question, answer, categoryId) {
        try {
            const result = WisdomArchive.validateAnswer(categoryId, question.id, answer);
            
            // Show discovery card
            showDiscovery(question, result);

            // Track progress in localStorage (simple persistence)
            saveProgress(categoryId, question.id, result.isCorrect);

        } catch (error) {
            console.error('Validation error:', error);
            alert('Error validating answer. Please try again.');
        }
    }

    function showDiscovery(question, result) {
        const card = result.discoveryCard;
        
        // Clear current view
        DOM.container.innerHTML = '';
        DOM.container.style.opacity = '0';

        const discoveryEl = document.createElement('div');
        discoveryEl.className = 'discovery-container';

        discoveryEl.innerHTML = `
            <button class="back-button" id="continue">Continue Excavation →</button>
            
            <div class="discovery-card ${result.isCorrect ? 'correct' : 'incorrect'}">
                <div class="discovery-header">
                    <span class="discovery-status">
                        ${result.isCorrect ? '✓ VERIFIED' : '✗ MISINTERPRETED'}
                    </span>
                    <h2>${card.title}</h2>
                </div>
                
                <div class="discovery-content">
                    <p>${card.content}</p>
                    
                    ${card.furtherReading ? `
                        <div class="further-reading">
                            <h4>Further Reading:</h4>
                            <p>${card.furtherReading}</p>
                        </div>
                    ` : ''}
                    
                    ${card.echo ? `
                        <div class="modern-echo">
                            <h4>The Modern Echo:</h4>
                            <p>${card.echo}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        DOM.container.appendChild(discoveryEl);

        document.getElementById('continue').addEventListener('click', () => {
            // Return to category or load next question
            DOM.container.style.opacity = '0';
            setTimeout(() => {
                // Simple: return to landing
                location.reload(); // Quick fix - implement proper navigation later
            }, 300);
        });

        requestAnimationFrame(() => {
            DOM.container.style.opacity = '1';
        });
    }

    // Simple localStorage progress tracking
    function saveProgress(categoryId, questionId, correct) {
        const key = `wisdom_progress_${categoryId}`;
        const progress = JSON.parse(localStorage.getItem(key) || '{}');
        
        if (!progress[questionId]) {
            progress[questionId] = {
                attempted: true,
                correct: correct,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(key, JSON.stringify(progress));
        }
    }

    function showOfflineNotice() {
        const notice = document.createElement('div');
        notice.className = 'offline-notice';
        notice.textContent = '⚠️ Operating in offline mode';
        DOM.container.prepend(notice);
    }

    function showErrorMessage(message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        DOM.container.prepend(error);
        
        setTimeout(() => {
            error.remove();
        }, 3000);
    }

    // Start the archive
    initArchive();
})();
