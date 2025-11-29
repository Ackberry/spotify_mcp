export interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SleepTimer {
  id: string;
  duration: number;
  scheduledAt: number;
  timeoutId: NodeJS.Timeout;
}

export interface PlaylistInfo {
  id: string;
  name: string;
  uri: string;
}

export interface SearchResult {
  tracks: Array<{
    id: string;
    name: string;
    artist: string;
    uri: string;
  }>;
  albums: Array<{
    id: string;
    name: string;
    artist: string;
    uri: string;
  }>;
  artists: Array<{
    id: string;
    name: string;
    uri: string;
  }>;
}

