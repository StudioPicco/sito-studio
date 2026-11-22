// Legge le fonti elencate in fonti-notizie.json e produce notizie.json
// Tipi di fonte: "rss" (feed RSS/Atom), "inl" (pagina News INL), "ade" (pagina "Tutte le notizie" Agenzia Entrate)
// Uso: node scripts/aggiorna-notizie.mjs <file-di-uscita>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const OUT = process.argv[2] || "notizie.json";
const MAX_TOTALE = 12, MAX_PER_FONTE = 5, MAX_PER_ENTE = 4, GIORNI = 45;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export const decode = s => String(s || "")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ").replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘").replace(/&ndash;/g, "–").replace(/&amp;/g, "&")
  .replace(/\s+/g, " ").trim();

// Date italiane gg/mm/aaaa (o gg-mm-aa) lette come giorno/mese; il resto con Date.parse
export function parseData(s) {
  s = String(s || "").trim();
  const m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (m) {
    let [, d, mo, y, h = "12", mi = "0"] = m;
    if (y.length === 2) y = "20" + y;
    return Date.UTC(+y, +mo - 1, +d, +h, +mi);
  }
  return Date.parse(s) || 0;
}

const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i")); return m ? m[1] : ""; };
const abs = (href, base) => { try { return new URL(decode(href), base).href; } catch { return ""; } };

export function parseRss(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map(b => {
    let link = decode(tag(b, "link"));
    if (!link) { const m = b.match(/<link[^>]*href=["']([^"']+)["']/i); link = m ? m[1] : ""; }
    return { titolo: decode(tag(b, "title")), link: link.trim(), ts: parseData(decode(tag(b, "pubDate") || tag(b, "dc:date") || tag(b, "published") || tag(b, "updated"))) };
  });
}

// News INL: link del tipo /2026/11/20/titolo/ ; la data è nell'indirizzo
export function parseInl(html, base) {
  const out = [], re = /<a\b[^>]*href="((?:https?:\/\/www\.ispettorato\.gov\.it)?\/(20\d\d)\/(\d\d)\/(\d\d)\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const titolo = decode(m[5]);
    if (!titolo || /^leggi tutto/i.test(titolo) || /^vai alla notizia/i.test(titolo)) continue;
    out.push({ titolo, link: abs(m[1], base), ts: Date.UTC(+m[2], +m[3] - 1, +m[4], 12) });
  }
  return out;
}

// Agenzia Entrate "Tutte le notizie": <p class="datanews">19/11/26</p> <p><a href="...">Titolo</a></p>
export function parseAde(html, base) {
  const out = [], re = /class="datanews"[^>]*>\s*([\d\/]+)[\s\S]{0,300}?<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) out.push({ titolo: decode(m[3]), link: abs(m[2], base), ts: parseData(m[1]) });
  return out;
}

async function main() {
  const fonti = JSON.parse(await readFile(new URL("./fonti-notizie.json", import.meta.url), "utf8"));
  const limite = Date.now() - GIORNI * 864e5, domani = Date.now() + 864e5;
  const tutte = [], esito = [];
  for (const f of fonti) {
    try {
      const r = await fetch(f.url, { headers: { "User-Agent": UA, "Accept-Language": "it-IT,it;q=0.9" }, signal: AbortSignal.timeout(25000) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const testo = await r.text();
      const lettore = f.tipo === "inl" ? parseInl : f.tipo === "ade" ? parseAde : parseRss;
      const visti = new Set();
      const items = lettore(testo, f.url)
        .filter(x => x.titolo && /^https?:\/\//i.test(x.link) && !visti.has(x.link) && visti.add(x.link))
        .filter(x => x.ts && x.ts >= limite && x.ts <= domani)
        .sort((a, b) => b.ts - a.ts)
        .slice(0, MAX_PER_FONTE);
      items.forEach(x => tutte.push({ fonte: f.fonte, titolo: x.titolo, link: x.link, data: new Date(x.ts).toISOString() }));
      esito.push(`${items.length ? "OK " : "VUOTO"}  ${f.fonte} (${f.url}): ${items.length} notizie`);
    } catch (e) {
      esito.push(`ERR  ${f.fonte} (${f.url}): ${e.message}`);
    }
  }
  // Al massimo MAX_PER_ENTE notizie per ente, così compaiono sempre tutte le fonti
  const viste = new Set(), perEnte = {};
  const notizie = tutte
    .filter(x => !viste.has(x.link) && viste.add(x.link))
    .sort((a, b) => Date.parse(b.data) - Date.parse(a.data))
    .filter(x => (perEnte[x.fonte] = (perEnte[x.fonte] || 0) + 1) <= MAX_PER_ENTE)
    .slice(0, MAX_TOTALE);
  console.log(esito.join("\n"));
  if (!notizie.length) { console.error("Nessuna notizia letta: file non aggiornato."); process.exit(1); }
  await writeFile(OUT, JSON.stringify({ aggiornato: new Date().toISOString(), notizie }, null, 2));
  console.log(`Scritte ${notizie.length} notizie in ${OUT}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
