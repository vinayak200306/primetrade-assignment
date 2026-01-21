import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✓ .env file already exists');
  process.exit(0);
}

// Read .env.example if it exists, otherwise create default
let envContent = '';
if (fs.existsSync(envExamplePath)) {
  envContent = fs.readFileSync(envExamplePath, 'utf8');
} else {
  // Generate a random JWT secret
  const crypto = await import('crypto');
  const randomSecret = crypto.randomBytes(32).toString('hex');
  
  envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=${randomSecret}
JWT_EXPIRE=7d
`;
}

// Write .env file
fs.writeFileSync(envPath, envContent);
console.log('✓ .env file created successfully');
console.log('✓ JWT_SECRET has been generated automatically');
console.log('\n⚠️  IMPORTANT: Keep your .env file secure and never commit it to version control!');

