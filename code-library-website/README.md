# Codefolio — My Code Library

A responsive, dark-themed personal code library for the 10 uploaded Python programs.

## Run locally

The site loads `programs.json` and each `.py` file with `fetch`, so use a local HTTP server instead of opening `index.html` directly.

### Option 1: Python (Windows, macOS, Linux)
1. Extract this folder.
2. Open a terminal in the `code-library-website` folder.
3. Run:
   ```bash
   python -m http.server 8000
   ```
4. Open http://localhost:8000 in your browser.
5. Press `Ctrl+C` in the terminal to stop the server.

### Option 2: VS Code
Install the Live Server extension, right-click `index.html`, and choose **Open with Live Server**.

## Contents
- `index.html` — page structure
- `styles.css` — responsive styling and syntax-token colors
- `app.js` — search, category filters, viewer, and clipboard actions
- `programs.json` — editable titles, descriptions, language, and category metadata
- `programs/` — the original source files, copied byte-for-byte

## Updating the library
Edit metadata in `programs.json` and add or replace source files under `programs/`. Keep each `filename` value in the JSON exactly matched to its source file name. The website does not execute the Python programs; it displays their source.
