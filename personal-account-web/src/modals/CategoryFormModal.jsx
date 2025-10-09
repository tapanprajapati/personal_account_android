import React, { useState } from 'react';
import './CategoryFormModal.css';

export default function CategoryFormModal({ 
  title, 
  checkCategory, 
  submitData, 
  closeModal, 
  buttonTitle = "Add" 
}) {
  const [categoryName, setCategoryName] = useState('');
  const [allowance, setAllowance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    setIsLoading(true);
    
    try {
      const exists = await checkCategory(categoryName.trim());
      if (exists) {
        alert('Category already exists');
        setIsLoading(false);
        return;
      }

      await submitData(categoryName.trim(), parseFloat(allowance) || 0);
      setCategoryName('');
      setAllowance('');
      closeModal();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCategoryName('');
    setAllowance('');
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="category-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={closeModal}>×</button>
        </div>

        <form className="category-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category-name">Category Name*</label>
            <input
              type="text"
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="allowance">Allowance (Optional)</label>
            <input
              type="number"
              id="allowance"
              value={allowance}
              onChange={(e) => setAllowance(e.target.value)}
              placeholder="Enter allowance amount"
              className="form-input"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : buttonTitle}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
