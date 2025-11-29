import { SpotifyClient } from '../spotify/client.js';

export async function searchMusic(client: SpotifyClient, query: string, limit: number = 10) {
  const results = await client.search(query, limit);
  
  return {
    success: true,
    query,
    results: {
      tracks: results.tracks.slice(0, limit),
      albums: results.albums.slice(0, limit),
      artists: results.artists.slice(0, limit),
    },
  };
}

