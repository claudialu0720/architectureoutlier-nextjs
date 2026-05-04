const Database = require('better-sqlite3');
const { resolve } = require('node:path');

const dbPath = resolve('./data/data.db');
const db = new Database(dbPath);

try {
  const scores = JSON.stringify({ D: 10, T: 8, B: 5, N: 4, C: 2, S: 1 });
  db.prepare(`
    UPDATE tokens 
    SET state = 'completed', 
        scores = ?, 
        answers = '[]' 
    WHERE id = 'dev-token'
  `).run(scores);
  console.log('dev-token set to completed with dummy scores.');
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
