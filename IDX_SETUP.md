# Google IDX Setup Guide for Spotify MCP Server

This guide will walk you through setting up the Spotify MCP server in Google IDX (Integrated Development Environment) for seamless AI-assisted music control.

## Prerequisites

Before starting, ensure you have:

- ✅ A Google IDX workspace set up
- ✅ Node.js 18+ installed (Google IDX typically includes this)
- ✅ Spotify Developer account credentials
- ✅ This Spotify MCP server repository in your IDX workspace

## Step 1: Project Setup in Google IDX

### 1.1 Create or Open Your IDX Workspace

1. Open [Google IDX](https://idx.google.com)
2. Create a new workspace or open an existing one
3. If this is a new workspace, clone this repository:
   ```bash
   git clone https://github.com/Ackberry/spotify_mcp.git
   cd spotify_mcp
   ```

### 1.2 Install Dependencies

In the IDX terminal, run:

```bash
npm install
```

### 1.3 Build the Project

```bash
npm run build
```

This creates the `dist/` directory with the compiled JavaScript files.

## Step 2: Configure Environment Variables

### 2.1 Create .env File

Create a `.env` file in the project root:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

**To get your Spotify credentials:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or select an existing one
3. Copy the Client ID and Client Secret
4. Add `http://127.0.0.1:3000/callback` as a redirect URI in your app settings

## Step 3: Configure MCP Server in Google IDX

### 3.1 Create IDX Configuration Directory

Create the `.idx` directory in your project root (if it doesn't exist):

```bash
mkdir -p .idx
```

### 3.2 Create MCP Configuration File

Create `.idx/mcp.json` file with the following content:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": [
        "${workspaceFolder}/dist/server.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "${env:SPOTIFY_CLIENT_ID}",
        "SPOTIFY_CLIENT_SECRET": "${env:SPOTIFY_CLIENT_SECRET}",
        "SPOTIFY_REDIRECT_URI": "${env:SPOTIFY_REDIRECT_URI}"
      }
    }
  }
}
```

**Important Notes:**
- Replace `${workspaceFolder}` with the actual path to your workspace if the variable doesn't work
- Or use an absolute path like: `/path/to/your/workspace/dist/server.js`
- The `${env:...}` variables will read from your `.env` file or environment variables

### 3.3 Alternative: Direct Environment Variables

If IDX doesn't support environment variable substitution, you can set them directly in the config:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": [
        "${workspaceFolder}/dist/server.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "your_actual_client_id",
        "SPOTIFY_CLIENT_SECRET": "your_actual_client_secret",
        "SPOTIFY_REDIRECT_URI": "http://127.0.0.1:3000/callback"
      }
    }
  }
}
```

**⚠️ Security Warning:** If using direct values, ensure `.idx/mcp.json` is in your `.gitignore` file to avoid committing secrets.

## Step 4: Update .gitignore

Make sure sensitive files are ignored:

```gitignore
node_modules/
dist/
.env
tokens.json
.idx/mcp.json
*.log
.DS_Store
```

## Step 5: Authenticate with Spotify

### 5.1 Initial Authentication

1. Start the MCP server manually first to complete authentication:
   ```bash
   npm start
   ```

2. The server will output an authorization URL if you're not authenticated
3. Copy the URL and open it in your browser
4. Log in to Spotify and authorize the app
5. Copy the `code` parameter from the callback URL
6. The tokens will be saved automatically in `tokens.json`

### 5.2 Verify Authentication

Check that `tokens.json` was created:

```bash
ls -la tokens.json
```

## Step 6: Verify IDX Configuration

### 6.1 Check Configuration File

Verify your `.idx/mcp.json` file exists and is valid JSON:

```bash
cat .idx/mcp.json | python -m json.tool
```

Or use a JSON validator to ensure syntax is correct.

### 6.2 Test Server Manually

Test that the server starts correctly:

```bash
node dist/server.js
```

The server should start without errors. Press Ctrl+C to stop it.

## Step 7: Using MCP in Google IDX

### 7.1 Enable MCP in IDX

1. In Google IDX, look for MCP settings in the IDE preferences
2. Ensure MCP servers are enabled
3. The server should automatically load from `.idx/mcp.json`

### 7.2 Access AI Chat

1. Open the AI chat panel in Google IDX
2. The Spotify MCP tools should now be available
3. You can ask the AI assistant to:
   - "Play my workout playlist on Spotify"
   - "Search for songs by The Beatles"
   - "Pause Spotify playback"
   - "Set a 30 minute sleep timer"
   - "What's currently playing on Spotify?"

### 7.3 Verify Tools Are Available

Ask the AI assistant:
> "What MCP tools are available?"

You should see a list including:
- `play_playlist`
- `play_album`
- `play_track`
- `search_music`
- `control_playback`
- `get_current_playing`
- `set_sleep_timer`
- `cancel_sleep_timer`
- `get_active_timers`

## Step 8: Troubleshooting

### Issue: Server Not Starting

**Symptoms:** IDX can't connect to the MCP server

**Solutions:**
1. Verify Node.js is installed:
   ```bash
   node --version
   ```

