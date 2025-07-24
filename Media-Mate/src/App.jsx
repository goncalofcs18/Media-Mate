import React, { useState } from 'react';
import './App.css';
import SearchableInput from './components/SearchableInput';

function App() {
  const [currentPopup, setCurrentPopup] = useState(null); // Track which popup is open
  const [title, setTitle] = useState(''); // Store the current input value
  const [items, setItems] = useState([]); // Store the list of all items (TV Shows, Movies, etc.)

  const handleConfirm = (type) => {
    if (title.trim() !== '') {
      // Add new item with title and type
      setItems([...items, { title, type, id: Date.now() }]);
      setTitle(''); // Clear input
      setCurrentPopup(null); // Close popup
    } 
  };

  const handleApiItemSelect = (selectedItem) => {
    // Add API-selected item with rich metadata
    const newItem = {
      id: `${selectedItem.type}_${selectedItem.id}_${Date.now()}`,
      title: selectedItem.title,
      type: selectedItem.type,
      year: selectedItem.year,
      poster: selectedItem.poster,
      rating: selectedItem.rating,
      overview: selectedItem.overview,
      tmdbId: selectedItem.id
    };
    
    setItems([...items, newItem]);
    setTitle(''); // Clear input
    setCurrentPopup(null); // Close popup
  };

  return (
    <div className="app">
      {/* LOGO */}
      <div className="image-container">
        <img
          src="assets/logo.png"
          alt="Metallic Icon"
          className="metallic-image"
          style={{ width: '220px', height: 'auto' }}
        />
      </div>

      {/* CONTAINER TO DISPLAY ITEMS */}
      <div
        style={{
          marginTop: '10px',
          width: '82%',
          maxHeight: '430px',
          overflowY: 'auto', // Make it scrollable when there are many items
          backgroundColor: '#ece7dd',
          border: '1px solid #ccc',
          borderRadius: '25px',
          padding: '14px',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, index) => (
            <li
              key={item.id || index}
              style={{
                fontSize: '17px',
                margin: '10px 0',
                backgroundColor: item.type === 'TV Show' ? '#f8c04b' : item.type === 'Movie' ? '#dd0526' : '#8f337e', // Different colors for types
                padding: '10px',
                borderRadius: '15px',
                color: item.type === 'TV Show' ? '#434c96' : '#ffffff',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {/* Show poster if available, otherwise show icon */}
              {item.poster ? (
                <img
                  src={item.poster}
                  style={{
                    width: '40px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                  alt={item.title}
                />
              ) : (
                <img
                  src={
                    item.type === 'TV Show'
                      ? '/assets/tv2.png'
                      : item.type === 'Movie'
                      ? '/assets/movie.png'
                      : '/assets/microphone.png'
                  }
                  style={{
                    objectFit: 'contain',
                    width: '20px',
                    height: '20px',
                  }}
                  alt={item.type}
                />
              )}
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', lineHeight: '20px' }}>
                  {item.title}
                  {item.year && ` (${item.year})`}
                </div>
                {item.rating && (
                  <div style={{ 
                    fontSize: '14px', 
                    opacity: 0.8,
                    marginTop: '2px'
                  }}>
                    ⭐ {item.rating.toFixed(1)}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

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
              fontSize: '35px',
              marginBottom: '5px',
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
              Favorite Song
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
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
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
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '25px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'Kare, sans-serif',
                color: '#434c96',
                fontSize: 'clamp(26px, 6vw, 32px)',
                marginBottom: '8px',
                textAlign: 'left'
              }}>
                Title:
              </label>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
                zIndex: 1
              }}>
                <SearchableInput
                  type="TV Show"
                  value={title}
                  onChange={setTitle}
                  onSelect={handleApiItemSelect}
                />
                <button
                  style={{
                    padding: '16px 28px',
                    backgroundColor: '#434c96',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: '500',
                  }}
                  onClick={() => handleConfirm('TV Show')}
                >
                  Add Manually
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '15px' }}>
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
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
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
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '25px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'Kare, sans-serif',
                color: '#434c96',
                fontSize: 'clamp(26px, 6vw, 32px)',
                marginBottom: '8px',
                textAlign: 'left'
              }}>
                Title:
              </label>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
                zIndex: 1
              }}>
                <SearchableInput
                  type="Movie"
                  value={title}
                  onChange={setTitle}
                  onSelect={handleApiItemSelect}
                />
                <button
                  style={{
                    padding: '16px 28px',
                    backgroundColor: '#434c96',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: '500',
                  }}
                  onClick={() => handleConfirm('Movie')}
                >
                  Add Manually
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '15px' }}>
              <button className="close-button" onClick={() => setCurrentPopup('main')}>
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
