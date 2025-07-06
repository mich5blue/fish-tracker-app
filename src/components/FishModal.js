import React, { useState } from 'react';

const FishModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fishType: '',
    size: '',
    lure: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  const fishTypes = [
    'Largemouth Bass',
    'Smallmouth Bass',
    'Rock Bass',
    'Pike'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fishType) {
      newErrors.fishType = 'Please select a fish type';
    }
    
    if (!formData.size) {
      newErrors.size = 'Please enter the size';
    } else if (isNaN(formData.size) || parseFloat(formData.size) <= 0) {
      newErrors.size = 'Please enter a valid size greater than 0';
    }
    
    if (!formData.lure.trim()) {
      newErrors.lure = 'Please enter the lure used';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter the location';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const fishData = {
        ...formData,
        size: parseFloat(formData.size),
        timestamp: new Date().toISOString()
      };
      onSave(fishData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2>🎣 Add New Fish</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fishType">Fish Type *</label>
            <select
              id="fishType"
              name="fishType"
              value={formData.fishType}
              onChange={handleInputChange}
              className={errors.fishType ? 'error' : ''}
            >
              <option value="">Select fish type...</option>
              {fishTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.fishType && <span className="error-message">{errors.fishType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="size">Size (inches) *</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="Enter size in inches..."
              step="0.1"
              min="0"
              className={errors.size ? 'error' : ''}
            />
            {errors.size && <span className="error-message">{errors.size}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lure">Lure Used *</label>
            <input
              type="text"
              id="lure"
              name="lure"
              value={formData.lure}
              onChange={handleInputChange}
              placeholder="Enter lure used..."
              className={errors.lure ? 'error' : ''}
            />
            {errors.lure && <span className="error-message">{errors.lure}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter fishing location..."
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Fish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FishModal;
