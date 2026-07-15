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
  const meta = await sharp(buf).metadata();
  // Already web-sized: re-encoding would only add generation loss and churn the
  // git blob, which makes the push huge for no visual gain.
  if (f.endsWith(".jpg") && meta.format === "jpeg" && meta.width <= 1400) {
    after += buf.length;
    continue;
  }
  const out = await sharp(buf).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
  if (!f.endsWith(".jpg")) unlinkSync(src);
  writeFileSync(`${DIR}/${slug}.jpg`, out);
  after += out.length;
}

// Every file that carries a shot path has to follow the rename.
const fix = (o) => {
  if (Array.isArray(o)) o.forEach(fix);
  else if (o && typeof o === "object") {
    if (typeof o.shot === "string") o.shot = o.shot.replace(/\.[^.]+$/, ".jpg");
    Object.values(o).forEach(fix);
  }
};
for (const f of ["data/results.json", "data/awards.json"]) {
  const data = JSON.parse(readFileSync(f, "utf8"));
  fix(data);
  writeFileSync(f, JSON.stringify(data, null, 1));
}

console.log(`${(before / 1e6).toFixed(0)}MB → ${(after / 1e6).toFixed(0)}MB`);
