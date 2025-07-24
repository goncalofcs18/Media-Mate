import React, { useState, useEffect } from 'react';
import { searchMovies, searchTVShows } from '../utils/tmdbApi';

const SearchableInput = ({ type, onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchFunction = type === 'Movie' ? searchMovies : searchTVShows;
    
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
  }, [value, type]);

  const handleSuggestionClick = (suggestion) => {
    onSelect(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={() => value.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
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
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#ece7dd',
          border: '1px solid #ccc',
          borderRadius: '12px',
          padding: 'clamp(12px, 3vw, 16px)',
          marginTop: '4px',
          textAlign: 'center',
          zIndex: 1000,
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: '#434c96',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          Loading...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
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
          {suggestions.map((suggestion, index) => (
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
                    height: 'clamp(54px, 10.5vw, 66px)',
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
                  {suggestion.title} ({suggestion.year})
                </div>
                {suggestion.rating && (
                  <div style={{ 
                    fontSize: 'clamp(13px, 3vw, 15px)', 
                    color: '#666',
                    marginTop: '3px',
                    lineHeight: 1
                  }}>
                    ⭐ {suggestion.rating.toFixed(1)}
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