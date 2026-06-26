/* ═══════════════════════════════════════════════════════════
   QuoteVault — App Logic
   Random Quote Generator PWA
   ═══════════════════════════════════════════════════════════ */

// ── Quote Database ────────────────────────────────────────────
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Leadership" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Wisdom" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Happiness" },
    { text: "Get busy living or get busy dying.", author: "Stephen King", category: "Life" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "Life" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Motivation" },
    { text: "Imagination is more important than knowledge.", author: "Albert Einstein", category: "Wisdom" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Wisdom" },
    { text: "An unexamined life is not worth living.", author: "Socrates", category: "Philosophy" },
    { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", category: "Love" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivation" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James", category: "Inspiration" },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar", category: "Growth" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Motivation" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
    { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Wisdom" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", category: "Success" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "Motivation" },
    { text: "The best revenge is massive success.", author: "Frank Sinatra", category: "Success" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Courage" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama", category: "Happiness" },
    { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington", category: "Kindness" },
    { text: "Whoever is happy will make others happy too.", author: "Anne Frank", category: "Happiness" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivation" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Persistence" },
    { text: "Everything has beauty, but not everyone sees it.", author: "Confucius", category: "Beauty" },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "Wisdom" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "Resilience" },
    { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey", category: "Gratitude" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Action" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "Life" },
    { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt", category: "Life" },
    { text: "In order to write about life first you must live it.", author: "Ernest Hemingway", category: "Life" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Action" }
];

// ── State ─────────────────────────────────────────────────────
let lastIndex = -1;
let quoteCount = 0;
let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
let isAnimating = false;

// ── DOM Elements ──────────────────────────────────────────────
const quoteCard            = document.getElementById('quote-card');
const quoteText            = document.getElementById('quote-text');
const authorName           = document.getElementById('author-name');
const authorAvatar         = document.getElementById('author-avatar');
const authorTitle          = document.getElementById('author-title');
const quoteCategory        = document.getElementById('quote-category');
const newQuoteBtn          = document.getElementById('new-quote-btn');
const copyBtn              = document.getElementById('copy-btn');
const shareBtn             = document.getElementById('share-btn');
const likeBtn              = document.getElementById('like-btn');
const favCountEl           = document.getElementById('fav-count');
const counterEl            = document.getElementById('quote-counter');
const toast                = document.getElementById('toast');
const splashScreen         = document.getElementById('splash-screen');
const app                  = document.getElementById('app');

const headerTitle          = document.getElementById('header-title');
const headerTagline        = document.getElementById('header-tagline');

const homeView             = document.getElementById('home-view');
const savedView             = document.getElementById('saved-view');
const navHome              = document.getElementById('nav-home');
const navSaved             = document.getElementById('nav-saved');
const savedQuotesContainer = document.getElementById('saved-quotes-container');

// ── Initialize ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateFavBadge();

    // Show app after splash
    setTimeout(() => {
        app.classList.remove('hidden');
        showNewQuote(false);
    }, 800);

    // Remove splash from DOM after animation
    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 2800);
});

// ── Navigation ───────────────────────────────────────────────
navHome.addEventListener('click', () => {
    switchView('home');
});

navSaved.addEventListener('click', () => {
    switchView('saved');
});

function switchView(viewName) {
    if (viewName === 'home') {
        navHome.classList.add('active');
        navSaved.classList.remove('active');
        homeView.classList.remove('hidden');
        savedView.classList.add('hidden');
        headerTitle.textContent = "QuoteVault";
        headerTagline.textContent = "Tap to get inspired";
    } else {
        navHome.classList.remove('active');
        navSaved.classList.add('active');
        homeView.classList.add('hidden');
        savedView.classList.remove('hidden');
        headerTitle.textContent = "Saved Quotes";
        headerTagline.textContent = "Your personal library";
        renderSavedQuotes();
    }
}

// ── Event Listeners ───────────────────────────────────────────
newQuoteBtn.addEventListener('click', () => showNewQuote(true));

copyBtn.addEventListener('click', () => {
    const q = quotes[lastIndex];
    const text = `"${q.text}" — ${q.author}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Copied to clipboard!');
    }).catch(() => {
        showToast('📋 Copy failed');
    });
});

shareBtn.addEventListener('click', () => {
    const q = quotes[lastIndex];
    const text = `"${q.text}" — ${q.author}`;
    if (navigator.share) {
        navigator.share({ title: 'QuoteVault', text: text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📤 Quote copied for sharing!');
        });
    }
});

likeBtn.addEventListener('click', () => {
    const currentQuote = quotes[lastIndex];
    const index = savedQuotes.findIndex(q => q.text === currentQuote.text);

    if (index === -1) {
        // Save
        savedQuotes.push(currentQuote);
        likeBtn.classList.add('liked');
        showToast('❤️ Added to saved!');
    } else {
        // Remove
        savedQuotes.splice(index, 1);
        likeBtn.classList.remove('liked');
        showToast('💔 Removed from saved!');
    }
    localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
    updateFavBadge();
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

quoteCard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

quoteCard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
        showNewQuote(true);
    }
}, { passive: true });

// ── Show New Quote ────────────────────────────────────────────
function showNewQuote(animate) {
    if (isAnimating) return;

    // Pick random non-repeating quote
    let index;
    do {
        index = Math.floor(Math.random() * quotes.length);
    } while (index === lastIndex && quotes.length > 1);
    lastIndex = index;

    const quote = quotes[index];

    if (animate) {
        isAnimating = true;

        // Swipe out
        quoteCard.classList.add('animating-out');

        setTimeout(() => {
            // Update content while hidden
            updateQuoteContent(quote);

            // Prepare to swipe in from right
            quoteCard.classList.remove('animating-out');
            quoteCard.classList.add('animating-in');

            // Force reflow
            void quoteCard.offsetHeight;

            // Swipe in
            requestAnimationFrame(() => {
                quoteCard.classList.remove('animating-in');
                quoteCard.classList.add('animating-settle');

                setTimeout(() => {
                    quoteCard.classList.remove('animating-settle');
                    isAnimating = false;
                }, 400);
            });
        }, 400);
    } else {
        updateQuoteContent(quote);
    }

    // Set correct like button state
    const isAlreadySaved = savedQuotes.some(q => q.text === quote.text);
    if (isAlreadySaved) {
        likeBtn.classList.add('liked');
    } else {
        likeBtn.classList.remove('liked');
    }

    // Update counter
    quoteCount++;
    counterEl.textContent = `Quote ${quoteCount} viewed`;
}

// ── Update Quote Content ──────────────────────────────────────
function updateQuoteContent(quote) {
    quoteText.textContent = quote.text;
    authorName.textContent = quote.author;
    authorAvatar.textContent = quote.author.charAt(0).toUpperCase();
    quoteCategory.textContent = quote.category;

    // Random accent color for avatar based on category
    const colors = [
        'linear-gradient(135deg, #7c3aed, #2dd4bf)',
        'linear-gradient(135deg, #ec4899, #f59e0b)',
        'linear-gradient(135deg, #06b6d4, #3b82f6)',
        'linear-gradient(135deg, #f97316, #ef4444)',
        'linear-gradient(135deg, #10b981, #059669)',
    ];
    const colorIndex = quote.category.length % colors.length;
    authorAvatar.style.background = colors[colorIndex];

    // Determine author title based on known authors
    const titles = {
        'Steve Jobs': 'Co-founder, Apple',
        'Albert Einstein': 'Theoretical Physicist',
        'Dalai Lama': 'Spiritual Leader',
        'Confucius': 'Chinese Philosopher',
        'Nelson Mandela': 'Former President, SA',
        'Winston Churchill': 'Former Prime Minister, UK',
        'Theodore Roosevelt': '26th US President',
        'Socrates': 'Greek Philosopher',
        'Buddha': 'Spiritual Teacher',
        'Walt Disney': 'Founder, Disney',
        'Mark Twain': 'Author & Humorist',
        'Oprah Winfrey': 'Media Mogul',
        'Mother Teresa': 'Humanitarian',
        'John Lennon': 'Musician, The Beatles',
        'Eleanor Roosevelt': 'Former First Lady',
        'Stephen King': 'Author',
        'Frank Sinatra': 'Singer & Actor',
        'Ernest Hemingway': 'Novelist',
        'Henry Ford': 'Founder, Ford Motor Co.',
    };
    authorTitle.textContent = titles[quote.author] || 'Author';
}

// ── Update Favorites Badge ─────────────────────────────────────
function updateFavBadge() {
    favCountEl.textContent = savedQuotes.length;
}

// ── Render Saved Quotes List ───────────────────────────────────
function renderSavedQuotes() {
    savedQuotesContainer.innerHTML = '';

    if (savedQuotes.length === 0) {
        savedQuotesContainer.innerHTML = `
            <div class="no-saved-quotes">
                <div class="empty-icon">❤️</div>
                <p class="empty-title">No saved quotes yet</p>
                <p class="empty-desc">Tap the Like button on quotes you love to see them here.</p>
            </div>
        `;
        return;
    }

    savedQuotes.forEach((quote, idx) => {
        const item = document.createElement('div');
        item.className = 'saved-quote-card';
        item.innerHTML = `
            <p class="saved-quote-text">"${quote.text}"</p>
            <div class="saved-quote-footer">
                <span class="saved-quote-author">— ${quote.author}</span>
                <button class="delete-btn" data-index="${idx}" aria-label="Delete saved quote">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;

        // Delete button listener
        item.querySelector('.delete-btn').addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
            savedQuotes.splice(index, 1);
            localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
            updateFavBadge();
            renderSavedQuotes();
            showToast('💔 Removed from saved!');

            // If the quote currently displayed on home view was deleted, un-like it
            const currentQuote = quotes[lastIndex];
            if (currentQuote && currentQuote.text === quote.text) {
                likeBtn.classList.remove('liked');
            }
        });

        savedQuotesContainer.appendChild(item);
    });
}

// ── Toast Notification ────────────────────────────────────────
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── Service Worker Registration ───────────────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}
