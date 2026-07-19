// CF API D1 export + R2 list
const CF_TOKEN = process.argv[2];
const ACCOUNT_ID = 'bf9e4ec1d32aefcd6e82e090487e4490';
const DB_ID = 'c19b5005-10aa-4084-a168-2a165f935f4e';
const BUCKET = 'azr';
const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}`;
const HEADERS = { Authorization: `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' };

async function query(sql) {
  const r = await fetch(`${BASE}/d1/database/${DB_ID}/query`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ sql })
  });
  const data = await r.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result[0]?.results || [];
}

async function main() {
  // Get all tables except sqlite_ sequence
  const tables = (await query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"))
    .map(t => t.name);
  console.log('Tables:', tables);

  let dump = `-- D1 export: azr-db → Turso\n-- ${new Date().toISOString()}\n\n`;
  for (const t of tables) {
    const rows = await query(`SELECT * FROM "${t}";`);
    if (rows.length === 0) continue;
    const cols = Object.keys(rows[0]);
    const colList = cols.map(c => `"${c}"`).join(',');
    
    for (const row of rows) {
      const vals = cols.map(c => {
        const v = row[c];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return v;
        let s = String(v).replace(/'/g, "''");
        // Handle JSON/object values
        if (typeof v === 'object') s = JSON.stringify(v).replace(/'/g, "''");
        return `'${s}'`;
      });
      dump += `INSERT INTO "${t}" (${colList}) VALUES (${vals.join(',')});\n`;
    }
    dump += '\n';
  }

  // Write to stdout
  process.stdout.write(dump);
}

main().catch(e => { console.error(e); process.exit(1); });
