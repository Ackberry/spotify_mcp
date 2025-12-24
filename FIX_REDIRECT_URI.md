# Fix Redirect URI in Spotify Dashboard

## Current Issue
Your Spotify app only has `https://www.spotify.com` as a redirect URI, but you need to add `http://127.0.0.1:3000/callback`.

## Step-by-Step Fix

### 1. Edit Your App Settings
- In the Spotify Developer Dashboard, find your app "SpotifyMCP"
- Look for an **"Edit Settings"** button (usually near the top right or in the app details page)
- Click it

### 2. Add the Redirect URI
- Scroll down to find the **"Redirect URIs"** section
- You'll see `https://www.spotify.com` listed
- Click **"Add URI"** or the **"+"** button
- A text field will appear
- Enter exactly: `http://127.0.0.1:3000/callback`
- Press Enter or click the add button

### 3. Save Changes
- Scroll to the bottom of the settings page
- Click **"Save"** or **"Add"**
- Wait a few seconds for the changes to save

### 4. Verify
After saving, you should see:
```
Redirect URIs
  • https://www.spotify.com
  • http://127.0.0.1:3000/callback
```

## Important Notes

- ✅ **Keep** `https://www.spotify.com` (you can have multiple redirect URIs)
- ✅ **Add** `http://127.0.0.1:3000/callback` (exact format, no trailing slash)
- ✅ Make sure it's `http://` not `https://`
- ✅ Make sure it's `127.0.0.1` not `localhost`

## After Adding the Redirect URI

1. **Update your `.env` file** (if not already):
   ```env
   SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
   ```

2. **Test authentication**:
   ```bash
   npm run auth
   ```

## Troubleshooting

**Can't find "Edit Settings" button?**
- Look for a settings icon (⚙️) or "Settings" link
- Some dashboards have it under "App Settings" or "Configuration"

**Don't see "Redirect URIs" section?**
- It's usually under "App Details" or "Configuration"
- Scroll down on the settings page

**Still getting "invalid redirect URI" error?**
- Make sure you clicked "Save" after adding the URI
- Wait 10-30 seconds after saving
- Verify there are no typos (exact match required)
- Clear browser cache and try again

