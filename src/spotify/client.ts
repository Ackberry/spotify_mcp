import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyAuth } from './auth.js';
import type { PlaylistInfo, SearchResult } from '../types.js';

export class SpotifyClient {
  private auth: SpotifyAuth;

  constructor(auth: SpotifyAuth) {
    this.auth = auth;
  }

  private async getApi(): Promise<SpotifyWebApi> {
    await this.auth.ensureValidToken();
    return this.auth.getApi();
  }

  async getCurrentUserPlaylists(): Promise<PlaylistInfo[]> {
    const api = await this.getApi();
    const data = await api.getUserPlaylists();
    
    return data.body.items.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      uri: playlist.uri,
    }));
  }

  async findPlaylistByName(name: string): Promise<PlaylistInfo | null> {
    const playlists = await this.getCurrentUserPlaylists();
    const normalizedName = name.toLowerCase().trim();
    
    const playlist = playlists.find(p => 
      p.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(p.name.toLowerCase())
    );
    
    return playlist || null;
  }

  async searchTracks(query: string, limit: number = 10) {
    const api = await this.getApi();
    const data = await api.searchTracks(query, { limit });
    
    return data.body.tracks?.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown',
      uri: track.uri,
      album: track.album.name,
    })) || [];
  }

  async searchAlbums(query: string, limit: number = 10) {
    const api = await this.getApi();
    const data = await api.searchAlbums(query, { limit });
    
    return data.body.albums?.items.map(album => ({
      id: album.id,
      name: album.name,
      artist: album.artists[0]?.name || 'Unknown',
      uri: album.uri,
    })) || [];
  }

  async searchArtists(query: string, limit: number = 10) {
    const api = await this.getApi();
    const data = await api.searchArtists(query, { limit });
    
    return data.body.artists?.items.map(artist => ({
      id: artist.id,
      name: artist.name,
      uri: artist.uri,
    })) || [];
  }

  async search(query: string, limit: number = 10): Promise<SearchResult> {
    const api = await this.getApi();
    const [tracksData, albumsData, artistsData] = await Promise.all([
      api.searchTracks(query, { limit }),
      api.searchAlbums(query, { limit }),
      api.searchArtists(query, { limit }),
    ]);

    return {
      tracks: tracksData.body.tracks?.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown',
        uri: track.uri,
      })) || [],
      albums: albumsData.body.albums?.items.map(album => ({
        id: album.id,
        name: album.name,
        artist: album.artists[0]?.name || 'Unknown',
        uri: album.uri,
      })) || [],
      artists: artistsData.body.artists?.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        uri: artist.uri,
      })) || [],
    };
  }

  async playPlaylist(playlistUri: string, deviceId?: string) {
    const api = await this.getApi();
    await api.play({
      context_uri: playlistUri,
      device_id: deviceId,
    });
  }

  async playAlbum(albumUri: string, deviceId?: string) {
    const api = await this.getApi();
    await api.play({
      context_uri: albumUri,
      device_id: deviceId,
    });
  }

  async playTrack(trackUri: string, deviceId?: string) {
    const api = await this.getApi();
    await api.play({
      uris: [trackUri],
      device_id: deviceId,
    });
  }

  async pause(deviceId?: string) {
    const api = await this.getApi();
    await api.pause({ device_id: deviceId });
  }

  async resume(deviceId?: string) {
    const api = await this.getApi();
    await api.play({ device_id: deviceId });
  }

  async skipToNext(deviceId?: string) {
    const api = await this.getApi();
    await api.skipToNext({ device_id: deviceId });
  }

  async skipToPrevious(deviceId?: string) {
    const api = await this.getApi();
    await api.skipToPrevious({ device_id: deviceId });
  }

  async setVolume(volumePercent: number, deviceId?: string) {
    const api = await this.getApi();
    await api.setVolume(volumePercent, { device_id: deviceId });
  }

  async getCurrentlyPlaying() {
    const api = await this.getApi();
    const data = await api.getMyCurrentPlayingTrack();
    
    if (!data.body.item) {
      return null;
    }

    const track = data.body.item as any;
    return {
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown',
      album: track.album?.name || 'Unknown',
      uri: track.uri,
      isPlaying: data.body.is_playing,
      progressMs: data.body.progress_ms || 0,
    };
  }

  async getDevices() {
    const api = await this.getApi();
    const data = await api.getMyDevices();
    return data.body.devices.map(device => ({
      id: device.id,
      name: device.name,
      type: device.type,
      isActive: device.is_active,
      volumePercent: device.volume_percent || 0,
    }));
  }
}

