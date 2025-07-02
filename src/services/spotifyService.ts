const SPOTIFY_CLIENT_ID = '5264f593bbf94954a867837aa4699901';
const SPOTIFY_CLIENT_SECRET = '089fcb013e4c4f8d9e26db398d7b1661';
const REDIRECT_URI = 'http://127.0.0.1:8000/callback';

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
  }>;
}

class SpotifyService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
  }

  // Generate Spotify authorization URL
  getAuthUrl(): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'user-library-read'
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: REDIRECT_URI,
      state: 'aura-ai-auth'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<boolean> {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI
        })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      
      // Store tokens in localStorage
      localStorage.setItem('spotify_access_token', this.accessToken);
      if (this.refreshToken) {
        localStorage.setItem('spotify_refresh_token', this.refreshToken);
      }

      return true;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return false;
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      localStorage.setItem('spotify_access_token', this.accessToken);

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return false;
    }
  }

  // Make authenticated API request
  private async apiRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    let response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    // If token expired, try to refresh
    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
      }
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  // Get current user profile
  async getCurrentUser(): Promise<SpotifyUser | null> {
    try {
      return await this.apiRequest('/me');
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get user's top tracks
  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyTrack[]> {
    try {
      const data = await this.apiRequest(`/me/top/tracks?limit=20&time_range=${timeRange}`);
      return data.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        images: track.album.images
      }));
    } catch (error) {
      console.error('Error getting top tracks:', error);
      return [];
    }
  }

  // Get recently played tracks
  async getRecentlyPlayed(): Promise<SpotifyTrack[]> {
    try {
      const data = await this.apiRequest('/me/player/recently-played?limit=20');
      return data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        preview_url: item.track.preview_url,
        external_urls: item.track.external_urls,
        images: item.track.album.images
      }));
    } catch (error) {
      console.error('Error getting recently played:', error);
      return [];
    }
  }

  // Search for tracks
  async searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
    try {
      const data = await this.apiRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
      return data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        images: track.album.images
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  // Get aura-based music recommendations
  async getAuraRecommendations(auraColor: string, auraElement: string, auraScore: number): Promise<SpotifyTrack[]> {
    try {
      // Map aura attributes to Spotify audio features
      const audioFeatures = this.mapAuraToAudioFeatures(auraColor, auraElement, auraScore);
      
      const params = new URLSearchParams({
        limit: '10',
        market: 'US',
        seed_genres: audioFeatures.genres.join(','),
        target_valence: audioFeatures.valence.toString(),
        target_energy: audioFeatures.energy.toString(),
        target_danceability: audioFeatures.danceability.toString()
      });

      const data = await this.apiRequest(`/recommendations?${params.toString()}`);
      
      return data.tracks.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        images: track.album.images
      }));
    } catch (error) {
      console.error('Error getting aura recommendations:', error);
      return [];
    }
  }

  private mapAuraToAudioFeatures(color: string, element: string, score: number) {
    const normalizedScore = score / 100;
    
    // Base features
    let valence = normalizedScore; // Happiness/positivity
    let energy = normalizedScore;
    let danceability = 0.5;
    let genres = ['pop'];

    // Adjust based on aura color
    switch (color.toLowerCase()) {
      case 'red':
        energy = Math.min(0.9, energy + 0.3);
        danceability = Math.min(0.9, danceability + 0.2);
        genres = ['rock', 'pop', 'electronic'];
        break;
      case 'blue':
        valence = Math.max(0.3, valence - 0.2);
        energy = Math.max(0.3, energy - 0.2);
        genres = ['indie', 'alternative', 'chill'];
        break;
      case 'purple':
        danceability = Math.min(0.8, danceability + 0.1);
        genres = ['electronic', 'pop', 'dance'];
        break;
      case 'green':
        energy = Math.max(0.4, energy - 0.1);
        genres = ['indie', 'folk', 'acoustic'];
        break;
      case 'gold':
      case 'yellow':
        valence = Math.min(0.9, valence + 0.2);
        energy = Math.min(0.8, energy + 0.1);
        genres = ['pop', 'funk', 'soul'];
        break;
      case 'pink':
        valence = Math.min(0.9, valence + 0.1);
        danceability = Math.min(0.8, danceability + 0.2);
        genres = ['pop', 'r-n-b', 'dance'];
        break;
    }

    // Adjust based on element
    switch (element.toLowerCase()) {
      case 'fire':
        energy = Math.min(0.9, energy + 0.2);
        genres = ['rock', 'electronic', 'latin'];
        break;
      case 'water':
        valence = Math.max(0.3, valence - 0.1);
        energy = Math.max(0.3, energy - 0.2);
        genres = ['ambient', 'chill', 'indie'];
        break;
      case 'earth':
        energy = Math.max(0.4, energy - 0.1);
        genres = ['folk', 'country', 'acoustic'];
        break;
      case 'air':
        danceability = Math.min(0.8, danceability + 0.1);
        genres = ['electronic', 'synthpop', 'indie'];
        break;
      case 'spirit':
        genres = ['world-music', 'new-age', 'ambient'];
        break;
    }

    return {
      valence: Math.max(0.1, Math.min(0.9, valence)),
      energy: Math.max(0.1, Math.min(0.9, energy)),
      danceability: Math.max(0.1, Math.min(0.9, danceability)),
      genres: genres.slice(0, 3) // Spotify API allows max 5 seed genres, we use 3
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  // Logout
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
  }
}

export const spotifyService = new SpotifyService();