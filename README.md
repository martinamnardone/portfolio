# Martina Nardone — Portfolio

Sito portfolio personale. **Solo HTML + CSS** (con Sass per i CSS e Bootstrap come framework front-end su CV e Contatti). Nessun backend.

## Pagine
- `index.html` — home / lavori
- `cv.html` — CV in HTML in inglese (stampabile in PDF dal browser)
- `contact.html` — form di contatto (validazione Bootstrap + EmailJS opzionale)
- `project-jojob.html` — case study JoJob
- `project-rosetriad.html` — case study Rose Triad

Girls Gone International compare in home come "coming soon" (nessuna pagina dedicata per ora).

## CSS con Sass
I CSS in `css/` sono **generati** dai file in `scss/` — non modificare i `.css` a mano, modifica gli `.scss` e ricompila.

```bash
npm install          # installa Sass (una volta sola)
npm run watch        # ricompila i CSS a ogni salvataggio (consigliato mentre lavori)
npm run css          # compila una volta sola
```

Struttura Sass: `scss/_tokens.scss` (variabili, mappe colori, mixin) → `scss/_base.scss`, `_nav.scss`, `_buttons.scss`, `_footer.scss` → `main.scss` (globale) + un file per pagina (`home`, `cv`, `contact`, `project`).

## Framework
Bootstrap 5 (via CDN) è usato su `cv.html` e `contact.html` per la griglia responsive e i componenti del form.

## EmailJS (opzionale)
In fondo a `contact.html` ci sono 3 chiavi da inserire (`YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`) dopo aver creato un account gratuito su https://www.emailjs.com. Finché non le inserisci, il form si valida e mostra un messaggio, ma non invia email.

## Personalizzazione
Già impostati: profilo GitHub `https://github.com/martinamnardone` e URL GitHub Pages `https://martinamnardone.github.io/portfolio` (tag Open Graph).
Resta opzionale: le 3 chiavi EmailJS in `contact.html` per far inviare davvero il form.

## Deploy (GitHub Pages)
Repo `martinamnardone/portfolio` → Settings → Pages → Branch `main` / cartella `/root` → Save.
Il sito sarà su https://martinamnardone.github.io/portfolio
