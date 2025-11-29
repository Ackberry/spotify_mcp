import SpotifyWebApi from 'spotify-web-api-node';
import type { TokenData, SpotifyConfig } from '../types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_FILE = path.join(__dirname, '../../tokens.json');

export class SpotifyAuth {
  private spotifyApi: SpotifyWebApi;
  private tokenData: TokenData | null = null;

  constructor(config: SpotifyConfig) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
    });
  }

  async loadTokens(): Promise<TokenData | null> {
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      this.tokenData = JSON.parse(data);
      
      if (this.tokenData && this.isTokenExpired(this.tokenData)) {
        await this.refreshAccessToken();
      }
      
      if (this.tokenData) {
        this.spotifyApi.setAccessToken(this.tokenData.accessToken);
        this.spotifyApi.setRefreshToken(this.tokenData.refreshToken);
      }
      
      return this.tokenData;
    } catch (error) {
      return null;
    }
  }

  async saveTokens(tokenData: TokenData): Promise<void> {
    this.tokenData = tokenData;
    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2), 'utf-8');
    this.spotifyApi.setAccessToken(tokenData.accessToken);
    this.spotifyApi.setRefreshToken(tokenData.refreshToken);
  }

  async getAuthorizationUrl(): Promise<string> {
    const scopes = [
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'playlist-read-private',
      'user-library-read',
    ];

    return this.spotifyApi.createAuthorizeURL(scopes, 'state');
  }

  async authorize(code: string): Promise<TokenData> {
    try {
      const data = await this.spotifyApi.authorizationCodeGrant(code);
      const tokenData: TokenData = {
        accessToken: data.body['access_token'],
        refreshToken: data.body['refresh_token'],
        expiresAt: Date.now() + (data.body['expires_in'] * 1000),
      };
      
      await this.saveTokens(tokenData);
      return tokenData;
    } catch (error) {
      throw new Error(`Failed to authorize: ${error}`);
    }
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.tokenData?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      this.spotifyApi.setRefreshToken(this.tokenData.refreshToken);
      const data = await this.spotifyApi.refreshAccessToken();
      
      const newTokenData: TokenData = {
        ...this.tokenData,
        accessToken: data.body['access_token'],
        expiresAt: Date.now() + (data.body['expires_in'] * 1000),
      };
      
      await this.saveTokens(newTokenData);
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error}`);
    }
  }

  async ensureValidToken(): Promise<void> {
    if (!this.tokenData) {
      throw new Error('Not authenticated. Please authorize first.');
    }

    if (this.isTokenExpired(this.tokenData)) {
      await this.refreshAccessToken();
    }
  }

  isTokenExpired(tokenData: TokenData): boolean {
    return Date.now() >= tokenData.expiresAt - 60000;
  }

  getApi(): SpotifyWebApi {
    return this.spotifyApi;
  }

  isAuthenticated(): boolean {
    return this.tokenData !== null;
  }
}

