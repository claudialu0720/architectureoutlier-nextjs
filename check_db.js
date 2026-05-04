const Database = require('better-sqlite3');
const { resolve } = require('node:path');

const dbPath = resolve('./data/data.db');
const db = new Database(dbPath);

try {
  // Check if dev-token exists
  const row = db.prepare("SELECT id FROM tokens WHERE id = 'dev-token'").get();
  
  if (!row) {
    console.log('dev-token missing, creating it...');
    const now = Date.now();
    db.prepare(`
      INSERT INTO tokens (id, state, created_at, email_sent)
      VALUES ('dev-token', 'created', ?, 0)
    `).run(now);
    console.log('dev-token created.');
  } else {
    console.log('dev-token already exists.');
    // If it exists but is completed, let's reset it for the user so they can test again
    const existing = db.prepare("SELECT state FROM tokens WHERE id = 'dev-token'").get();
    if (existing.state === 'completed') {
      console.log('dev-token was completed, resetting to created for testing...');
      db.prepare("UPDATE tokens SET state = 'created', answers = NULL, scores = NULL WHERE id = 'dev-token'").run();
      console.log('dev-token reset.');
    }
  }
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
