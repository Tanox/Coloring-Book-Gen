// Temporary i18n coverage checker (not committed to repo logic).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../app/locales/', import.meta.url);
const en = extractKeys(readFileSync(new URL('en.ts', dir), 'utf8'));

const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'en.ts' && f !== 'translations.ts' && f !== 'TranslationProvider.tsx');

let allOk = true;
for (const f of files) {
  const keys = extractKeys(readFileSync(new URL(f, dir), 'utf8'));
  const missing = en.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !en.includes(k));
  if (missing.length || extra.length) {
    allOk = false;
    console.log(`\n[${f}]`);
    if (missing.length) console.log('  MISSING:', missing.join(', '));
    if (extra.length) console.log('  EXTRA  :', extra.join(', '));
  }
}

console.log(`\nen.ts keys: ${en.length}`);
console.log(allOk ? 'ALL LOCALES STRUCTURALLY COMPLETE (fallback-safe)' : 'SOME LOCALES MISSING KEYS (fall back to en)');

function extractKeys(src) {
  const keys = [];
  const re = /^\s*([A-Za-z0-9_]+)\s*:/gm;
  let m;
  while ((m = re.exec(src))) keys.push(m[1]);
  return keys;
}
