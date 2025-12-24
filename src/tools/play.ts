import { SpotifyClient } from '../spotify/client.js';

export async function playPlaylist(client: SpotifyClient, playlistName: string, deviceId?: string) {
  const playlist = await client.findPlaylistByName(playlistName);
  
  if (!playlist) {
    throw new Error(`Playlist "${playlistName}" not found`);
  }

  await client.playPlaylist(playlist.uri, deviceId);
  return {
    success: true,
    message: `Playing playlist: ${playlist.name}`,
    playlist: {
      id: playlist.id,
      name: playlist.name,
    },
  };
}

export async function playAlbum(client: SpotifyClient, albumName: string, artistName?: string, deviceId?: string) {
  const query = artistName ? `${albumName} artist:${artistName}` : albumName;
  const results = await client.searchAlbums(query, 1);
  
  if (results.length === 0) {
    throw new Error(`Album "${albumName}" not found`);
  }

  const album = results[0];
  await client.playAlbum(album.uri, deviceId);
  
  return {
    success: true,
    message: `Playing album: ${album.name} by ${album.artist}`,
    album: {
      id: album.id,
      name: album.name,
      artist: album.artist,
    },
  };
}

export async function playTrack(client: SpotifyClient, trackName: string, artistName?: string, deviceId?: string) {
  const query = artistName ? `track:${trackName} artist:${artistName}` : trackName;
  const results = await client.searchTracks(query, 1);
  
  if (results.length === 0) {
    throw new Error(`Track "${trackName}" not found`);
  }

  const track = results[0];
  await client.playTrack(track.uri, deviceId);
  
  return {
    success: true,
    message: `Playing track: ${track.name} by ${track.artist}`,
    track: {
      id: track.id,
      name: track.name,
      artist: track.artist,
    },
  };
}

export async function playRandomSong(client: SpotifyClient, deviceId?: string) {
  const track = await client.getRandomTrack();
  await client.playTrack(track.uri, deviceId);
  
  return {
    success: true,
    message: `Playing random track: ${track.name} by ${track.artist}`,
    track: {
      id: track.id,
      name: track.name,
      artist: track.artist,
      album: track.album,
    },
  };
}

