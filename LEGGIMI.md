# Sito dello studio: istruzioni

## 1. Inserire i dati dello studio
Aprite `config.js` con un editor di testo. Sostituite tutto ciò che è tra [parentesi quadre]: nome, indirizzo, telefono, email, PEC, P.IVA, orari e soci con i numeri di iscrizione agli albi.
Il link a Google Maps si crea da solo a partire dal campo `ricercaMappa`.

## 2. Mettere il sito online (gratis, circa 15 minuti, si fa una volta sola)
1. Create un account su **github.com** e un nuovo repository, ad esempio `sito-studio`. Caricate tutti i file di questa cartella con "Add file → Upload files".
2. In `admin/config.yml` sostituite `UTENTE/NOME-REPOSITORY` con il vostro, ad esempio `studiorossi/sito-studio`.
3. Create un account su **netlify.com**, poi "Add new site → Import an existing project → GitHub" e scegliete il repository. Non serve nessuna impostazione di build.
4. Per il pannello staff, su GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: l'indirizzo del sito Netlify
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   Copiate Client ID e Client Secret. Poi su Netlify: Site configuration → Access & security → OAuth → Install provider → GitHub, e incollateli.
5. Collegare il dominio **studiopicco.org** (registrato su Aruba):
   - Su Netlify: Domain management → Add a domain → `www.studiopicco.org` (impostatelo come dominio principale).
   - Su Aruba (admin.aruba.it): Domini → studiopicco.org → Gestione DNS e Name Server → Modifica zona DNS.
     - Record **A** con host `@` (o vuoto): sostituite il valore con `75.2.60.5`
     - Record **CNAME** con host `www`: valore `NOME-SITO.netlify.app` (il nome che vi assegna Netlify)
     - Eliminate eventuali record **AAAA** su `@` e `www`.
     - NON toccate i record MX (email). NON cambiate i name server.
   - Dopo alcune ore (fino a 24) il sito risponde su studiopicco.org; Netlify attiva da solo l'HTTPS.

## Notizie dalle istituzioni (home page)
Le notizie di INPS, Ispettorato del Lavoro e Agenzia delle Entrate si aggiornano da sole 4 volte al giorno, senza consumare crediti Netlify.
1. Il repository GitHub deve essere **pubblico** (Settings → General → Change visibility).
2. In `config.js`, alla voce `notizie`, sostituite `UTENTE/NOME-REPOSITORY` con il vostro (es. `studiopicco/sito-studio`).
3. Su GitHub: scheda **Actions** → "Aggiorna notizie" → **Run workflow** per il primo aggiornamento. Aprendo l'esecuzione si vede quali fonti hanno risposto (OK) e quali no (ERR).
4. Su Netlify: Site configuration → Build & deploy → Branches and deploy contexts → Branch deploys: **None** (il file `netlify.toml` ignora comunque il ramo "notizie").
Le fonti si modificano nel file `scripts/fonti-notizie.json`. Se una fonte non risponde viene saltata; se nessuna risponde, restano le notizie precedenti.

## Fase di prova (noindex)
Il file `_headers` chiede a Google e agli altri motori di ricerca di non indicizzare il sito mentre lo provate sull'indirizzo provvisorio (…netlify.app).
**Quando collegate studiopicco.org e il sito è definitivo, eliminate il file `_headers`** (su GitHub: aprite il file → icona del cestino → Commit changes). Altrimenti il sito non comparirà su Google.

## 3. Pubblicare una circolare (uso quotidiano dello staff)
1. Andate su `https://vostro-sito/admin/` e accedete con GitHub.
2. Circolari → Elenco circolari → "Aggiungi circolare".
3. Compilate titolo, data, categoria e testo, ed eventualmente allegate un PDF.
4. Premete **Pubblica**. Dopo circa un minuto la circolare compare sul sito.

Ogni persona dello staff ha bisogno di un proprio account GitHub, da aggiungere al repository come collaboratore (Settings → Collaborators).
Le due circolari "[Esempio]" vanno cancellate dal pannello.

## Da completare prima della pubblicazione
- **Privacy e cookie policy**: i link nel piè di pagina vanno collegati ai testi definitivi.
- La mappa Google si carica solo dopo un clic del visitatore, quindi senza consenso non vengono installati cookie di terze parti.
- Contenuti informativi conformi alle norme deontologiche degli ordini di appartenenza (per l'avvocato, art. 35 del Codice deontologico forense).
