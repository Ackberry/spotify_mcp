import { SpotifyClient } from '../spotify/client.js';

export async function controlPlayback(
  client: SpotifyClient,
  action: 'play' | 'pause' | 'skip-next' | 'skip-previous' | 'volume',
  value?: number,
  deviceId?: string
) {
  switch (action) {
    case 'play':
      await client.resume(deviceId);
      return { success: true, message: 'Playback resumed' };
    
    case 'pause':
      await client.pause(deviceId);
      return { success: true, message: 'Playback paused' };
    
    case 'skip-next':
      await client.skipToNext(deviceId);
      return { success: true, message: 'Skipped to next track' };
    
    case 'skip-previous':
      await client.skipToPrevious(deviceId);
      return { success: true, message: 'Skipped to previous track' };
    
    case 'volume':
      if (value === undefined || value < 0 || value > 100) {
        throw new Error('Volume must be between 0 and 100');
      }
      await client.setVolume(value, deviceId);
      return { success: true, message: `Volume set to ${value}%` };
    
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

export async function getCurrentPlaying(client: SpotifyClient) {
  const track = await client.getCurrentlyPlaying();
  
  if (!track) {
    return {
      success: true,
      playing: false,
      message: 'No track currently playing',
    };
  }

  return {
    success: true,
    playing: track.isPlaying,
    track: {
      name: track.name,
      artist: track.artist,
      album: track.album,
      uri: track.uri,
      progressMs: track.progressMs,
    },
  };
}

