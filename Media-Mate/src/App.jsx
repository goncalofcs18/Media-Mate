import React, { useState, useEffect } from 'react';
import './App.css';
import SearchableInput from './components/SearchableInput';

function App() {
  const [currentPopup, setCurrentPopup] = useState(null); // Track which popup is open
  const [title, setTitle] = useState(''); // Store the current input value
  const [venue, setVenue] = useState(''); // Store the venue input value
  const [concertDate, setConcertDate] = useState(''); // Store the concert date
  const [items, setItems] = useState([]); // Store the list of all items (TV Shows, Movies, etc.)

  // Load saved items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('mediaMateItems');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Check if the data structure is valid
        if (Array.isArray(parsedItems) && parsedItems.every(item => item.title && item.type)) {
          setItems(parsedItems);
          console.log('Loaded', parsedItems.length, 'saved items from storage');
        } else {
          // Clear invalid data
          localStorage.removeItem('mediaMateItems');
          console.log('Cleared invalid localStorage data');
        }
      } catch (error) {
        console.error('Error loading saved items:', error);
        localStorage.removeItem('mediaMateItems');
      }
    }
  }, []);

  // Save items to localStorage whenever items array changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('mediaMateItems', JSON.stringify(items));
      console.log('Saved', items.length, 'items to storage');
    }
  }, [items]);

  const handleApiItemSelect = (selectedItem) => {
    // Add API-selected item with rich metadata
    const newItem = {
      id: `${selectedItem.type}_${selectedItem.id}_${Date.now()}`,
      title: selectedItem.title,
      type: selectedItem.type,
      year: selectedItem.year,
      poster: selectedItem.poster,
      rating: selectedItem.rating,
      overview: selectedItem.overview || selectedItem.description,
      tmdbId: selectedItem.tmdbId || null,
      // Book-specific fields
      authors: selectedItem.authors || null,
      pageCount: selectedItem.pageCount || null,
      publisher: selectedItem.publisher || null,
      categories: selectedItem.categories || null,
      // Music-specific fields
      artist: selectedItem.artist || null,
      album: selectedItem.album || null,
      listeners: selectedItem.listeners || null,
      url: selectedItem.url || null,
      // Concert-specific fields
      followers: selectedItem.followers || null,
      popularity: selectedItem.popularity || null,
      genres: selectedItem.genres || null,
      spotifyUrl: selectedItem.spotifyUrl || null,
      // Venue information
      venue: venue || null,
      date: concertDate || null
    };
    
    setItems([...items, newItem]);
    setTitle(''); // Clear input
    setVenue(''); // Clear venue input
    setConcertDate(''); // Clear date input
    setCurrentPopup(null); // Close popup
  };

  const handleArtistSelect = (selectedArtist) => {
    // Set the artist name in the title input without closing popup
    setTitle(selectedArtist.title || selectedArtist.name);
  };

  // Function to format date input as dd/mm/yyyy
  const formatDateInput = (value) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Apply formatting based on length
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    } else {
      // Limit to 8 digits (dd/mm/yyyy)
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleDateChange = (e) => {
    const formatted = formatDateInput(e.target.value);
    setConcertDate(formatted);
  };

  // Function to clear all data (optional - for testing)
  const clearAllData = () => {
    setItems([]);
    localStorage.removeItem('mediaMateItems');
    console.log('All data cleared');
  };

  return (
    <div className="app">
      {/* LOGO */}
      <div className="image-container">
        <img
          src="assets/logo.png"
          alt="Metallic Icon"
          className="metallic-image"
        />
      </div>

      {/* CONTAINER TO DISPLAY ITEMS */}
      {items.length > 0 && (
        <div className="main-container">
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4px',
            padding: '4px'
          }}>
            <button 
              onClick={clearAllData}
              style={{
                padding: '4px 8px',
                backgroundColor: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Clear All Data
            </button>
          </div>
          <ul>
            {items.map((item, index) => (
              <li
                key={item.id || index}
                style={{
                  backgroundColor: item.type === 'TV Show' ? '#f8c04b' 
                    : item.type === 'Movie' ? '#dd0526' 
                    : item.type === 'Book' ? '#ed712f' 
                    : item.type === 'Favorite Song' ? '#27a470'
                    : '#8f337e',
                  color: item.type === 'TV Show' ? '#434c96' : '#ffffff',
                }}
              >
                {/* Show poster if available, otherwise show icon */}
                {item.poster ? (
                  <img
                    src={item.poster}
                    className={item.type === 'Favorite Song' ? 'item-poster-square' : 'item-poster'}
                    alt={item.title}
                  />
                ) : (
              <img
                src={
                  item.type === 'TV Show'
                    ? '/assets/tv2.png'
                    : item.type === 'Movie'
                    ? '/assets/movie.png'
                        : item.type === 'Book'
                        ? '/assets/book.png'
                        : item.type === 'Favorite Song'
                        ? '/assets/music.png'
                    : '/assets/microphone.png'
                }
                    className={item.type === 'Concert' ? 'item-icon-large' : 'item-icon'}
                alt={item.type}
              />
                )}
                
                <div className="item-content">
                  <div className="item-title">
                    {item.title}
                    {item.type === 'Book' && item.authors && item.authors.length > 0 && 
                      ` by ${item.authors[0]}${item.authors.length > 1 ? ' et al.' : ''}`
                    }
                    {item.type === 'Favorite Song' && item.artist && 
                      ` by ${item.artist}`
                    }
                    {item.year && ` (${item.year})`}
                  </div>
                  {item.rating && (
                    <div className="item-rating">
                      {item.type === 'Book' ? `📚 ${item.rating.toFixed(1)}/5` : `⭐ ${item.rating.toFixed(1)}`}
                    </div>
                  )}
                  {item.type === 'Book' && item.pageCount && (
                    <div style={{ 
                      fontSize: 'clamp(11px, 2.5vw, 13px)', 
                      color: item.type === 'TV Show' ? '#434c96' : '#fff',
                      opacity: 0.8,
                      marginTop: '1px',
                      lineHeight: 1
                    }}>
                      📄 {item.pageCount} pages
                    </div>
                  )}
                  {item.type === 'Favorite Song' && item.album && (
                    <div style={{ 
                      fontSize: 'clamp(11px, 2.5vw, 13px)', 
                      color: item.type === 'TV Show' ? '#434c96' : '#fff',
                      opacity: 0.8,
                      marginTop: '1px',
                      lineHeight: 1
                    }}>
                      💿 {item.album}
                    </div>
                  )}
                  {item.type === 'Concert' && (item.venue || item.date) && (
                    <div style={{ 
                      fontSize: 'clamp(11px, 2.5vw, 13px)', 
                      color: item.type === 'TV Show' ? '#434c96' : '#fff',
                      opacity: 0.8,
                      marginTop: '1px',
                      lineHeight: 1,
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {item.venue && (
                        <span>🏛️ {item.venue}</span>
                      )}
                      {item.date && (
                        <span>📅 {item.date}</span>
                      )}
                    </div>
                  )}
                </div>
            </li>
          ))}
        </ul>
      </div>
      )}

      {/* MAIN BUTTON */}
      <button className="image-button" onClick={() => setCurrentPopup('main')}>
        <img src="assets/Media.png" alt="Button Icon" />
      </button>

      {/* MAIN POPUP */}
      {currentPopup === 'main' && (
        <div className="popup">
          <h3
            className="options-tag"
            style={{
              fontSize: 'clamp(32px, 7vw, 44px)',
              marginBottom: '15px',
              fontFamily: 'Kare, sans-serif',
              color: '#434c96',
            }}
          >
            Options
          </h3>
          <div className="grid-container">
            <button
              className="option-button"
              style={{ backgroundColor: '#f8c04b', color: '#ece7dd' }}
              onClick={() => setCurrentPopup('tvShow')}
            >
              <img src="assets/tv.png" alt="TV Show" />
              TV Show
            </button>
            <button
              className="option-button"
              style={{ backgroundColor: '#dd0526', color: '#ece7dd' }}
              onClick={() => setCurrentPopup('movie')}
            >
              <img src="assets/movie.png" alt="Movie" />
              Movie
            </button>
            <button
              className="option-button"
              style={{ backgroundColor: '#ed712f', color: '#ece7dd' }}
              onClick={() => setCurrentPopup('book')}
            >
              <img src="assets/book.png" alt="Book" />
              Book
            </button>
            <button
              className="option-button"
              style={{ backgroundColor: '#27a470', color: '#ece7dd' }}
              onClick={() => setCurrentPopup('favoriteSong')}
            >
              <img src="assets/music.png" alt="Music" />
              Song
            </button>
            <button
              className="option-button"
              style={{ backgroundColor: '#8f337e', color: '#ece7dd' }}
              onClick={() => setCurrentPopup('concert')}
            >
              <img src="assets/microphone.png" alt="Concert" />
              Concert
            </button>
            <button
              className="option-button"
              style={{ backgroundColor: '#434c96', color: '#ece7dd' }}
              onClick={() => setCurrentPopup('other')}
            >
              <img src="assets/ellipsis.png" alt="Other" />
              Other
            </button>
          </div>
          <button className="close-button" onClick={() => setCurrentPopup(null)}>
            Close
          </button>
        </div>
      )}

      {/* TV SHOW POPUP */}
      {currentPopup === 'tvShow' && (
        <div className="popup">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '16px',
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{
                fontSize: 'clamp(40px, 9vw, 52px)',
              fontFamily: 'Kare, sans-serif',
              color: '#f8c04b',
                margin: '0',
                lineHeight: '1.1'
              }}>
            TV Show
          </h3>
            </div>
            
            {/* Form Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '15px' }}>
              <label style={{
              display: 'block',
              fontFamily: 'Kare, sans-serif',
              color: '#434c96',
                fontSize: 'clamp(26px, 6vw, 32px)',
                marginBottom: '12px',
                textAlign: 'left'
              }}>
            Title:
          </label>
              
              <SearchableInput
                type="TV Show"
              value={title}
                onChange={setTitle}
                onSelect={handleApiItemSelect}
              />
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '20px' }}>
              <button className="close-button" onClick={() => setCurrentPopup('main')}>
                Back
            </button>
            </div>
          </div>
        </div>
      )}

      {/* MOVIE POPUP */}
      {currentPopup === 'movie' && (
        <div className="popup">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '16px',
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{
                fontSize: 'clamp(40px, 9vw, 52px)',
              fontFamily: 'Kare, sans-serif',
              color: '#dd0526',
                margin: '0',
                lineHeight: '1.1'
              }}>
            Movie
          </h3>
            </div>
            
            {/* Form Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '15px' }}>
              <label style={{
              display: 'block',
              fontFamily: 'Kare, sans-serif',
              color: '#434c96',
                fontSize: 'clamp(26px, 6vw, 32px)',
                marginBottom: '12px',
                textAlign: 'left'
              }}>
            Title:
          </label>
              
              <SearchableInput
                type="Movie"
                value={title}
                onChange={setTitle}
                onSelect={handleApiItemSelect}
              />
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '20px' }}>
              <button className="close-button" onClick={() => setCurrentPopup('main')}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK POPUP */}
      {currentPopup === 'book' && (
        <div className="popup">
          <div style={{
              display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '16px',
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{
                fontSize: 'clamp(40px, 9vw, 52px)',
                fontFamily: 'Kare, sans-serif',
                color: '#ed712f',
                margin: '0',
                lineHeight: '1.1'
              }}>
                Book
              </h3>
            </div>
            
            {/* Form Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '15px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'Kare, sans-serif',
                color: '#434c96',
                fontSize: 'clamp(26px, 6vw, 32px)',
                marginBottom: '12px',
                textAlign: 'left'
              }}>
                Title:
              </label>
              
              <SearchableInput
                type="Book"
                value={title}
                onChange={setTitle}
                onSelect={handleApiItemSelect}
              />
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '20px' }}>
              <button className="close-button" onClick={() => setCurrentPopup('main')}>
                Back
            </button>
            </div>
          </div>
        </div>
      )}

      {/* FAVORITE SONG POPUP */}
      {currentPopup === 'favoriteSong' && (
        <div className="popup">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '16px',
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{
                fontSize: 'clamp(40px, 9vw, 52px)',
                fontFamily: 'Kare, sans-serif',
                color: '#27a470',
                margin: '0',
                lineHeight: '1.1'
              }}>
                Song
              </h3>
            </div>
            
            {/* Form Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '15px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'Kare, sans-serif',
                color: '#434c96',
                fontSize: 'clamp(26px, 6vw, 32px)',
                marginBottom: '12px',
                textAlign: 'left'
              }}>
                Song Title:
              </label>
              
              <SearchableInput
                type="Favorite Song"
                value={title}
                onChange={setTitle}
                onSelect={handleApiItemSelect}
              />
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '20px' }}>
              <button className="close-button" onClick={() => setCurrentPopup('main')}>
            Back
          </button>
            </div>
          </div>
        </div>
      )}

      {/* CONCERT POPUP */}
      {currentPopup === 'concert' && (
        <div className="popup">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '16px',
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{
                fontSize: 'clamp(36px, 8vw, 46px)',
                fontFamily: 'Kare, sans-serif',
                color: '#8f337e',
                margin: '0',
                lineHeight: '1.1'
              }}>
                Concert
              </h3>
            </div>
            
            {/* Form Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '12px', gap: '14px' }}>
              {/* Artist Section */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Kare, sans-serif',
                  color: '#434c96',
                  fontSize: 'clamp(22px, 5.5vw, 28px)',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  Artist Name:
                </label>
                
                <SearchableInput
                  type="Concert"
                  value={title}
                  onChange={setTitle}
                  onSelect={handleArtistSelect}
                  compact={false}
                />
              </div>

              {/* Venue Section */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Kare, sans-serif',
                  color: '#434c96',
                  fontSize: 'clamp(22px, 5.5vw, 28px)',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  Venue:
                </label>
                
                <input
                  type="text"
                  placeholder="Enter venue name"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  style={{
                    padding: 'clamp(14px, 3.5vw, 18px)',
                    borderRadius: '12px',
                    border: '1px solid #ccc',
                    fontSize: 'clamp(18px, 4.5vw, 22px)',
                    backgroundColor: '#ece7dd',
                    color: '#434c96',
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '52px'
                  }}
                />
              </div>

              {/* Date Section */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Kare, sans-serif',
                  color: '#434c96',
                  fontSize: 'clamp(22px, 5.5vw, 28px)',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  Date:
                </label>
                
                <input
                  type="text"
                  placeholder="Enter date (dd/mm/yyyy)"
                  value={concertDate}
                  onChange={handleDateChange}
                  maxLength="10"
                  style={{
                    padding: 'clamp(14px, 3.5vw, 18px)',
                    borderRadius: '12px',
                    border: '1px solid #ccc',
                    fontSize: 'clamp(18px, 4.5vw, 22px)',
                    backgroundColor: '#ece7dd',
                    color: '#434c96',
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '52px'
                  }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="close-button" 
                onClick={() => {
                  if (title.trim() && venue.trim() && concertDate) {
                    // Create concert item manually
                    const concertItem = {
                      id: `concert_custom_${Date.now()}`,
                      title: title.trim(),
                      type: 'Concert',
                      year: null,
                      poster: null,
                      rating: null,
                      overview: null,
                      artist: title.trim(),
                      venue: venue.trim(),
                      date: concertDate
                    };
                    setItems([...items, concertItem]);
                    setTitle('');
                    setVenue('');
                    setConcertDate('');
                    setCurrentPopup(null);
                  }
                }}
                disabled={!title.trim() || !venue.trim() || !concertDate}
                style={{
                  backgroundColor: title.trim() && venue.trim() && concertDate ? '#8f337e' : '#ccc',
                  cursor: title.trim() && venue.trim() && concertDate ? 'pointer' : 'not-allowed'
                }}
              >
                Save Concert
              </button>
              <button 
                className="close-button" 
                onClick={() => setCurrentPopup('main')}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
