# Personal Webpage

A clean, responsive, and data-driven personal/academic website built with pure HTML, CSS, and JavaScript.

## Features

- Purple-themed dark mode design
- Fully responsive layout (mobile, tablet, desktop)
- Modular CSS with clean separation of concerns
- No frameworks - pure HTML, CSS, and JavaScript
- Data-driven content loaded from JSON files in the `/data` directory

## Project Structure

```
├── index.html                # Main HTML structure
├── manifest.json             # PWA configuration
├── CNAME                     # GitHub Pages custom domain
├── /css/
│   ├── colors.css            # Theme variables
│   ├── layout.css            # Grid, flex, spacing
│   ├── components.css        # Cards, buttons, forms
│   └── style.css             # General styles
├── /js/
│   ├── main.js               # Menu toggle, tab logic
│   ├── data-loader.js        # Loads JSON data into HTML
│   └── pdfGenerator.js       # CV download as PDF
└── /data/
    ├── profile.json          # Name, title, avatar, contact, social links
    ├── navigation.json      # Navigation tabs
    ├── about.json            # About me and research areas
    ├── publications.json     # Journal articles, preprints, conference papers
    └── contact.json          # Contact form and map
```

## Getting Started

1. Clone or download this repository.
2. Open `index.html` in a browser (use a live server for best results with `fetch`).
3. Edit the JSON files in `/data` to customize your content.

## Customizing

- **Profile:** Edit `data/profile.json` for name, title, avatar, contact, social links.
- **Navigation:** Edit `data/navigation.json` for tab names and order.
- **About:** Edit `data/about.json` for your bio and research areas.
- **Publications:** Edit `data/publications.json` with journal articles, preprints, and conference papers.
- **Contact:** Edit `data/contact.json` for form fields and map embed.

## License

MIT
