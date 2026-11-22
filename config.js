/* =========================================================
   DATI DELLO STUDIO — modificate solo questo file.
   ========================================================= */
window.STUDIO = {
  nome: "Studio Picco",
  citta: "Genova",
  payoff: "Consulenza societaria, tributaria e del lavoro",

  indirizzo: "Piazza della Vittoria 7/14",
  cap: "16121 Genova (GE)",
  // Testo usato per cercare lo studio su Google Maps
  ricercaMappa: "Piazza della Vittoria 7, 16121 Genova",

  telefoni: ["010 591418", "010 592750", "010 5702043"],
  email: "reception@studiopicco.com",
  pec: "studiopicco@legalmail.it",

  // Indirizzi email dei singoli uffici (pagina Contatti)
  uffici: [
    ["Reception", "reception@studiopicco.com"],
    ["Ufficio Segreteria", "amministrazione@studiopicco.com"],
    ["Ufficio Paghe", "lavoro@studiopicco.com"],
    ["Ufficio Contabilità Ordinaria", "ordinaria@studiopicco.com"],
    ["Ufficio Contabilità Semplificata", "semplificata@studiopicco.com"]
  ],
  piva: "01177950993",

  orari: [
    ["Lunedì – Venerdì", "8:30 – 12:30 · 14:30 – 18:30"],
    ["Sabato e domenica", "Chiuso"]
  ],
  notaOrari: "Si riceve su appuntamento.",

  soci: [
    {
      titolo: "Dott.", nome: "Gianfranco Picco",
      ruoli: ["Consulente del Lavoro", "Revisore Legale"],
      albo: [
        "Ordine dei Consulenti del Lavoro di Genova n. 405",
        "Registro dei Revisori Legali n. 45573"
      ]
    },
    {
      titolo: "Avv.", nome: "Gianandrea Picco",
      ruoli: ["Consulente del Lavoro", "Revisore Legale", "Avvocato"],
      albo: [
        "Ordine degli Avvocati di Genova n. 2528",
        "Ordine dei Consulenti del Lavoro di Genova n. 406",
        "Registro dei Revisori Legali n. 45571"
      ]
    },
    {
      titolo: "Dott.", nome: "Matteo Picco",
      ruoli: ["Consulente del Lavoro"],
      albo: [
        "Ordine dei Consulenti del Lavoro di Genova n. 981"
      ]
    }
  ],

  // Area "Consulenza e assistenza legale"
  avvocati: ["Avv. Ilaria Picco", "Avv. Cristina Casazza", "Avv. Gianandrea Picco"],

  // "Con noi collabora"
  collaboratori: ["Rag. Francesco Penna"],

  // Notizie dalle istituzioni in home.
  notizie: {
    url: "https://raw.githubusercontent.com/StudioPicco/sito-studio/notizie/notizie.json"
  },

  secal: {
    nome: "SECAL S.r.l.",
    descrizione: "Centro Servizi Elaborazione Dati",
    sede: "Piazza della Vittoria 7/14, 16121 Genova",
    piva: "01170400103"
  }
};
