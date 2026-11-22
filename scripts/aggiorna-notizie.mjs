// Legge i feed RSS/Atom elencati in fonti-notizie.json e produce notizie.json
// Uso: node scripts/aggiorna-notizie.mjs <file-di-uscita>
import { readFile, writeFile } from "node:fs/promises";

const OUT = process.argv[2] || "notizie.json";
const MAX_TOTALE = 12, MAX_PER_FONTE = 5, GIORNI = 45;

const fonti = JSON.parse(await readFile(new URL("./fonti-notizie.json", import.meta.url), "utf8"));

const decode = s => String(s || "")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/\s+/g, " ").trim();

const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i")); return m ? m[1] : ""; };

export function parseFeed(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map(b => {
    let link = decode(tag(b, "link"));
    if (!link) { const m = b.match(/<link[^>]*href=["']([^"']+)["']/i); link = m ? m[1] : ""; }
    const data = decode(tag(b, "pubDate") || tag(b, "dc:date") || tag(b, "published") || tag(b, "updated"));
    return { titolo: decode(tag(b, "title")), link: link.trim(), data };
  }).filter(x => x.titolo && /^https?:\/\//i.test(x.link));
}

const limite = Date.now() - GIORNI * 864e5;
const tutte = [], esito = [];
for (const f of fonti) {
  try {
    const r = await fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 (StudioPicco notizie)" }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const items = parseFeed(await r.text())
      .map(x => ({ ...x, ts: Date.parse(x.data) || 0 }))
      .filter(x => !x.ts || x.ts >= limite)
      .sort((a, b) => b.ts - a.ts)
      .slice(0, MAX_PER_FONTE);
    items.forEach(x => tutte.push({ fonte: f.fonte, titolo: x.titolo, link: x.link, data: x.ts ? new Date(x.ts).toISOString() : null }));
    esito.push(`OK   ${f.fonte} (${f.url}): ${items.length} notizie`);
  } catch (e) {
    esito.push(`ERR  ${f.fonte} (${f.url}): ${e.message}`);
  }
}

const viste = new Set();
const notizie = tutte
  .filter(x => !viste.has(x.link) && viste.add(x.link))
  .sort((a, b) => (Date.parse(b.data) || 0) - (Date.parse(a.data) || 0))
  .slice(0, MAX_TOTALE);

console.log(esito.join("\n"));
if (!notizie.length) { console.error("Nessuna notizia letta: file non aggiornato."); process.exit(1); }
await writeFile(OUT, JSON.stringify({ aggiornato: new Date().toISOString(), notizie }, null, 2));
console.log(`Scritte ${notizie.length} notizie in ${OUT}`);
