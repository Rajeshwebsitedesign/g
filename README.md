# G.P. Dental Care — Static Single-Page Website

## Project structure

```text
gp-dental-final/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── images/
```

The HTML, CSS, and JavaScript are kept in separate files as requested.

## Preview on your computer

### Visual Studio Code

1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.

### Python local server

Run this command inside the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Features included

- Sticky top contact bar and responsive header
- Desktop navigation with FAQ kept in the same row
- Mobile slide-out navigation
- Google Translate controls for English and Nepali
- Smooth floating hero character animation
- Hero image appears before the text on mobile and small screens
- Responsive service, specialist, gallery, review, FAQ, form, map, and footer sections
- Scroll entrance animations and hover motion
- Expandable service cards
- FAQ accordion
- Gallery lightbox
- Appointment form validation with WhatsApp handoff
- Floating WhatsApp and back-to-top buttons

## Before publishing

Replace the placeholder phone numbers in `index.html` and `script.js` with the clinic's final phone and WhatsApp numbers.

Google Translate, Google Maps, and web fonts require an internet connection. Previewing through Live Server or another local web server is recommended.