2. Check that `dist/server.js` exists:
   ```bash
   ls -la dist/server.js
   ```
   If it doesn't exist, run `npm run build`

3. Test the server manually:
   ```bash
   node dist/server.js
   ```

4. Check the path in `.idx/mcp.json` is correct
   - Use absolute path if relative path doesn't work
   - Ensure the path points to the compiled `dist/server.js` file

### Issue: Authentication Errors

**Symptoms:** Server starts but can't authenticate with Spotify

**Solutions:**
1. Verify `.env` file exists and has correct values:
   ```bash
   cat .env
   ```

2. Check environment variables are set in `.idx/mcp.json`

3. Delete `tokens.json` and re-authenticate:
   ```bash
   rm tokens.json
   npm start
   # Follow authentication steps again
   ```

4. Verify redirect URI matches in Spotify Dashboard

### Issue: Tools Not Available in IDX

**Symptoms:** AI assistant doesn't recognize Spotify tools

**Solutions:**
1. Restart Google IDX or reload the workspace

2. Check `.idx/mcp.json` syntax is valid JSON

3. Verify the server is running (check IDX logs or terminal)

4. Try asking the AI: "List available MCP tools" or "What tools do you have access to?"

### Issue: Path Resolution Problems

**Symptoms:** IDX can't find the server file

**Solutions:**
1. Use absolute path instead of relative:
   ```json
   "args": ["/full/path/to/your/workspace/dist/server.js"]
   ```

2. Or use relative path from workspace root:
   ```json
   "args": ["./dist/server.js"]
   ```

3. Verify the working directory is set correctly

### Issue: Environment Variables Not Loading

**Symptoms:** Server runs but can't access Spotify credentials

**Solutions:**
1. Set environment variables directly in `.idx/mcp.json`:
   ```json
   "env": {
     "SPOTIFY_CLIENT_ID": "actual_value_here",
     "SPOTIFY_CLIENT_SECRET": "actual_value_here"
   }
   ```

2. Or set them in IDX's environment settings

3. Export them in your shell session:
   ```bash
   export SPOTIFY_CLIENT_ID="your_id"
   export SPOTIFY_CLIENT_SECRET="your_secret"
   ```

## Step 9: Example Configurations

### Configuration with Absolute Path

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": [
        "/home/user/idx-workspace/spotify_mcp/dist/server.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "abc123...",
        "SPOTIFY_CLIENT_SECRET": "def456...",
        "SPOTIFY_REDIRECT_URI": "http://127.0.0.1:3000/callback"
      }
    }
  }
}
```

### Configuration with Relative Path

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": [
        "./dist/server.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "abc123...",
        "SPOTIFY_CLIENT_SECRET": "def456...",
        "SPOTIFY_REDIRECT_URI": "http://127.0.0.1:3000/callback"
      }
    }
  }
}
```

## Step 10: Security Best Practices

1. **Never commit secrets to git:**
   - Add `.env` to `.gitignore`
   - Add `.idx/mcp.json` to `.gitignore` if it contains direct secrets
   - Use environment variables when possible

2. **Use IDX Secrets Management:**
   - If IDX supports secrets management, use that instead of plain text

3. **Rotate credentials regularly:**
   - Periodically update your Spotify API credentials

4. **Limit scope:**
   - Only grant necessary permissions in Spotify app settings

## Step 11: Advanced Configuration

### Multiple MCP Servers

If you have multiple MCP servers, you can configure them all:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "node",
      "args": ["./dist/server.js"],
      "env": {
        "SPOTIFY_CLIENT_ID": "...",
        "SPOTIFY_CLIENT_SECRET": "..."
      }
    },
    "another-server": {
      "command": "python",
      "args": ["./another/server.py"]
    }
  }
}
```

### Custom Node Path

If Node.js is not in PATH, specify full path:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "/usr/local/bin/node",
      "args": ["./dist/server.js"]
    }
  }
}
```

## Next Steps

Once everything is set up:

1. ✅ Test basic commands in IDX AI chat
2. ✅ Try playing a playlist: "Play my Discover Weekly playlist"
3. ✅ Test search: "Find songs by Taylor Swift"
4. ✅ Test playback control: "Pause Spotify"

## Additional Resources

- [Google IDX Documentation](https://idx.google.com/docs)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Firebase Studio MCP Servers](https://firebase.google.com/docs/studio/mcp-servers)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review IDX logs for error messages
3. Test the server manually outside of IDX
4. Verify all configuration paths and environment variables

## Summary Checklist

- [ ] Project cloned/built in IDX workspace
- [ ] Dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] `.env` file created with Spotify credentials
- [ ] `.idx/mcp.json` configuration file created
- [ ] Spotify authentication completed
- [ ] `tokens.json` file exists
- [ ] Server starts manually without errors
- [ ] MCP tools appear in IDX AI chat
- [ ] Can execute Spotify commands through AI

---

**Note:** Configuration details may vary slightly depending on your Google IDX version. If you encounter differences, check the latest IDX documentation for MCP server configuration.

