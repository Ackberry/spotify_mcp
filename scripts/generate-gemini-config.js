#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Read .env file
function loadEnv() {
  try {
    const envContent = readFileSync(join(projectRoot, '.env'), 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    process.exit(1);
  }
}

// Generate settings.json
function generateSettings() {
  const env = loadEnv();
  const serverPath = join(projectRoot, 'dist', 'server.js');
  
  const settings = {
    mcpServers: {
      spotify: {
        command: "node",
        args: [serverPath],
        env: {
          SPOTIFY_CLIENT_ID: env.SPOTIFY_CLIENT_ID || '',
          SPOTIFY_CLIENT_SECRET: env.SPOTIFY_CLIENT_SECRET || '',
          SPOTIFY_REDIRECT_URI: env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/callback',
          SPOTIFY_DEVICE_ID: env.SPOTIFY_DEVICE_ID || ''
        }
      }
    }
  };
  
  const geminiDir = join(projectRoot, '.gemini');
  const settingsPath = join(geminiDir, 'settings.json');
  
  // Create .gemini directory if it doesn't exist
  try {
    mkdirSync(geminiDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's okay
  }
  
  // Write settings.json
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
  console.log(`✅ Generated .gemini/settings.json from .env`);
  console.log(`   Using server path: ${serverPath}`);
}

generateSettings();

