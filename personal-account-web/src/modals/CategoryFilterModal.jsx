import React, { useState, useEffect } from 'react';
import './CategoryFilterModal.css';

export default function CategoryFilterModal({ 
  categories, 
  users, 
  selectedUser, 
  saveChanges, 
  close 
}) {
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localSelectedUser, setLocalSelectedUser] = useState(selectedUser || "ALL");

  useEffect(() => {
    setLocalCategories(categories || []);
    setLocalSelectedUser(selectedUser || "ALL");
  }, [categories, selectedUser]);

  const handleCategoryToggle = (index) => {
    const updatedCategories = [...localCategories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      status: !updatedCategories[index].status
    };
    setLocalCategories(updatedCategories);
  };

  const handleSelectAll = () => {
    const updatedCategories = localCategories.map(category => ({
      ...category,
      status: true
    }));
    setLocalCategories(updatedCategories);
  };

  const handleDeselectAll = () => {
    const updatedCategories = localCategories.map(category => ({
      ...category,
      status: false
    }));
    setLocalCategories(updatedCategories);
  };

  const handleUserChange = (e) => {
    setLocalSelectedUser(e.target.value);
  };

  const handleSave = () => {
    saveChanges(localCategories, localSelectedUser);
    close();
  };

  const handleCancel = () => {
    setLocalCategories(categories || []);
    setLocalSelectedUser(selectedUser || "ALL");
    close();
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="category-filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Filter Categories</h3>
          <button className="close-btn" onClick={close}>×</button>
        </div>

        <div className="modal">
          <div className="user-filter-section">
            <label htmlFor="user-select">Filter by User:</label>
            <select 
              id="user-select"
              value={localSelectedUser} 
              onChange={handleUserChange}
              className="user-select"
            >
              {users && users.map((user, index) => (
                <option key={index} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div className="categories-section">
            <div className="categories-header">
              <h4>Categories</h4>
              <div className="category-controls">
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={handleDeselectAll}
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="categories-list">
              {localCategories.map((category, index) => (
                <div key={index} className="category-item">
                  <label className="category-label">
                    <input
                      type="checkbox"
                      checked={category.status}
                      onChange={() => handleCategoryToggle(index)}
                      className="category-checkbox"
                    />
                    <span className="category-name">
                      {category.category.title || category.category.name || 'Unknown Category'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
