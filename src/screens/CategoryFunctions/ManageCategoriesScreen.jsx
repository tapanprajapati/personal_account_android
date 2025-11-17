import React, { useState, useEffect } from 'react';
import { Container } from '../../styles/global';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import CategoryComponent from '../../components/CategoryComponent';
import CategoryFormModal from '../../modals/CategoryFormModal';
import CategoryTransferModal from '../../modals/CategoryTransferModal';
import { ButtonColors } from '../../styles/colors';
import './ManageCategoriesScreen.css';

export default function ManageCategoriesScreen() {
  const [selected, setSelected] = useState('expense');
  const [categories, setCategories] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryHandler = new CategoryDBHandler();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async (type = selected) => {
    setLoading(true);
    setError(null);
    try {
      const result = await categoryHandler.getCategories(type);
      if (result.success) {
        setCategories(result.message || []);
      } else {
        setError(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType) => {
    setSelected(newType);
    getCategories(newType);
  };

  const handleAddCategory = async (title, allowance) => {
    try {
      const result = await categoryHandler.addCategory({
        title,
        type: selected,
        allowance: allowance || 0
      });
      
      if (result.success) {
        setShowAddModal(false);
        getCategories(); // Refresh the list
        alert('Category added successfully');
      } else {
        alert('Error adding category: ' + result.message);
      }
    } catch (error) {
      alert('Error adding category: ' + error.message);
    }
  };

  const handleUpdateCategory = async (title, allowance) => {
    try {
      const result = await categoryHandler.updateCategory(
        title,
        allowance || 0,
        selectedCategory.id,
        selectedCategory.type
      );
      
      if (result.success) {
        setShowUpdateModal(false);
        setSelectedCategory(null);
        getCategories(); // Refresh the list
        alert('Category updated successfully');
      } else {
        alert('Error updating category: ' + result.message);
      }
    } catch (error) {
      alert('Error updating category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Do you want to delete category: ${category.title}?\n\nNOTE: All the entries of this category will be deleted. Please transfer entries to another category before deleting.`
    );
    
    if (confirmed) {
      try {
        const result = await categoryHandler.deleteCategory(category.id);
        
        if (result.success) {
          getCategories(); // Refresh the list
          alert('Category deleted successfully');
        } else {
          alert('Error deleting category: ' + result.message);
        }
      } catch (error) {
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowUpdateModal(true);
  };

  const handleTransferCategory = (category) => {
    setSelectedCategory(category);
    setShowTransferModal(true);
  };

  const handleTransfer = async (sourceId, targetId) => {
    try {
      const result = await categoryHandler.transferCategory(sourceId, targetId);
      
      if (result.success) {
        setShowTransferModal(false);
        setSelectedCategory(null);
        getCategories(); // Refresh the list
        alert('Category data transferred successfully');
      } else {
        alert('Error transferring category: ' + result.message);
      }
    } catch (error) {
      alert('Error transferring category: ' + error.message);
    }
  };

  const checkCategoryExists = async (title) => {
    return categories.some(cat => 
      cat.title.toLowerCase() === title.toLowerCase() && 
      cat.type === selected
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="manage-categories-screen">
          <h2>Manage Categories</h2>
          <div className="loading-content">
            <p>Loading categories...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="manage-categories-screen">
        <h2>Manage Categories</h2>
        
        <div className="input-holder">
          <label className="input-text">Select Category Type</label>
          <div className="horizontal-container">
            <select
              className="input-element dropdown"
              value={selected}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button
              className="add-button"
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: ButtonColors.homeButton.floating }}
            >
              +
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => getCategories()} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        <div className="category-list">
          {categories.length === 0 ? (
            <div className="no-categories">
              <p>No {selected} categories found</p>
            </div>
          ) : (
            categories.map((category) => (
              <CategoryComponent
                key={category.id}
                data={category}
                handleDelete={handleDeleteCategory}
                handleEdit={handleEditCategory}
                handleTransfer={handleTransferCategory}
              />
            ))
          )}
        </div>

        {/* Add Category Modal */}
        {showAddModal && (
          <CategoryFormModal
            title="Add New Category"
            checkCategory={checkCategoryExists}
            submitData={handleAddCategory}
            closeModal={() => setShowAddModal(false)}
            buttonTitle="Add"
          />
        )}

        {/* Update Category Modal */}
        {showUpdateModal && selectedCategory && (
          <CategoryFormModal
            title="Update Category"
            checkCategory={checkCategoryExists}
            submitData={handleUpdateCategory}
            closeModal={() => {
              setShowUpdateModal(false);
              setSelectedCategory(null);
            }}
            buttonTitle="Update"
            initialData={selectedCategory}
          />
        )}

        {/* Transfer Category Modal */}
        {showTransferModal && selectedCategory && (
          <CategoryTransferModal
            sourceCategory={selectedCategory}
            categories={categories}
            submitData={handleTransfer}
            closeModal={() => {
              setShowTransferModal(false);
              setSelectedCategory(null);
            }}
          />
        )}
      </div>
    </Container>
  );
}
