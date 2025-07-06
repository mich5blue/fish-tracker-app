import React, { useState, useEffect } from 'react';
import FishModal from './components/FishModal';
import FishTable from './components/FishTable';
import './App.css';

const App = () => {
  const [fish, setFish] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    fishType: '',
    location: '',
    lure: '',
    minSize: '',
    maxSize: ''
  });

  // Load fish data from localStorage on component mount
  useEffect(() => {
    const savedFish = localStorage.getItem('fishData');
    if (savedFish) {
      setFish(JSON.parse(savedFish));
    }
  }, []);

  // Save fish data to localStorage whenever fish state changes
  useEffect(() => {
    localStorage.setItem('fishData', JSON.stringify(fish));
  }, [fish]);

  const addFish = (newFish) => {
    const fishWithId = {
      ...newFish,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setFish(prevFish => [...prevFish, fishWithId]);
    setShowModal(false);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const filteredFish = fish.filter(fishItem => {
    const matchesType = !filters.fishType || fishItem.fishType === filters.fishType;
    const matchesLocation = !filters.location || fishItem.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesLure = !filters.lure || fishItem.lure.toLowerCase().includes(filters.lure.toLowerCase());
    const matchesMinSize = !filters.minSize || fishItem.size >= parseFloat(filters.minSize);
    const matchesMaxSize = !filters.maxSize || fishItem.size <= parseFloat(filters.maxSize);
    
    return matchesType && matchesLocation && matchesLure && matchesMinSize && matchesMaxSize;
  });

  // Sort by size (largest first) by default
  const sortedFish = [...filteredFish].sort((a, b) => b.size - a.size);

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>🎣 Fish Tracker</h1>
          <p>Keep track of your fishing catches</p>
        </div>
      </header>

      <div className="container">
        <button 
          className="add-fish-btn"
          onClick={() => setShowModal(true)}
        >
          ➕ Add New Fish
        </button>

        <div className="filter-section">
          <h3>Filter Your Catches</h3>
          <div className="filter-inputs">
            <div className="filter-input">
              <label>Fish Type:</label>
              <select 
                value={filters.fishType} 
                onChange={(e) => handleFilterChange('fishType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Largemouth Bass">Largemouth Bass</option>
                <option value="Smallmouth Bass">Smallmouth Bass</option>
                <option value="Rock Bass">Rock Bass</option>
                <option value="Pike">Pike</option>
              </select>
            </div>
            
            <div className="filter-input">
              <label>Location:</label>
              <input
                type="text"
                placeholder="Filter by location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            
            <div className="filter-input">
              <label>Lure:</label>
              <input
                type="text"
                placeholder="Filter by lure..."
                value={filters.lure}
                onChange={(e) => handleFilterChange('lure', e.target.value)}
              />
            </div>
            
            <div className="filter-input">
              <label>Min Size (inches):</label>
              <input
                type="number"
                placeholder="Min size..."
                value={filters.minSize}
                onChange={(e) => handleFilterChange('minSize', e.target.value)}
              />
            </div>
            
            <div className="filter-input">
              <label>Max Size (inches):</label>
              <input
                type="number"
                placeholder="Max size..."
                value={filters.maxSize}
                onChange={(e) => handleFilterChange('maxSize', e.target.value)}
              />
            </div>
          </div>
        </div>

        <FishTable fish={sortedFish} />

        {showModal && (
          <FishModal
            onClose={() => setShowModal(false)}
            onSave={addFish}
          />
        )}
      </div>
    </div>
  );
};

export default App;
