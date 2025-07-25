import React, { useState, useEffect } from 'react';
import { searchMovies, searchTVShows } from '../utils/tmdbApi';
import { searchBooks } from '../utils/googleBooksApi';
import { searchTracks } from '../utils/lastfmApi';

const SearchableInput = ({ type, onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Make API calls for Movie, TV Show, Book, and Favorite Song types
    if (type === 'Movie' || type === 'TV Show' || type === 'Book' || type === 'Favorite Song') {
      let searchFunction;

      if (type === 'Movie') {
        searchFunction = searchMovies;
      } else if (type === 'TV Show') {
        searchFunction = searchTVShows;
      } else if (type === 'Book') {
        searchFunction = searchBooks;
      } else if (type === 'Favorite Song') {
        searchFunction = searchTracks;
      }

      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(async () => {
        if (value.trim().length > 2) {
          setLoading(true);
          try {
            const results = await searchFunction(value);
            setSuggestions(results.slice(0, 4)); // Limit to 4 suggestions to fit better
            setShowSuggestions(true);
          } catch (error) {
            console.error('Search error:', error);
            setSuggestions([]);
          }
          setLoading(false);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      // For other types (Concert, etc.), just show the dropdown if there's text
      if (value.trim().length > 2) {
        setSuggestions([]);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [value, type]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    onSelect(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleCustomSave = () => {
    // Create a custom item for manual save
    const customItem = {
      id: `custom_${Date.now()}`,
      title: value.trim(),
      type: type,
      year: null,
      poster: null,
      rating: null,
      overview: null,
      tmdbId: null,
      // Music-specific fields
      artist: null,
      album: null
    };
    onSelect(customItem);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const formatBookDisplay = (book) => {
    let displayText = book.title;
    if (book.authors && book.authors.length > 0) {
      displayText += ` by ${book.authors[0]}`;
      if (book.authors.length > 1) {
        displayText += ` et al.`;
      }
    }
    if (book.year) {
      displayText += ` (${book.year})`;
    }
    return displayText;
  };

  const formatSongDisplay = (song) => {
    let displayText = song.title;
    if (song.artist) {
      displayText += ` by ${song.artist}`;
    }
    // Remove album from main display - it will be shown in the smaller section
    return displayText;
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={() => value.length > 2 && (suggestions.length > 0 || value.trim().length > 0) && setShowSuggestions(true)}
        placeholder={`Search for ${type.toLowerCase()}...`}
        style={{
          padding: 'clamp(14px, 3.5vw, 18px)',
          borderRadius: '12px',
          border: '1px solid #ccc',
          fontSize: 'clamp(18px, 4.5vw, 22px)',
          backgroundColor: '#ece7dd',
          color: '#434c96',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '52px',
        }}
      />

      {showSuggestions && value.trim().length > 2 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#ece7dd',
          border: '1px solid #ccc',
          borderRadius: '12px',
          marginTop: '4px',
          maxHeight: 'min(220px, 40vh)',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}>
          {/* Custom "Save as typed" option */}
          <div
            onClick={handleCustomSave}
            style={{
              padding: 'clamp(14px, 3.5vw, 18px)',
              borderBottom: suggestions.length > 0 ? '2px solid #434c96' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(12px, 2.5vw, 16px)',
              fontSize: 'clamp(16px, 4vw, 18px)',
              minHeight: '65px',
              backgroundColor: '#d4e6f1',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#aed6f1'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#d4e6f1'}
          >
            <div style={{
              width: 'clamp(36px, 7vw, 44px)',
              height: type === 'Favorite Song' ? 'clamp(36px, 7vw, 44px)' : 'clamp(54px, 10.5vw, 66px)', // Square for songs
              backgroundColor: '#434c96',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 'clamp(20px, 5vw, 28px)',
              color: '#fff'
            }}>
              +
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 'bold',
                color: '#434c96',
                fontSize: 'clamp(15px, 3.5vw, 17px)',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                Save "{value.trim()}" as {type === 'Favorite Song' ? 'Song' : type}
              </div>
              <div style={{
                fontSize: 'clamp(13px, 3vw, 15px)',
                color: '#666',
                marginTop: '3px',
                lineHeight: 1
              }}>
                💾 Custom entry
              </div>
            </div>
          </div>

          {/* API suggestions */}
          {(type === 'Movie' || type === 'TV Show' || type === 'Book' || type === 'Favorite Song') && suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: 'clamp(14px, 3.5vw, 18px)',
                borderBottom: index < suggestions.length - 1 ? '1px solid #d0c7b8' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(12px, 2.5vw, 16px)',
                fontSize: 'clamp(16px, 4vw, 18px)',
                minHeight: '65px',
                backgroundColor: '#ece7dd',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ddd4c7'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ece7dd'}
            >
              {suggestion.poster && (
                <img
                  src={suggestion.poster}
                  alt={suggestion.title}
                  style={{
                    width: 'clamp(36px, 7vw, 44px)',
                    height: type === 'Favorite Song' ? 'clamp(36px, 7vw, 44px)' : 'clamp(54px, 10.5vw, 66px)', // Square for songs
                    objectFit: 'cover',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 'bold',
                  color: '#434c96',
                  fontSize: 'clamp(15px, 3.5vw, 17px)',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {type === 'Book' ? formatBookDisplay(suggestion)
                   : type === 'Favorite Song' ? formatSongDisplay(suggestion)
                   : `${suggestion.title} (${suggestion.year})`}
                </div>
                {suggestion.rating && (
                  <div style={{
                    fontSize: 'clamp(13px, 3vw, 15px)',
                    color: '#666',
                    marginTop: '3px',
                    lineHeight: 1
                  }}>
                    {type === 'Book' ? `📚 ${suggestion.rating.toFixed(1)}/5` : `⭐ ${suggestion.rating.toFixed(1)}`}
                  </div>
                )}
                {type === 'Book' && suggestion.pageCount && (
                  <div style={{
                    fontSize: 'clamp(11px, 2.5vw, 13px)',
                    color: '#888',
                    marginTop: '1px',
                    lineHeight: 1
                  }}>
                    📄 {suggestion.pageCount} pages
                  </div>
                )}
                {type === 'Favorite Song' && suggestion.album && (
                  <div style={{
                    fontSize: 'clamp(11px, 2.5vw, 13px)',
                    color: '#888',
                    marginTop: '1px',
                    lineHeight: 1
                  }}>
                    💿 {suggestion.album}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableInput; 