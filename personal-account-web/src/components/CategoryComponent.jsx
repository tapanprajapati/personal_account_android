import React from 'react';
import { FaEdit, FaTrash, FaExchangeAlt } from 'react-icons/fa';
import { ButtonColors } from '../styles/colors';
import './CategoryComponent.css';

export default function CategoryComponent({ 
  data, 
  handleDelete, 
  handleEdit, 
  handleTransfer 
}) {
  const confirmAndDelete = () => {
    const message = `Do you want to delete category: ${data.title}?\n\nNOTE: All the entries of this category will be deleted. Please transfer entries to another category before deleting.`;
    
    if (window.confirm(message)) {
      handleDelete(data);
    }
  };

  return (
    <div className="category-container">
      <div className="category-content">
        <div className="category-title">{data.title}</div>
        <div className="category-allowance">${data.allowance || 0}</div>
      </div>
      
      <div className="control-list">
        <button
          className="control-button edit-button"
          onClick={() => handleEdit(data)}
          title="Edit Category"
        >
          <FaEdit size={15} />
        </button>
        
        <button
          className="control-button delete-button"
          onClick={confirmAndDelete}
          title="Delete Category"
        >
          <FaTrash size={15} />
        </button>
        
        <button
          className="control-button transfer-button"
          onClick={() => handleTransfer(data)}
          title="Transfer Category Data"
        >
          <FaExchangeAlt size={15} />
        </button>
      </div>
    </div>
  );
}
