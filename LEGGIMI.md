# Sito dello Studio Picco: istruzioni

Il sito è ospitato su **Netlify** (piano gratuito) e i suoi file stanno nel repository GitHub **StudioPicco/sito-studio**.
Ogni modifica caricata su GitHub (ramo `main`) viene pubblicata da Netlify in circa un minuto.

## 1. Pubblicare una circolare (uso quotidiano dello staff)
1. Aprite `https://www.studiopicco.org/admin/` (durante la prova: `https://sito-studio.netlify.app/admin/`) e accedete con GitHub.
2. Circolari → Elenco circolari → "Aggiungi circolare".
3. Compilate titolo, data, numero, categoria e testo; allegate il PDF.
4. Ricontrollate tutto, poi premete **Pubblica**. Dopo circa un minuto la circolare compare sul sito.

Attenzione: **ogni "Pubblica" consuma 15 crediti Netlify** (il piano gratuito ne ha 300 al mese).
Correggere un refuso dopo la pubblicazione costa un'altra pubblicazione: meglio controllare prima.
Ogni persona dello staff usa un proprio account GitHub, aggiunto al repository come collaboratore (Settings → Collaborators).
Il PDF caricato è pubblico: non deve contenere dati di clienti né articoli di giornale o altri testi di terzi.

## 2. Dati dello Studio
Telefoni, email, orari, soci, numeri di iscrizione agli albi e simili sono nel file `config.js`.
Se cambiano gli orari, aggiornate anche i dati per Google (blocco `application/ld+json` in testa a `index.html`).

## 3. Notizie dalle istituzioni (home page)
Le notizie di INPS, Ispettorato del Lavoro e Agenzia delle Entrate si aggiornano da sole 4 volte al giorno (GitHub → scheda **Actions** → "Aggiorna notizie"), senza consumare crediti Netlify.
- Se una fonte non risponde, il programma riprova e poi ripropone le notizie precedenti di quell'ente.
- Le fonti si modificano nel file `scripts/fonti-notizie.json`.
- Il repository deve restare **pubblico**: il sito legge le notizie dal ramo `notizie`.
- GitHub sospende le attività pianificate dopo 60 giorni senza modifiche al repository e lo segnala via email: in quel caso, scheda Actions → "Aggiorna notizie" → **Enable workflow**.

## 4. Crediti Netlify
Si controllano su Netlify → Usage & billing. Pubblicazioni, traffico e richieste consumano crediti.
**Se i crediti finiscono, Netlify sospende il sito fino all'inizio del mese successivo.**
Il piano Personal (a pagamento) ha più crediti e permette di togliere il riquadro "Powered by Netlify" (Project configuration → General → Powered by Netlify badge).
Se il riquadro viene tolto, eliminate anche la riga `nl-hud:public:v1` e il paragrafo sul riquadro dalla sezione Cookie della pagina "Privacy e cookie".

## 5. Messa online su studiopicco.org (da fare una volta)
1. Su Netlify: Domain management → Add a domain → `www.studiopicco.org`, impostato come dominio principale; verificate che compaia anche `studiopicco.org` (reindirizzato a www).
2. Su Aruba (admin.aruba.it): Domini → studiopicco.org → Gestione DNS e Name Server → Modifica zona DNS. Prima fate uno screenshot della zona com'è.
   - Record **A** con host `@`: valore `75.2.60.5`
   - Record **CNAME** con host `www`: valore `sito-studio.netlify.app`
   - Eliminate eventuali record **AAAA** su `@` e `www`.
   - **Non toccate i record MX** e non cambiate i name server. Le email su studiopicco.com non dipendono da questo dominio.
3. Attendete che Netlify attivi l'HTTPS (da pochi minuti a 24 ore).
4. **Eliminate il file `_headers`** (su GitHub: aprite il file → cestino → Commit changes). Finché c'è, il sito non compare su Google.
5. Provate l'accesso all'area staff dal nuovo indirizzo (`/admin/`).
6. Registrate il sito su Google Search Console e inviate la sitemap `https://www.studiopicco.org/sitemap.xml`.

## 6. Privacy e cookie
Il testo è nella pagina "Privacy e cookie" (`index.html`, sezione PRIVACY). Va aggiornato se aggiungete servizi esterni (mappe, video, statistiche, moduli, chat).

## 7. Immagini
La foto della testata della pagina Contatti (Piazza della Vittoria) è di Pisanoemanuele, licenza CC BY-SA 4.0: la nota con l'attribuzione in fondo alla pagina Contatti deve restare.
Le altre immagini di sfondo sono state generate con intelligenza artificiale: la nota nel piè di pagina deve restare (AI Act, art. 50). Se aggiungete altre immagini generate con AI che sembrano foto reali, la nota deve coprire anche quelle.
