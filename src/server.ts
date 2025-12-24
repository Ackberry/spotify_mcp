import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
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

const server = new Server(
  {
    name: 'spotify-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'play_playlist',
        description: 'Play a Spotify playlist by name',
        inputSchema: {
          type: 'object',
          properties: {
            playlistName: {
              type: 'string',
              description: 'Name of the playlist to play',
            },
            deviceId: {
              type: 'string',
              description: 'Optional device ID to play on',
            },
          },
          required: ['playlistName'],
        },
      },
      {
        name: 'play_album',
        description: 'Play a Spotify album by name and optional artist',
        inputSchema: {
          type: 'object',
          properties: {
            albumName: {
              type: 'string',
              description: 'Name of the album to play',
            },
            artistName: {
              type: 'string',
              description: 'Optional artist name to help find the album',
            },
            deviceId: {
              type: 'string',
              description: 'Optional device ID to play on',
            },
          },
          required: ['albumName'],
        },
      },
      {
        name: 'play_track',
        description: 'Play a specific track by name and optional artist',
        inputSchema: {
          type: 'object',
          properties: {
            trackName: {
              type: 'string',
              description: 'Name of the track to play',
            },
            artistName: {
              type: 'string',
              description: 'Optional artist name to help find the track',
            },
            deviceId: {
              type: 'string',
              description: 'Optional device ID to play on',
            },
          },
          required: ['trackName'],
        },
      },
      {
        name: 'search_music',
        description: 'Search for music (tracks, albums, artists) on Spotify',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results per type (default: 10)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'control_playback',
        description: 'Control Spotify playback (play, pause, skip, volume)',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['play', 'pause', 'skip-next', 'skip-previous', 'volume'],
              description: 'Action to perform',
            },
            value: {
              type: 'number',
              description: 'Volume percentage (0-100) for volume action',
            },
            deviceId: {
              type: 'string',
              description: 'Optional device ID',
            },
          },
          required: ['action'],
        },
      },
      {
        name: 'get_current_playing',
        description: 'Get information about the currently playing track',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'set_sleep_timer',
        description: 'Set a sleep timer to automatically pause playback after specified minutes',
        inputSchema: {
          type: 'object',
          properties: {
            durationMinutes: {
              type: 'number',
              description: 'Duration in minutes before pausing playback',
            },
          },
          required: ['durationMinutes'],
        },
      },
      {
        name: 'cancel_sleep_timer',
        description: 'Cancel an active sleep timer',
        inputSchema: {
          type: 'object',
          properties: {
            timerId: {
              type: 'string',
              description: 'Optional timer ID to cancel specific timer, or omit to cancel all',
            },
          },
        },
      },
      {
        name: 'get_active_timers',
        description: 'Get list of active sleep timers',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!auth.isAuthenticated()) {
    await auth.loadTokens();
    if (!auth.isAuthenticated()) {
      const authUrl = await auth.getAuthorizationUrl();
      return {
        content: [
          {
            type: 'text',
            text: `Not authenticated. Please visit this URL to authorize: ${authUrl}\n\nAfter authorization, you'll receive a code. Use the authorize command with that code.`,
          },
        ],
        isError: true,
      };
    }
  }

  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'play_playlist':
        const playlistResult = await playTools.playPlaylist(
          client,
          args?.playlistName as string,
          args?.deviceId as string | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(playlistResult, null, 2),
            },
          ],
        };

      case 'play_album':
        const albumResult = await playTools.playAlbum(
          client,
          args?.albumName as string,
          args?.artistName as string | undefined,
          args?.deviceId as string | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(albumResult, null, 2),
            },
          ],
        };

      case 'play_track':
        const trackResult = await playTools.playTrack(
          client,
          args?.trackName as string,
          args?.artistName as string | undefined,
          args?.deviceId as string | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(trackResult, null, 2),
            },
          ],
        };

      case 'search_music':
        const searchResult = await searchTools.searchMusic(
          client,
          args?.query as string,
          (args?.limit as number) || 10
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(searchResult, null, 2),
            },
          ],
        };

      case 'control_playback':
        const controlResult = await playbackTools.controlPlayback(
          client,
          args?.action as 'play' | 'pause' | 'skip-next' | 'skip-previous' | 'volume',
          args?.value as number | undefined,
          args?.deviceId as string | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(controlResult, null, 2),
            },
          ],
        };

      case 'get_current_playing':
        const currentResult = await playbackTools.getCurrentPlaying(client);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(currentResult, null, 2),
            },
          ],
        };

      case 'set_sleep_timer':
        const timerResult = await timerTools.setSleepTimer(
          timerManager,
          args?.durationMinutes as number
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(timerResult, null, 2),
            },
          ],
        };

      case 'cancel_sleep_timer':
        const cancelResult = await timerTools.cancelSleepTimer(
          timerManager,
          args?.timerId as string | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(cancelResult, null, 2),
            },
          ],
        };

      case 'get_active_timers':
        const timersResult = await timerTools.getActiveTimers(timerManager);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(timersResult, null, 2),
            },
          ],
        };

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Spotify MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

