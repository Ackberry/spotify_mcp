# Spotify MCP Server for Gemini

A Model Context Protocol (MCP) server that exposes Spotify functionality for seamless integration with Google Gemini models.

## Features

- **Play Control**: Play playlists, albums, and tracks
- **Search**: Find music by song, artist, or album
- **Playback Control**: Play, pause, skip, and adjust volume
- **Sleep Timer**: Automatically pause playback after a specified duration
- **Siri Integration**: HTTP bridge for Apple Shortcuts (optional)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Spotify Developer account
- TypeScript 5.3+
- Google IDX workspace (recommended) OR Google Gemini API access (or compatible Gemini client)

## Setup

### 1. Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your **Client ID** and **Client Secret**
4. Add a redirect URI: `http://127.0.0.1:3000/callback` (or your preferred URI)

### 2. Project Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
   HTTP_BRIDGE_PORT=3001
   HTTP_BRIDGE_API_KEY=your_optional_api_key_here
   ```

4. Build the project:
   ```bash
   npm run build
   ```

### 3. Authentication

1. Start the server:
   ```bash
   npm start
   ```

2. The server will guide you through the OAuth flow if you're not authenticated
3. Visit the provided authorization URL
4. Authorize the app and copy the callback code
5. The tokens will be saved automatically in `tokens.json`

## Usage

### MCP Server for Google IDX (Recommended)

**For Google IDX setup, see the detailed guide: [IDX_SETUP.md](IDX_SETUP.md)**

Google IDX provides the easiest way to use this MCP server with AI assistance. The setup guide covers:
- Installing dependencies
- Configuring `.idx/mcp.json`
- Authentication
- Troubleshooting

### MCP Server for Other Gemini Clients

The MCP server runs on stdio and communicates via the Model Context Protocol.

**Quick Setup:**

1. Configure your Gemini client to use the MCP server (see [MCP_SETUP.md](MCP_SETUP.md) for details)
2. Point it to: `node /path/to/SpotifyMCP/dist/server.js`
3. Set environment variables for Spotify credentials

**For detailed setup instructions, see [MCP_SETUP.md](MCP_SETUP.md)**

Run the server directly:
```bash
npm start
```

### HTTP Bridge (for Siri/Shortcuts)

The HTTP bridge exposes REST endpoints for Apple Shortcuts:

```bash
npm run bridge
```

## MCP Tools

The server exposes the following MCP tools for Gemini:

- `play_playlist` - Play a playlist by name
- `play_album` - Play an album by name
- `play_track` - Play a track by name
- `search_music` - Search for music
- `control_playback` - Control playback (play, pause, skip, volume)
- `get_current_playing` - Get currently playing track
- `set_sleep_timer` - Set a sleep timer
- `cancel_sleep_timer` - Cancel active timers
- `get_active_timers` - List active timers

### Example Gemini Interactions

Once configured, you can ask Gemini:

- "Play my workout playlist on Spotify"
- "Search for songs by The Beatles"
- "Pause Spotify"
- "Set a 30 minute sleep timer"
- "What's currently playing?"
- "Play the album 'Abbey Road' by The Beatles"

Gemini will automatically use the appropriate MCP tools to execute these commands.

## API Endpoints (HTTP Bridge)

The HTTP bridge provides REST endpoints for Apple Shortcuts integration. All endpoints support optional API key authentication via:
- Header: `Authorization: Bearer <api_key>`
- Query parameter: `?apiKey=<api_key>`

### Play Endpoints

**POST** `/play/playlist`
```json
{
  "playlistName": "My Playlist",
  "deviceId": "optional_device_id"
}
```

**POST** `/play/album`
```json
{
  "albumName": "Album Name",
  "artistName": "Artist Name",
  "deviceId": "optional_device_id"
}
```

**POST** `/play/track`
```json
{
  "trackName": "Song Name",
  "artistName": "Artist Name",
  "deviceId": "optional_device_id"
}
```

### Search

**GET** `/search?q=query&limit=10`

Returns search results for tracks, albums, and artists.

### Playback Control

**POST** `/control`
```json
{
  "action": "play|pause|skip-next|skip-previous|volume",
  "value": 50,
  "deviceId": "optional_device_id"
}
```

**GET** `/now-playing`

Returns information about the currently playing track.

### Timer

**POST** `/timer/set`
```json
{
  "durationMinutes": 30
}
```

**POST** `/timer/cancel`
```json
{
  "timerId": "optional_timer_id"
}
```

**GET** `/timer/list`

Returns all active timers.

### Health

**GET** `/health`

Check server status and authentication state.

## Apple Shortcuts Integration

### Setting Up Shortcuts

1. Open the **Shortcuts** app on your iPhone/iPad
2. Create a new shortcut
3. Add a **"Get Contents of URL"** action
4. Configure:
   - **Method**: POST (or GET for search/now-playing)
   - **URL**: `http://your-server-ip:3001/play/playlist`
   - **Headers**: 
     - `Content-Type: application/json`
     - `Authorization: Bearer <your_api_key>` (if using API key)
   - **Request Body**: JSON with required parameters

5. Add a **"Get Text from Input"** action to parse the response
6. Add **"Speak Text"** action to have Siri confirm the action

### Example Voice Commands

- "Hey Siri, play my workout playlist"
- "Hey Siri, pause Spotify"
- "Hey Siri, set a 30 minute sleep timer"
- "Hey Siri, what's playing on Spotify?"
- "Hey Siri, play [song name] by [artist]"

### Running the Server for Shortcuts

For local network access:

1. Find your Mac's IP address: `ifconfig | grep "inet "`
2. Use that IP in Shortcuts: `http://192.168.1.x:3001/...`
3. Ensure your Mac's firewall allows connections on port 3001

For internet access, deploy the server to a cloud provider.

## Development

```bash
# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run MCP server
npm start

# Run HTTP bridge
npm run bridge
```

## Project Structure

```
src/
  server.ts              # MCP server entry point
  http-bridge.ts         # HTTP server for Shortcuts
  spotify/
    auth.ts             # OAuth authentication
    client.ts           # Spotify API client
  tools/
    play.ts             # Play operations
    search.ts           # Search operations
    playback.ts         # Playback control
    timer.ts            # Timer operations
  timer.ts              # Timer manager
  types.ts              # Type definitions
```

## Troubleshooting

### Authentication Issues

- Ensure your redirect URI matches exactly in Spotify Dashboard
- Check that tokens.json is created and contains valid tokens
- Re-authenticate by deleting tokens.json and restarting

### Device Not Found

- Make sure a Spotify device is active (app open and playing)
- Use the device selection in the Spotify app
- Check device availability via Spotify API

### Connection Issues

- Verify the HTTP bridge port (default: 3001) is not blocked
- Check firewall settings
- Ensure the server is accessible on your network

### Gemini Integration Issues

- Verify the absolute path to `dist/server.js` is correct
- Check environment variables are set properly
- Ensure Node.js is in PATH or use full path to node
- Review [MCP_SETUP.md](MCP_SETUP.md) for detailed troubleshooting

## License

MIT
