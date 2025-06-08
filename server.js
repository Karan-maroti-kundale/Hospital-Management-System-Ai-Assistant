import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to the backend directory
process.chdir(path.join(__dirname, 'backend'));

// Import and start the server
import('./server.js').catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
}); 