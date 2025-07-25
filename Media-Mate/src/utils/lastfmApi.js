import axios from 'axios';

// Last.fm API configuration
const LASTFM_API_KEY = 'b25b959554ed76058ac220b7b2e0a026'; // Public demo API key
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// Get detailed track information including album and cover art
const getTrackInfo = async (artist, track) => {
  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'track.getInfo',
        artist: artist,
        track: track,
        api_key: LASTFM_API_KEY,
        format: 'json',
      },
    });

    const trackInfo = response.data.track;
    
    // Get the largest available image
    const images = trackInfo.album?.image || [];
    const coverArt = images.find(img => img.size === 'extralarge')?.['#text'] || 
                     images.find(img => img.size === 'large')?.['#text'] || 
                     images.find(img => img.size === 'medium')?.['#text'] || null;

    return {
      album: trackInfo.album?.title || null,
      poster: coverArt,
      listeners: trackInfo.listeners ? parseInt(trackInfo.listeners) : null,
      playcount: trackInfo.playcount ? parseInt(trackInfo.playcount) : null,
    };
  } catch (error) {
    console.error('Error getting track info:', error);
    return { album: null, poster: null, listeners: null, playcount: null };
  }
};

// Search for songs/tracks with enhanced album and cover art info
export const searchTracks = async (query) => {
  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'track.search',
        track: query,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit: 4,
      },
    });

    const tracks = response.data.results?.trackmatches?.track || [];
    
    // Handle both single track and array of tracks
    const trackArray = Array.isArray(tracks) ? tracks : [tracks];
    const validTracks = trackArray.filter(track => track && track.name && track.artist);

    // Get detailed info for each track (including album and cover art)
    const enhancedTracks = await Promise.all(
      validTracks.map(async (track) => {
        const trackInfo = await getTrackInfo(track.artist, track.name);
        
        return {
          id: `${track.artist}_${track.name}_${Date.now()}_${Math.random()}`,
          title: track.name,
          artist: track.artist,
          album: trackInfo.album,
          poster: trackInfo.poster,
          url: track.url,
          listeners: trackInfo.listeners,
          type: 'Favorite Song'
        };
      })
    );

    return enhancedTracks;
  } catch (error) {
    console.error('Error searching tracks:', error);
    
    // Return mock data for development if API fails
    if (query.trim().length > 2) {
      return [
        {
          id: `mock_${Date.now()}_1`,
          title: `${query} (Sample Song 1)`,
          artist: 'Sample Artist 1',
          album: 'Sample Album',
          poster: 'https://via.placeholder.com/300x300/27a470/ffffff?text=♪',
          url: null,
          listeners: 1000000,
          type: 'Favorite Song'
        },
        {
          id: `mock_${Date.now()}_2`,
          title: `${query} (Sample Song 2)`,
          artist: 'Sample Artist 2',
          album: 'Another Album EP',
          poster: 'https://via.placeholder.com/300x300/434c96/ffffff?text=♫',
          url: null,
          listeners: 500000,
          type: 'Favorite Song'
        }
      ];
    }
    return [];
  }
};

// Get detailed track information including album
export const getTrackDetails = async (artist, track) => {
  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'track.getInfo',
        artist: artist,
        track: track,
        api_key: LASTFM_API_KEY,
        format: 'json',
      },
    });

    const trackInfo = response.data.track;
    
    // Get the largest available image
    const images = trackInfo.album?.image || [];
    const coverArt = images.find(img => img.size === 'extralarge')?.['#text'] || 
                     images.find(img => img.size === 'large')?.['#text'] || 
                     images.find(img => img.size === 'medium')?.['#text'] || null;
    
    return {
      id: `${trackInfo.artist.name}_${trackInfo.name}_${Date.now()}`,
      title: trackInfo.name,
      artist: trackInfo.artist.name,
      album: trackInfo.album?.title || null,
      poster: coverArt,
      url: trackInfo.url,
      listeners: trackInfo.listeners ? parseInt(trackInfo.listeners) : null,
      playcount: trackInfo.playcount ? parseInt(trackInfo.playcount) : null,
      duration: trackInfo.duration ? parseInt(trackInfo.duration) : null,
      summary: trackInfo.wiki?.summary || null,
      type: 'Favorite Song'
    };
  } catch (error) {
    console.error('Error getting track details:', error);
    return null;
  }
};

// Search for artists (alternative approach)
export const searchArtists = async (query) => {
  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'artist.search',
        artist: query,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit: 4,
      },
    });

    const artists = response.data.results?.artistmatches?.artist || [];
    const artistArray = Array.isArray(artists) ? artists : [artists];
    
    return artistArray.map(artist => ({
      id: `artist_${artist.name}_${Date.now()}_${Math.random()}`,
      name: artist.name,
      url: artist.url,
      listeners: artist.listeners ? parseInt(artist.listeners) : null,
      image: artist.image?.find(img => img.size === 'large')?.['#text'] || null,
    }));
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
};

// Get top tracks by artist
export const getArtistTopTracks = async (artistName) => {
  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'artist.getTopTracks',
        artist: artistName,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit: 4,
      },
    });

    const tracks = response.data.toptracks?.track || [];
    const trackArray = Array.isArray(tracks) ? tracks : [tracks];
    
    return trackArray.map(track => ({
      id: `${artistName}_${track.name}_${Date.now()}_${Math.random()}`,
      title: track.name,
      artist: artistName,
      album: null,
      poster: track.image?.find(img => img.size === 'large')?.['#text'] || null,
      url: track.url,
      listeners: track.listeners ? parseInt(track.listeners) : null,
      playcount: track.playcount ? parseInt(track.playcount) : null,
      type: 'Favorite Song'
    }));
  } catch (error) {
    console.error('Error getting artist top tracks:', error);
    return [];
  }
}; 