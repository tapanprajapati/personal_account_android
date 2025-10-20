import React, { useState } from 'react';
import './CategoryTransferModal.css';

export default function CategoryTransferModal({ 
  sourceCategory, 
  categories, 
  submitData, 
  closeModal 
}) {
  const [targetCategoryId, setTargetCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter out the source category from the list
  const availableCategories = categories.filter(cat => cat.id !== sourceCategory.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!targetCategoryId) {
      alert('Please select a target category');
      return;
    }

    if (targetCategoryId === sourceCategory.id) {
      alert('Cannot transfer to the same category');
      return;
    }

    setIsLoading(true);
    
    try {
      await submitData(sourceCategory.id, targetCategoryId);
    } catch (error) {
      console.error('Error transferring category:', error);
      alert('Error transferring category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTargetCategoryId('');
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="category-transfer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Transfer Category Data</h3>
          <button className="close-btn" onClick={closeModal}>×</button>
        </div>

        <div className="transfer-info">
          <p><strong>Source Category:</strong> {sourceCategory.title}</p>
          <p><strong>Type:</strong> {sourceCategory.type}</p>
        </div>

        <form className="transfer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="target-category">Select Target Category*</label>
            <select
              id="target-category"
              value={targetCategoryId}
              onChange={(e) => setTargetCategoryId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Choose a category...</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title} ({category.type})
                </option>
              ))}
            </select>
          </div>

          <div className="warning-message">
            <p>⚠️ <strong>Warning:</strong> This action will move all entries from "{sourceCategory.title}" to the selected category and then delete the source category. This action cannot be undone.</p>
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
              className="btn btn-warning"
              disabled={isLoading || !targetCategoryId}
            >
              {isLoading ? 'Transferring...' : 'Transfer & Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
