// Web-sizes every screenshot in public/shots: max 1400px wide, JPEG q80,
// unified .jpg names, and rewrites data/results.json shot paths to match.
// Run after judging/publish.mjs. Idempotent.
import { readdirSync, readFileSync, writeFileSync, unlinkSync, statSync } from "node:fs";
import sharp from "sharp";

const DIR = "public/shots";
let before = 0, after = 0;

for (const f of readdirSync(DIR)) {
  const src = `${DIR}/${f}`;
  before += statSync(src).size;
  const slug = f.replace(/\.[^.]+$/, "");
  const buf = readFileSync(src); // buffer first — sharp can't read+write same path
  const out = await sharp(buf).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
  if (!f.endsWith(".jpg")) unlinkSync(src);
  writeFileSync(`${DIR}/${slug}.jpg`, out);
  after += out.length;
}

const data = JSON.parse(readFileSync("data/results.json", "utf8"));
for (const e of data) if (e.shot) e.shot = e.shot.replace(/\.[^.]+$/, ".jpg");
writeFileSync("data/results.json", JSON.stringify(data, null, 1));

console.log(`${(before / 1e6).toFixed(0)}MB → ${(after / 1e6).toFixed(0)}MB`);
