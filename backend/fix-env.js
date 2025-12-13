/**
 * Script to fix .env file - remove duplicate MONGO_URL and keep Atlas one
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

try {
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Split into lines
  const lines = content.split('\n');
  const newLines = [];
  let foundAtlas = false;
  let foundLocal = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      newLines.push('');
      continue;
    }
    
    // Check for MONGO_URL
    if (line.startsWith('MONGO_URL=')) {
      if (line.includes('mongodb+srv://') || line.includes('mongodb.net')) {
        // This is Atlas URL - keep it
        if (!foundAtlas) {
          newLines.push('MONGO_URL=' + line.split('=')[1].replace(/^["']|["']$/g, ''));
          foundAtlas = true;
        }
      } else if (line.includes('127.0.0.1') || line.includes('localhost')) {
        // This is local MongoDB - skip it
        foundLocal = true;
        continue;
      } else {
        // Other MONGO_URL - keep first one
        if (!foundAtlas) {
          newLines.push(line);
          foundAtlas = true;
        }
      }
    } else if (line.startsWith('PORT=') || line.startsWith('JWT_SECRET=')) {
      // Keep first occurrence of PORT and JWT_SECRET
      const key = line.split('=')[0];
      if (!newLines.some(l => l.trim().startsWith(key + '='))) {
        newLines.push(line);
      }
    } else {
      // Keep all other lines
      newLines.push(line);
    }
  }
  
  // Write back
  const newContent = newLines.join('\n');
  fs.writeFileSync(envPath, newContent, 'utf8');
  
  console.log('✅ Fixed .env file:');
  console.log('   - Removed duplicate MONGO_URL (local)');
  console.log('   - Kept MongoDB Atlas URL');
  console.log('   - Removed duplicate PORT and JWT_SECRET');
  console.log('\n📝 Updated .env file:');
  console.log(newContent);
  
} catch (error) {
  console.error('❌ Error fixing .env:', error.message);
  process.exit(1);
}

