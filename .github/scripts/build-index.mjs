import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const GDD_DIR = 'gdd';
const OUT_FILE = path.join(GDD_DIR, 'index.json');

function parseFrontmatter(text, source) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`No frontmatter in ${source}`);
  return yaml.load(match[1]);
}

async function main() {
  const entries = await fs.readdir(GDD_DIR, { withFileTypes: true });
  const games = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const gddPath = path.join(GDD_DIR, entry.name, 'GDD.md');
    let text;
    try {
      text = await fs.readFile(gddPath, 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') continue;
      throw err;
    }
    const fm = parseFrontmatter(text, gddPath);
    games.push({
      id: fm.id,
      title: fm.title,
      version: fm.version,
      description: fm.description,
      tags: fm.tags ?? [],
      engines: fm.engines ?? [],
    });
  }
  games.sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(OUT_FILE, JSON.stringify({ games }, null, 2) + '\n');
  console.log(`Wrote ${OUT_FILE} with ${games.length} games`);
}

main();
