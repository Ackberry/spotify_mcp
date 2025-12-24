# Spotify Developer Dashboard Setup

## Fix "Redirect URI Invalid" Error

This error occurs when the redirect URI in your `.env` file doesn't match what's registered in Spotify Developer Dashboard.

### Step 1: Check Your Current Redirect URI

The default redirect URI is: `http://127.0.0.1:3000/callback`

### Step 2: Add Redirect URI to Spotify Dashboard

1. **Go to Spotify Developer Dashboard:**
   - Visit: https://developer.spotify.com/dashboard
   - Sign in with your Spotify account

2. **Select or Create Your App:**
   - Click on your app (or click "Create an App")
   - Give it a name like "Spotify MCP Server"
   - Description: "MCP server for AI assistants"
   - Accept the terms and click "Create"

3. **Edit Settings:**
   - Click "Edit Settings" button
   - Scroll down to "Redirect URIs" section

4. **Add the Redirect URI:**
   - Click "Add URI"
   - Enter exactly: `http://127.0.0.1:3000/callback`
   - **Important:** Must match EXACTLY (case-sensitive, no trailing slash)
   - Click "Add"

5. **Save Changes:**
   - Scroll to the bottom
   - Click "Save" or "Add"
   - Wait a few seconds for changes to take effect

### Step 3: Copy Your Credentials

1. **Client ID:**
   - You'll see it on the app overview page
   - Copy it to your `.env` file

2. **Client Secret:**
   - Click "Show Client Secret" or "View client secret"
   - Copy it to your `.env` file

### Step 4: Verify Your .env File

Make sure your `.env` file has:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

**Valid Redirect URI Formats (Spotify Requirements):**
- ✅ `http://127.0.0.1:3000/callback` (IP-based localhost - **recommended**)
- ✅ `https://example.com/callback` (HTTPS with domain)
- ✅ `http://[::1]:3000/callback` (IPv6 localhost)
- ❌ `http://localhost:3000/callback` (NOT accepted by Spotify)
- ❌ `http://127.0.0.1:3000/callback/` (no trailing slash)
- ❌ `http://127.0.0.1/callback` (missing port)
- ❌ Different port number between Dashboard and .env
- ❌ Extra spaces or quotes

### Step 5: Test Again

After adding the redirect URI and saving:

```bash
npm run auth
```

If you still get an error, double-check:
1. ✅ Redirect URI in Spotify Dashboard matches exactly
2. ✅ Redirect URI in `.env` file matches exactly
3. ✅ You clicked "Save" in Spotify Dashboard
4. ✅ Waited 10-30 seconds for changes to propagate

### Alternative Redirect URIs (if port 3000 is busy)

If port 3000 is already in use, you can use a different port:

1. **In Spotify Dashboard**, add: `http://127.0.0.1:8888/callback`
2. **In your `.env` file**, change to: `SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback`
3. **Update** `src/auth-helper.ts` if needed (but it should auto-detect from REDIRECT_URI)

### Troubleshooting

**"Invalid client" error:**
- Verify Client ID and Client Secret are correct
- Make sure there are no extra spaces or quotes

**"Redirect URI mismatch" error:**
- The redirect URI must match EXACTLY (case, port, protocol, path)
- Try removing and re-adding it in Spotify Dashboard
- Make sure you saved changes in Spotify Dashboard

**"Connection refused" error:**
- Make sure no other app is using port 3000
- Try a different port (like 8888) and update both Spotify Dashboard and `.env`

**Still not working?**
- Check Spotify Developer Dashboard for any error messages
- Verify your app status is "Active" not "Inactive"
- Try creating a new app if the current one has issues

