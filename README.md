# QuoteVault — Random Quote Generator 📱

A mobile-first Progressive Web App (PWA) that displays random inspirational quotes. Built with HTML, CSS, and JavaScript.

## Features

- 🎯 **Random Quote Display** — A new inspiring quote every time you open the app or tap the button
- ✨ **Swipe Card Animation** — Smooth card transitions when switching quotes
- 📋 **Copy to Clipboard** — Tap to copy any quote instantly
- 📤 **Share** — Share quotes directly via the native share menu (mobile)
- ❤️ **Like & Favorite** — Save your favorite quotes
- 🌙 **Premium Dark UI** — Glassmorphism design with gradient accents
- 📱 **Installable** — Add to your home screen for a native app experience
- 🔌 **Works Offline** — Service Worker caches all assets for offline use
- 👆 **Touch Gestures** — Swipe left or right on the card for a new quote

## Screenshots

The app features a splash screen on launch, a quote card with author info, action buttons (Share, Copy, Like), and a bottom navigation bar — all styled to look like a native mobile application.

## How to Run

### Option 1: GitHub Pages (Recommended)
1. Push this repository to GitHub
2. Go to **Settings → Pages → Source: main branch**
3. Your app will be live at `https://yourusername.github.io/repo-name/`
4. Open the link on your phone to use it as a mobile app

### Option 2: Local Development
```bash
# Any local server works. For example:
npx serve .
# or
python -m http.server 8000
```

## Tech Stack

- **HTML5** — Semantic structure with PWA meta tags
- **CSS3** — Custom properties, glassmorphism, gradient animations
- **JavaScript** — Vanilla JS, no frameworks
- **PWA** — Web App Manifest + Service Worker for installability

## Install on Phone

1. Open the app URL in Chrome (Android) or Safari (iOS)
2. Tap **"Add to Home Screen"** from the browser menu
3. The app will appear on your home screen like a native app

## Project Structure

```
├── index.html          # Main app HTML
├── style.css           # All styles (mobile-first)
├── app.js              # Quote logic & interactions
├── manifest.json       # PWA manifest (installability)
├── sw.js               # Service Worker (offline support)
├── icon-192.png        # App icon 192x192
├── icon-512.png        # App icon 512x512
└── README.md           # This file
```

## License

This project is open source and available under the [MIT License](LICENSE).
