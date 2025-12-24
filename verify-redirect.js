import dotenv from 'dotenv';
dotenv.config();

const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';

console.log('Current redirect URI in .env:', redirectUri);
console.log('\nMake sure this EXACT string is added to Spotify Developer Dashboard:');
console.log('1. Go to: https://developer.spotify.com/dashboard');
console.log('2. Click your app > Edit Settings');
console.log('3. Scroll to "Redirect URIs"');
console.log('4. Click "Add URI"');
console.log(`5. Paste exactly: ${redirectUri}`);
console.log('6. Click "Save"');
console.log('\n⚠️  Common mistakes:');
console.log('   - Using https:// instead of http://');
console.log('   - Using 127.0.0.1 instead of localhost');
console.log('   - Adding trailing slash');
console.log('   - Different port number');
