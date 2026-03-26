import axios from 'axios';

// Google Books API configuration
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

// Create axios instance with default config
const googleBooksApi = axios.create({
  baseURL: GOOGLE_BOOKS_BASE_URL,
});

// Search for books
export const searchBooks = async (query) => {
  try {
    const response = await googleBooksApi.get('/volumes', {
      params: {
        q: query,
        maxResults: 4, // Limit to 4 suggestions to fit better
        printType: 'books',
        orderBy: 'relevance'
      },
    });
    
    return response.data.items?.map(book => {
      const volumeInfo = book.volumeInfo;
      const imageLinks = volumeInfo.imageLinks;
      
      return {
        id: book.id,
        title: volumeInfo.title || 'Unknown Title',
        authors: volumeInfo.authors || [],
        year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : null,
        poster: imageLinks?.thumbnail?.replace('http://', 'https://') || null,
        description: volumeInfo.description || null,
        rating: volumeInfo.averageRating || null,
        pageCount: volumeInfo.pageCount || null,
        publisher: volumeInfo.publisher || null,
        categories: volumeInfo.categories || [],
        type: 'Book'
      };
    }) || [];
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

// Get detailed information for a book
export const getBookDetails = async (bookId) => {
  try {
    const response = await googleBooksApi.get(`/volumes/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting book details:', error);
    return null;
  }
}; 