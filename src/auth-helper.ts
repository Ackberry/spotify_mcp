import http from 'http';
import { SpotifyAuth } from './spotify/auth.js';
import dotenv from 'dotenv';
import open from 'open';

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env file');
  process.exit(1);
}

const auth = new SpotifyAuth({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

async function authenticate() {
  try {
    // Check if already authenticated
    const existingTokens = await auth.loadTokens();
    if (existingTokens && auth.isAuthenticated()) {
      console.log('✅ Already authenticated!');
      console.log('Tokens are valid. You can use the MCP server now.');
      return;
    }

    console.log('🔐 Starting Spotify authentication...\n');

    // Get authorization URL
    const authUrl = await auth.getAuthorizationUrl();
    
    console.log('📋 Please authorize this application:');
    console.log(authUrl);
    console.log('\n');

    // Start a simple HTTP server to catch the callback
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      
      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>Authentication Failed</h1>
                <p>Error: ${error}</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          process.exit(1);
          return;
        }

        if (code) {
          try {
            await auth.authorize(code);
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body>
                  <h1>✅ Authentication Successful!</h1>
                  <p>You can close this window and return to your terminal.</p>
                  <p>Tokens have been saved to tokens.json</p>
                </body>
              </html>
            `);
            
            console.log('\n✅ Authentication successful!');
            console.log('Tokens saved to tokens.json');
            console.log('You can now use the MCP server.\n');
            
            server.close();
            process.exit(0);
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body>
                  <h1>Authentication Error</h1>
                  <p>${err instanceof Error ? err.message : String(err)}</p>
                </body>
              </html>
            `);
            server.close();
            process.exit(1);
          }
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>No authorization code received</h1>
                <p>Please try again.</p>
              </body>
            </html>
          `);
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      }
    });

    // Extract port from redirect URI
    const port = new URL(REDIRECT_URI).port || '3000';
    
    server.listen(port, () => {
      console.log(`🌐 Listening on ${REDIRECT_URI} for callback...\n`);
      
      // Try to open browser automatically
      console.log('🔗 Opening browser...\n');
      open(authUrl).catch(() => {
        console.log('⚠️  Could not open browser automatically.');
        console.log('Please copy and paste the URL above into your browser.\n');
      });
    });
  } catch (error) {
    console.error('❌ Authentication error:', error);
    process.exit(1);
  }
}

authenticate();

