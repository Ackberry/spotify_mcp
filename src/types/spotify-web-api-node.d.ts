declare module 'spotify-web-api-node' {
  export default class SpotifyWebApi {
    constructor(credentials?: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
      accessToken?: string;
      refreshToken?: string;
    });

    setAccessToken(token: string): void;
    setRefreshToken(token: string): void;
    
    createAuthorizeURL(scopes: string[], state?: string): string;
    authorizationCodeGrant(code: string): Promise<any>;
    refreshAccessToken(): Promise<any>;
    
    getUserPlaylists(options?: any): Promise<any>;
    searchTracks(query: string, options?: any): Promise<any>;
    searchAlbums(query: string, options?: any): Promise<any>;
    searchArtists(query: string, options?: any): Promise<any>;
    
    play(options?: any): Promise<any>;
    pause(options?: any): Promise<any>;
    skipToNext(options?: any): Promise<any>;
    skipToPrevious(options?: any): Promise<any>;
    setVolume(volumePercent: number, options?: any): Promise<any>;
    getMyCurrentPlayingTrack(options?: any): Promise<any>;
    getMyDevices(options?: any): Promise<any>;
  }
}

