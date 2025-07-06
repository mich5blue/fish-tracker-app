import React, { useState } from 'react';

const FishTable = ({ fish }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'size',
    direction: 'desc'
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFish = [...fish].sort((a, b) => {
    if (sortConfig.key === 'size') {
      return sortConfig.direction === 'asc' ? a.size - b.size : b.size - a.size;
    }
    
    if (sortConfig.key === 'timestamp') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    }
    
    const aValue = a[sortConfig.key].toString().toLowerCase();
    const bValue = b[sortConfig.key].toString().toLowerCase();
    
    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (fish.length === 0) {
    return (
      <div className="empty-state">
        <h3>No fish caught yet!</h3>
        <p>Click "Add New Fish" to record your first catch.</p>
        <div style={{ fontSize: '4em', margin: '20px 0' }}>🎣</div>
      </div>
    );
  }

  return (
    <div className="fish-table">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('fishType')}>
              Fish Type {getSortIcon('fishType')}
            </th>
            <th onClick={() => handleSort('size')}>
              Size (inches) {getSortIcon('size')}
            </th>
            <th onClick={() => handleSort('lure')}>
              Lure Used {getSortIcon('lure')}
            </th>
            <th onClick={() => handleSort('location')}>
              Location {getSortIcon('location')}
            </th>
            <th onClick={() => handleSort('timestamp')}>
              Date & Time {getSortIcon('timestamp')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedFish.map((fishItem) => (
            <tr key={fishItem.id}>
              <td>
                <span className="fish-type">{fishItem.fishType}</span>
              </td>
              <td>
                <strong>{fishItem.size}"</strong>
              </td>
              <td>{fishItem.lure}</td>
              <td>{fishItem.location}</td>
              <td>{formatDate(fishItem.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="table-summary">
        <p>
          <strong>Total catches: {fish.length}</strong>
          {fish.length > 0 && (
            <>
              {' | '}
              <strong>Biggest fish: {Math.max(...fish.map(f => f.size))}"</strong>
              {' | '}
              <strong>Average size: {(fish.reduce((sum, f) => sum + f.size, 0) / fish.length).toFixed(1)}"</strong>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default FishTable;
