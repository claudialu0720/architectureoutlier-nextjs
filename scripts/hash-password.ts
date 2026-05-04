import { hash } from '@node-rs/argon2';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main() {
  const arg = process.argv[2];
  let password = arg;
  if (!password) {
    const rl = createInterface({ input, output });
    password = await rl.question('Enter password to hash: ');
    rl.close();
  }
  if (!password) {
    console.error('No password provided.');
    process.exit(1);
  }
  const h = await hash(password);
  // Backslash-escape every `$`: Next.js's env loader (@next/env → dotenv-expand)
  // expands `$NAME` even inside single or double quotes; `\$` is the only form
  // that survives. Wrong escaping silently mangles the hash → 401 at login.
  const escaped = h.replace(/\$/g, '\\$');
  console.log('\nADMIN_PASSWORD_HASH=' + escaped);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
