import axios from 'axios';

// TMDB API configuration
const TMDB_API_KEY = '541ca05453a05423360b3424e56b3619'; // You'll need to get this from https://www.themoviedb.org/settings/api
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Search for movies
export const searchMovies = async (query) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query },
    });
    return response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
      overview: movie.overview,
      rating: movie.vote_average,
      type: 'Movie'
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Search for TV shows
export const searchTVShows = async (query) => {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: { query },
    });
    return response.data.results.map(show => ({
      id: show.id,
      title: show.name,
      year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Unknown',
      poster: show.poster_path ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}` : null,
      overview: show.overview,
      rating: show.vote_average,
      type: 'TV Show'
    }));
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return [];
  }
};

// Get detailed information for a movie
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    return null;
  }
};

// Get detailed information for a TV show
export const getTVShowDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting TV show details:', error);
    return null;
  }
}; 