import express from 'express';
import dotenv from 'dotenv';
import { SpotifyAuth } from './spotify/auth.js';
import { SpotifyClient } from './spotify/client.js';
import { TimerManager } from './timer.js';
import * as playTools from './tools/play.js';
import * as searchTools from './tools/search.js';
import * as playbackTools from './tools/playback.js';
import * as timerTools from './tools/timer.js';

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/callback';
const HTTP_PORT = parseInt(process.env.HTTP_BRIDGE_PORT || '3001', 10);
const API_KEY = process.env.HTTP_BRIDGE_API_KEY || '';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment variables');
  process.exit(1);
}

const auth = new SpotifyAuth({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

const client = new SpotifyClient(auth);
const timerManager = new TimerManager(client);

const app = express();
app.use(express.json());

function authenticateRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (API_KEY) {
    const authHeader = req.headers.authorization;
    const providedKey = authHeader?.replace('Bearer ', '') || req.query.apiKey as string;
    
    if (providedKey !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }
  }
  next();
}

app.use(authenticateRequest);

app.post('/play/playlist', async (req, res) => {
  try {
    const { playlistName, deviceId } = req.body;
    
    if (!playlistName) {
      return res.status(400).json({ error: 'playlistName is required' });
    }

    const result = await playTools.playPlaylist(client, playlistName, deviceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/play/album', async (req, res) => {
  try {
    const { albumName, artistName, deviceId } = req.body;
    
    if (!albumName) {
      return res.status(400).json({ error: 'albumName is required' });
    }

    const result = await playTools.playAlbum(client, albumName, artistName, deviceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/play/track', async (req, res) => {
  try {
    const { trackName, artistName, deviceId } = req.body;
    
    if (!trackName) {
      return res.status(400).json({ error: 'trackName is required' });
    }

    const result = await playTools.playTrack(client, trackName, artistName, deviceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { q: query, limit } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'query parameter (q) is required' });
    }

    const result = await searchTools.searchMusic(
      client,
      query,
      limit ? parseInt(limit as string, 10) : 10
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/control', async (req, res) => {
  try {
    const { action, value, deviceId } = req.body;
    
    if (!action) {
      return res.status(400).json({ error: 'action is required' });
    }

    const result = await playbackTools.controlPlayback(
      client,
      action,
      value,
      deviceId
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/now-playing', async (req, res) => {
  try {
    const result = await playbackTools.getCurrentPlaying(client);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/timer/set', async (req, res) => {
  try {
    const { durationMinutes } = req.body;
    
    if (!durationMinutes || typeof durationMinutes !== 'number') {
      return res.status(400).json({ error: 'durationMinutes (number) is required' });
    }

    const result = await timerTools.setSleepTimer(timerManager, durationMinutes);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/timer/cancel', async (req, res) => {
  try {
    const { timerId } = req.body;
    const result = await timerTools.cancelSleepTimer(timerManager, timerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/timer/list', async (req, res) => {
  try {
    const result = await timerTools.getActiveTimers(timerManager);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    authenticated: auth.isAuthenticated(),
  });
});

async function startServer() {
  await auth.loadTokens();
  
  app.listen(HTTP_PORT, () => {
    console.log(`HTTP bridge server running on port ${HTTP_PORT}`);
    console.log(`API key authentication: ${API_KEY ? 'enabled' : 'disabled'}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

