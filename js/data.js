// data.js - The Wisdom Archive Knowledge Library
// Every echo, every root, every phantasm catalogued here.

const WisdomArchive = (function() {
    // Core data structure - immutable and hierarchical
    const categories = {
        'missing-link': {
            id: 'missing-link',
            title: 'The Missing Link',
            icon: '🔍',
            description: 'Restore legendary wisdom by finding words lost to time.',
            color: '#d4b68a',
            questions: [
                {
                    id: 'ml-001',
                    quote: 'The unexamined life is not worth _____.',
                    missingWord: 'living',
                    source: 'Socrates, Apology (38a)',
                    era: '399 BCE',
                    discoveryCard: {
                        title: 'The Trial of Wisdom',
                        content: 'Socrates spoke these words at his trial, choosing death over silence. The phrase "examined life" became the foundation of Western philosophy—but the original Greek word "exetasis" means something closer to "scrutiny under torture." The examined life isn\'t comfortable; it\'s agonizing.',
                        furtherReading: 'Plato\'s Apology describes how Athens killed a man for asking too many questions.',
                        echo: 'Modern usage softens this to mean "self-reflection," but Socrates meant public, relentless questioning of authority.'
                    }
                },
                {
                    id: 'ml-002',
                    quote: 'The fault, dear Brutus, is not in our stars, / But in ourselves, that we are _____.',
                    missingWord: 'underlings',
                    source: 'Shakespeare, Julius Caesar (Act I, Scene II)',
                    era: '1599',
                    discoveryCard: {
                        title: 'Astrology vs. Agency',
                        content: 'Cassius speaks these words to manipulate Brutus, arguing that fate (the stars) doesn\'t control their destiny—their own passivity does. Shakespeare was writing during the "Elizabethan World Picture" when celestial determinism was still widely believed. This line was radical.',
                        furtherReading: 'The Renaissance marked the shift from "fortune" to "human agency."',
                        echo: 'We still say "star-crossed lovers" (Romeo and Juliet) but forget Shakespeare gave us the tools to reject astrological determinism.'
                    }
                },
                {
                    id: 'ml-003',
                    quote: 'Power tends to corrupt, and absolute power corrupts _____.',
                    missingWord: 'absolutely',
                    source: 'Lord Acton (Letter to Bishop Mandell Creighton)',
                    era: '1887',
                    discoveryCard: {
                        title: 'The Historian\'s Warning',
                        content: 'Lord Acton was writing about papal infallibility, not political power. The full context: "Great men are almost always bad men." He believed historians should judge without mercy because power dynamics corrupt moral judgment itself.',
                        furtherReading: 'Acton\'s maxim influenced Lord Bryce\'s "American Commonwealth" and became a cornerstone of modern political science.',
                        echo: 'We apply this to dictators, but Acton meant even "good" institutions become corrupt through the exercise of power.'
                    }
                }
            ]
        },
        
        'fact-phantasm': {
            id: 'fact-phantasm',
            title: 'Fact or Phantasm',
            icon: '👻',
            description: 'Separate historical truth from collective delusion.',
            color: '#8b7e6b',
            questions: [
                {
                    id: 'fp-001',
                    claim: 'Napoleon Bonaparte was extremely short.',
                    isFact: false,  // It's a phantasm
                    factCheck: 'Napoleon was 5\'7" (1.68m), average height for Frenchmen of his era. The myth stems from confusion between French and English inches, and British propaganda cartoons.',
                    discoveryCard: {
                        title: 'The Tall Tale of the Short Emperor',
                        content: 'British caricaturists depicted Napoleon as a tiny tyrant to mock him. The "Napoleon Complex" (insecure short man syndrome) was invented decades after his death. In reality, he was often called "le petit caporal" as a term of endearment, not a height reference.',
                        furtherReading: 'British propaganda during the Napoleonic Wars created enduring stereotypes that historians still fight.',
                        echo: 'We still call aggressive short men "Napoleonic" despite zero evidence.'
                    }
                },
                {
                    id: 'fp-002',
                    claim: 'Vikings wore horned helmets.',
                    isFact: false,
                    factCheck: 'No archaeological evidence supports horned helmets. The myth was created for 19th-century opera costumes (Wagner\'s "Der Ring des Nibelungen").',
                    discoveryCard: {
                        title: 'Opera vs. Archaeology',
                        content: 'The only authentic Viking helmets found are simple iron or leather caps. Horned helmets would have been impractical in combat. Illustrator Carl Emil Doepler created them for Wagner\'s operas in 1876, and pop culture never let go.',
                        furtherReading: 'The Viking Age (793–1066) left extensive grave goods—no horns.',
                        echo: 'We\'ve replaced historical Norse culture with a romanticized warrior myth.'
                    }
                },
                {
                    id: 'fp-003',
                    claim: 'Humans only use 10% of their brains.',
                    isFact: false,
                    factCheck: 'Brain imaging shows virtually all parts have function. The myth originated from a misinterpretation of early neuroscience and self-help misquotes.',
                    discoveryCard: {
                        title: 'The 90% Fallacy',
                        content: 'This myth was popularized by psychologist William James, who said people only tap a fraction of their potential—not their brain tissue. Self-help gurus ran with it. fMRI scans prove we use nearly all brain regions daily.',
                        furtherReading: 'Neuroplasticity shows unused brain areas get repurposed, not left dormant.',
                        echo: 'Perpetuated by movies like "Lucy" and "Limitless," it sells the idea of hidden potential.'
                    }
                }
            ]
        },
        
        'roots': {
            id: 'roots',
            title: 'The Roots',
            icon: '🌳',
            description: 'Excavate the physical and social origins of common things.',
            color: '#5d7a5c',
            questions: [
                {
                    id: 'rt-001',
                    artifact: 'Standard railroad gauge (4\'8.5")',
                    originPrompt: 'This seemingly arbitrary measurement traces directly to:',
                    options: [
                        'Roman chariot wheel spacing',
                        'Early coal mine wagon tracks',
                        'The first steam engine dimensions',
                        'A medieval road width standard'
                    ],
                    correctIndex: 0,  // Roman chariot wheel spacing
                    discoveryCard: {
                        title: 'The Horse\'s Ass Theory of History',
                        content: 'Roman roads created ruts from chariot wheels (spaced for two warhorses). Centuries later, British wagon builders used those ruts as guides. Railways adopted wagon dimensions. The Space Shuttle boosters were built in Utah and shipped by rail—constrained by Roman warhorses.',
                        furtherReading: 'This is often cited as "path dependence" in technology studies. The Romans never imagined space travel, yet their horses shaped it.',
                        echo: 'Every time you see a train, you\'re seeing the ghost of Roman infrastructure.'
                    }
                },
                {
                    id: 'rt-002',
                    artifact: 'Handshakes',
                    originPrompt: 'The original purpose of the handshake was:',
                    options: [
                        'A greeting between equals',
                        'Showing you carried no weapons',
                        'Sealing a business contract',
                        'A religious ritual'
                    ],
                    correctIndex: 1,  // Showing no weapons
                    discoveryCard: {
                        title: 'The Empty Hand',
                        content: 'Ancient Greeks shook right hands to prove neither held a weapon. The gesture signified trust between strangers. Medieval knights shook vigorously to dislodge hidden daggers. Modern handshakes retain the form but lost the function.',
                        furtherReading: 'Some cultures bow instead—different solutions to the same trust problem.',
                        echo: 'The "dominant hand" theory explains why left-handed handshakes feel wrong.'
                    }
                },
                {
                    id: 'rt-003',
                    artifact: 'QWERTY keyboard',
                    originPrompt: 'The QWERTY layout was designed to:',
                    options: [
                        'Maximize typing speed',
                        'Prevent typewriter jams',
                        'Alphabetical arrangement with constraints',
                        'Make learning easier'
                    ],
                    correctIndex: 1,  // Prevent typewriter jams
                    discoveryCard: {
                        title: 'The Jamming Problem',
                        content: 'Early typewriters jammed when adjacent keys were struck quickly. QWERTY separated common letter pairs to slow typists down—intentionally inefficient. The Dvorak layout (1930s) is faster but never overcame QWERTY\'s head start.',
                        furtherReading: 'Network effects: once millions learned QWERTY, switching costs outweighed benefits.',
                        echo: 'We still use a keyboard designed to be slow because of 19th-century mechanical limits.'
                    }
                }
            ]
        }
    };

    // Public API
    return {
        // Get all categories with metadata
        getAllCategories: function() {
            return Object.keys(categories).map(key => ({
                id: categories[key].id,
                title: categories[key].title,
                icon: categories[key].icon,
                description: categories[key].description,
                color: categories[key].color,
                questionCount: categories[key].questions.length
            }));
        },

        // Get full category data including questions
        getCategory: function(categoryId) {
            return categories[categoryId] || null;
        },

        // Get a specific question by ID
        getQuestion: function(categoryId, questionId) {
            const category = categories[categoryId];
            if (!category) return null;
            return category.questions.find(q => q.id === questionId) || null;
        },

        // Get random question from category (for replayability)
        getRandomQuestion: function(categoryId) {
            const category = categories[categoryId];
            if (!category) return null;
            const randomIndex = Math.floor(Math.random() * category.questions.length);
            return category.questions[randomIndex];
        },

        // Validate answer and return discovery card
        validateAnswer: function(categoryId, questionId, userAnswer) {
            const question = this.getQuestion(categoryId, questionId);
            if (!question) return null;

            let isCorrect = false;
            
            // Handle different question types
            if (question.hasOwnProperty('missingWord')) {
                // String matching - case insensitive, trim
                isCorrect = userAnswer.trim().toLowerCase() === question.missingWord.toLowerCase();
            } else if (question.hasOwnProperty('isFact')) {
                // Boolean matching
                isCorrect = (userAnswer === question.isFact);
            } else if (question.hasOwnProperty('correctIndex')) {
                // Multiple choice index
                isCorrect = (userAnswer === question.correctIndex);
            }

            return {
                isCorrect: isCorrect,
                discoveryCard: question.discoveryCard,
                source: question.source || question.factCheck,
                // Always return the educational content regardless of correctness
                educationalContent: question.discoveryCard
            };
        }
    };
})();

// Expose globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WisdomArchive;
}