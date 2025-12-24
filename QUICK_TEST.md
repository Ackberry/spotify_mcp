# Quick Test Guide - Spotify MCP with Google IDX

## Prerequisites Check

- ✅ Server is built
- ✅ .env file exists
- ⚠️ Need to authenticate with Spotify

## Step 1: Authenticate with Spotify (One-Time Setup)

Run this locally first to authenticate:

```bash
npm start
```

The server will:
1. Start and check for authentication
2. Print an authorization URL if not authenticated
3. You'll need to visit that URL in your browser
4. Authorize the app
5. Copy the `code` from the callback URL
6. Tokens will be saved in `tokens.json`

**Note:** This needs to be done once. After that, `tokens.json` will be used.

## Step 2: Test Locally First (Optional but Recommended)

Test that the server works before configuring IDX:

```bash
# Start the server
npm start

# It should start without errors
# Press Ctrl+C to stop it
```

## Step 3: Set Up Google IDX

### 3.1 Open/Clone in IDX

1. Go to [Google IDX](https://idx.google.com)
2. Create a new workspace OR clone this repo:
   ```bash
   git clone https://github.com/Ackberry/spotify_mcp.git
   cd spotify_mcp
   ```

### 3.2 Copy Files to IDX

Make sure these files are in your IDX workspace:
- `dist/` folder (or rebuild with `npm run build`)
- `.env` file (with your Spotify credentials)
- `tokens.json` (from Step 1)

### 3.3 Create IDX MCP Configuration

Create `.idx/mcp.json` in your IDX workspace:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": [
        "${workspaceFolder}/dist/server.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "your_client_id_from_env",
        "SPOTIFY_CLIENT_SECRET": "your_client_secret_from_env",
        "SPOTIFY_REDIRECT_URI": "http://localhost:3000/callback"
      }
    }
  }
}
```

**Important:** Replace the env values with actual values from your `.env` file, OR use absolute paths if variable substitution doesn't work:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": [
        "/absolute/path/to/your/workspace/dist/server.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "actual_client_id_value",
        "SPOTIFY_CLIENT_SECRET": "actual_client_secret_value",
        "SPOTIFY_REDIRECT_URI": "http://localhost:3000/callback"
      }
    }
  }
}
```

### 3.4 Restart IDX / Reload Workspace

Restart Google IDX or reload the workspace so it picks up the MCP configuration.

## Step 4: Test in IDX Chat

1. Open the AI chat panel in Google IDX
2. Ask: **"What MCP tools are available?"**
3. You should see a list including:
   - `play_playlist`
   - `play_album`
   - `play_track`
   - `search_music`
   - `control_playback`
   - `get_current_playing`
   - `set_sleep_timer`
   - etc.

4. Try a command:
   - **"Play my Discover Weekly playlist"**
   - **"Search for songs by The Beatles"**
   - **"What's currently playing on Spotify?"**

## Troubleshooting

### Tools don't appear
- Check `.idx/mcp.json` syntax (validate JSON)
- Verify the path to `dist/server.js` is correct
- Check IDX logs/console for errors
- Restart IDX completely

### Authentication errors
- Make sure `tokens.json` exists in your workspace
- Verify `.env` file has correct credentials
- Re-authenticate by deleting `tokens.json` and running `npm start` again

### Server errors
- Check that Node.js is available in IDX
- Verify `dist/server.js` exists
- Try running `node dist/server.js` manually in IDX terminal to see errors

## Alternative: Test with Direct Node Command

If IDX config doesn't work, you can test the server directly:

```bash
# In IDX terminal
node dist/server.js

# Should start without errors
# If it works, IDX should be able to connect to it
```

