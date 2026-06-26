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
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Action" },
];

// ── State ─────────────────────────────────────────────────────
let lastIndex = -1;
let quoteCount = 0;
let favCount = 0;
let isLiked = false;
let isAnimating = false;

// ── DOM Elements ──────────────────────────────────────────────
const quoteCard    = document.getElementById('quote-card');
const quoteText    = document.getElementById('quote-text');
const authorName   = document.getElementById('author-name');
const authorAvatar = document.getElementById('author-avatar');
const authorTitle  = document.getElementById('author-title');
const quoteCategory= document.getElementById('quote-category');
const newQuoteBtn  = document.getElementById('new-quote-btn');
const copyBtn      = document.getElementById('copy-btn');
const shareBtn     = document.getElementById('share-btn');
const likeBtn      = document.getElementById('like-btn');
const favCountEl   = document.getElementById('fav-count');
const counterEl    = document.getElementById('quote-counter');
const statusTime   = document.getElementById('status-time');
const toast        = document.getElementById('toast');
const splashScreen = document.getElementById('splash-screen');
const app          = document.getElementById('app');

// ── Initialize ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateStatusTime();
    setInterval(updateStatusTime, 30000);

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
    isLiked = !isLiked;
    if (isLiked) {
        favCount++;
        likeBtn.classList.add('liked');
        showToast('❤️ Added to favorites!');
    } else {
        favCount = Math.max(0, favCount - 1);
        likeBtn.classList.remove('liked');
    }
    favCountEl.textContent = favCount;
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

    // Reset like state
    isLiked = false;
    likeBtn.classList.remove('liked');

    // Update counter
    quoteCount++;
    counterEl.textContent = `Quote ${quoteCount} of ∞`;
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

// ── Status Bar Clock ──────────────────────────────────────────
function updateStatusTime() {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const h12 = hours % 12 || 12;
    statusTime.textContent = `${h12}:${mins}`;
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
