# Spotify MCP Server for Gemini CLI

A Model Context Protocol (MCP) server that enables Google Gemini CLI to control Spotify through natural language commands.

## Features

- **Play Control**: Play playlists, albums, and tracks
- **Search**: Find music by song, artist, or album
- **Playback Control**: Play, pause, skip, and adjust volume
- **Sleep Timer**: Automatically pause playback after a specified duration

## Prerequisites

- Node.js 18+
- npm or yarn
- Spotify Developer account
- Google Gemini CLI installed (`npm install -g @google/gemini-cli`)

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm run build
```

### 2. Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your **Client ID** and **Client Secret**
4. Click "Edit Settings" → Add redirect URI: `http://127.0.0.1:3000/callback`
5. Click "Save"

**Important:** Spotify requires `127.0.0.1` (not `localhost`) for redirect URIs.

### 3. Configure Environment

Create a `.env` file in the project root:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

### 4. Authenticate

```bash
npm run auth
```

This opens your browser for Spotify authorization and saves tokens to `tokens.json` (one-time setup).

### 5. Configure Gemini CLI

Generate `.gemini/settings.json` from your `.env` file:

```bash
npm run setup:gemini
```

This script automatically:
- Reads your `.env` file
- Creates `.gemini/settings.json` with the correct paths and API keys
- Populates all environment variables from your `.env` file

**Note:** Run `npm run setup:gemini` again whenever you update your `.env` file or after building the project.

### 6. Use It!

Once configured, start Gemini CLI and ask:

- "Play my Discover Weekly playlist"
- "Search for songs by The Beatles"
- "Pause Spotify"
- "Set a 30 minute sleep timer"
- "What's currently playing?"

## Available MCP Tools

- `play_playlist` - Play a playlist by name
- `play_album` - Play an album by name
- `play_track` - Play a track by name
- `search_music` - Search for music
- `control_playback` - Control playback (play, pause, skip, volume)
- `get_current_playing` - Get currently playing track
- `set_sleep_timer` - Set a sleep timer
- `cancel_sleep_timer` - Cancel active timers
- `get_active_timers` - List active timers

## Troubleshooting

### Authentication Issues

- **Redirect URI mismatch**: Ensure `.env` and Spotify Dashboard have the exact same URI (`http://127.0.0.1:3000/callback`)
- **Invalid redirect URI**: Must use `127.0.0.1` not `localhost` (Spotify requirement)
- **Token expired**: Delete `tokens.json` and run `npm run auth` again

### Gemini CLI Not Finding Server

- Verify absolute path to `dist/server.js` is correct
- Check environment variables are set (if using Method 2)
- Ensure Node.js is in PATH
- Test server manually: `node dist/server.js` (should start without errors)

### Server Errors

- Make sure Spotify app is open and a device is active
- Verify `tokens.json` exists and is valid
- Check network connectivity

## Development

```bash
# Build TypeScript
npm run build

# Run MCP server (for testing)
npm start

# Authenticate with Spotify
npm run auth

# Development mode (auto-reload)
npm run dev
```

## Project Structure

```
src/
  server.ts              # MCP server entry point
  auth-helper.ts         # Authentication helper script
  spotify/
    auth.ts             # OAuth authentication
    client.ts           # Spotify API client
  tools/                # MCP tool implementations
  timer.ts              # Timer manager
```


