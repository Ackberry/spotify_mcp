# Gemini MCP Server Configuration Guide

This guide explains how to connect the Spotify MCP server to Google Gemini.

## Gemini Integration

This MCP server is designed to work with Google Gemini models through the Model Context Protocol (MCP). The server communicates via stdio transport, which is the standard MCP protocol.

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Google Gemini API access (if using Gemini API directly)
- Spotify Developer account credentials

### 2. Build the Server

Ensure the server is built:

```bash
npm install
npm run build
```

### 3. Configure Environment Variables

Create a `.env` file with your credentials:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### 4. Configure Gemini to Use the MCP Server

The configuration depends on how you're accessing Gemini:

#### Option A: Gemini API with MCP Client

If you're using a Gemini client that supports MCP, configure it to run:

```bash
node /absolute/path/to/SpotifyMCP/dist/server.js
```

With environment variables:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI`

#### Option B: Custom Integration

For custom Gemini integrations, the MCP server exposes tools via stdio. Configure your Gemini client to:

1. Launch the server process: `node dist/server.js`
2. Communicate via stdio using the MCP protocol
3. Send tool requests and receive responses

Example configuration format (varies by client):

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": [
        "/absolute/path/to/SpotifyMCP/dist/server.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "your_client_id",
        "SPOTIFY_CLIENT_SECRET": "your_client_secret",
        "SPOTIFY_REDIRECT_URI": "http://localhost:3000/callback"
      }
    }
  }
}
```

### 5. Authenticate with Spotify

1. Start the server:
   ```bash
   npm start
   ```

2. The server will provide an authorization URL if not authenticated
3. Visit the URL and authorize the application
4. Copy the authorization code from the callback URL
5. Tokens are saved automatically in `tokens.json`

### 6. Verify Installation

1. Start your Gemini client with the MCP server configured
2. Ask Gemini to list available tools
3. You should see Spotify-related tools available:
   - `play_playlist`
   - `play_album`
   - `play_track`
   - `search_music`
   - `control_playback`
   - `get_current_playing`
   - `set_sleep_timer`
   - `cancel_sleep_timer`
   - `get_active_timers`

## Usage Examples

Once configured, you can ask Gemini to:

- "Play my workout playlist on Spotify"
- "Search for songs by The Beatles"
- "Pause Spotify playback"
- "Set a 30 minute sleep timer"
- "What's currently playing on Spotify?"
- "Play the album 'Abbey Road' by The Beatles"

Gemini will automatically use the appropriate MCP tools to execute these commands.

## Testing the MCP Server

You can test the server directly:

```bash
# Start the server
npm start

# The server will communicate via stdio
# Use an MCP client or your Gemini integration to send requests
```

## Troubleshooting

### Server won't start
- Check that Node.js is installed and in PATH
- Verify `.env` file exists with correct credentials
- Ensure you've run `npm run build` to compile TypeScript
- Check that `dist/server.js` exists

### Gemini doesn't see the server
- Verify the absolute path to `dist/server.js` is correct in your configuration
- Ensure environment variables are properly set
- Check that the server process is running
- Review Gemini client logs for connection errors
- Verify JSON syntax is valid (if using JSON config)

### Authentication errors
- Make sure Spotify credentials are correct in `.env`
- Check that redirect URI matches Spotify Dashboard settings
- Delete `tokens.json` and re-authenticate if tokens are expired
- Verify Spotify app is configured correctly in Developer Dashboard

### Tool execution fails
- Ensure Spotify app is open and a device is active
- Check that you're authenticated (tokens.json exists and is valid)
- Verify network connectivity
- Review server logs for detailed error messages

## MCP Protocol Details

The server implements the Model Context Protocol and provides:

- **Transport**: stdio (standard input/output)
- **Capabilities**: Tools
- **Tools**: 9 Spotify-related tools for music control

All communication follows the MCP JSON-RPC protocol over stdio.

## Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Google Gemini Documentation](https://ai.google.dev/docs)
