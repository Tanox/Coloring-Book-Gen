// One-off version bump: v1.5.0 -> v1.6.0 across source/docs/metadata.
// Run manually; not part of the app build.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const FROM = 'v1.5.0';
const TO = 'v1.6.0';

const changed = [];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// 1. Source files: bump headers/app_title, or add a missing header.
for (const f of walk(join(root, 'app')).filter((f) => /\.tsx?$/.test(f))) {
  let s = readFileSync(f, 'utf8');
  if (s.includes(FROM)) {
    s = s.split(FROM).join(TO);
    writeFileSync(f, s);
    changed.push(relative(root, f));
  } else if (!s.startsWith('// File:')) {
    const rel = relative(root, f).split('\\').join('/');
    writeFileSync(f, `// File: /${rel} ${TO}\n` + s);
    changed.push(`${relative(root, f)} (header added)`);
  }
}

// 2. Spec / design docs.
for (const d of ['openspec', 'design-system']) {
  for (const f of walk(join(root, d)).filter((f) => f.endsWith('.md'))) {
    let s = readFileSync(f, 'utf8');
    if (s.includes(FROM)) {
      writeFileSync(f, s.split(FROM).join(TO));
      changed.push(relative(root, f));
    }
  }
}

// 3. Prototype.
const proto = join(root, 'prototype', 'index.html');
if (existsSync(proto)) {
  let s = readFileSync(proto, 'utf8');
  if (s.includes(FROM)) {
    writeFileSync(proto, s.split(FROM).join(TO));
    changed.push('prototype/index.html');
  }
}

// 4. Root metadata.
for (const name of ['package.json', 'metadata.json']) {
  const f = join(root, name);
  let s = readFileSync(f, 'utf8');
  if (s.includes(FROM)) {
    writeFileSync(f, s.split(FROM).join(TO));
    changed.push(name);
  }
}

console.log(`Bumped ${changed.length} files to ${TO}:`);
console.log(changed.join('\n'));
