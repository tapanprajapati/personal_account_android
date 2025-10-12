import React, { useState, useEffect } from 'react';
import EntryDBHandler from '../../databasehandler/entryhandler';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import UserDBHandler from '../../databasehandler/userhandler';
import CategoryFormModal from '../../modals/CategoryFormModal';
import ImageUpload from '../../modals/ImageUpload';
import './EntryForm.css';

export default function EntryForm({ handleFormData, type, entry = null }) {
  const [formData, setFormData] = useState({
    showDatePicker: false,
    showCategoryModal: false,
    showImageUpload: false,
    date: new Date(),
    selectedType: type?.toLowerCase() || 'expense',
    selectedCategoryId: 0,
    title: '',
    amount: '',
    description: '',
    categories: [],
    users: [],
    imagePath: '',
    selectedUser: '',
    imageFile: null
  });

  const [categoryHandler] = useState(new CategoryDBHandler());
  const [userHandler] = useState(new UserDBHandler());

  const buttonText = entry ? 'UPDATE' : 'ADD';

  useEffect(() => {
    if (entry) {
      setFormData(prev => ({
        ...prev,
        date: new Date(entry.fulldate),
        selectedType: entry.cType,
        selectedCategoryId: entry.cId,
        title: entry.title,
        amount: entry.amount.toString(),
        description: entry.description,
        selectedUser: entry.username
      }));
    }
    getCategories(formData.selectedType);
    getUsers();
  }, []);

  const getCategories = async (type) => {
    try {
      const result = await categoryHandler.getCategories(type);
      if (result.success) {
        const categories = result.message;
        setFormData(prev => ({
          ...prev,
          categories: categories,
          selectedCategoryId: prev.selectedType !== type ? categories[0]?.id || 0 : prev.selectedCategoryId,
          selectedType: type
        }));
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getUsers = async () => {
    try {
      const result = await userHandler.getAllUsers();
      if (result.success) {
        const users = result.message;
        setFormData(prev => ({
          ...prev,
          users: users,
          selectedUser: prev.selectedUser || users[0]?.username || ''
        }));
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (type) => {
    getCategories(type);
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: (new Date(date.target.value))
    }));
  };

  const checkCategory = async (category) => {
    // This would need to be implemented in the category handler
    return true;
  };

  const addCategory = async (category, allowance) => {
    try {
      const result = await categoryHandler.addCategory({
        title: category,
        type: formData.selectedType,
        allowance: allowance
      });
      if (result.success) {
        getCategories(formData.selectedType);
        alert(result.message);
      } else {
        alert('Error Adding Category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const validateAmount = (amount) => {
    if (!isNaN(amount)) {
      setFormData(prev => ({
        ...prev,
        amount: amount
      }));
    }
  };

  const submitForm = () => {
    const { title, description, amount, date, selectedCategoryId, selectedUser } = formData;
    
    let error = false;
    let errorMessage = 'Correct Following';

    if (title === '') {
      error = true;
      errorMessage += '\nEnter Valid Title';
    }

    if (amount === '') {
      error = true;
      errorMessage += '\nEnter Valid Amount';
    }

    if (selectedCategoryId === 0) {
      error = true;
      errorMessage += '\nEnter Valid Category';
    }

    if (error) {
      alert('ERROR: ' + errorMessage);
    } else {
      const newEntry = {
        title: title,
        description: description,
        amount: amount,
        date: date.toISOString().slice(0, 10),
        category: { id: selectedCategoryId.toString() },
        username: selectedUser
      };

      if (newEntry) {
        newEntry.id = entry.id;
      }

      console.log(newEntry);
      handleFormData(newEntry);
      resetInputs();
    }
  };

  const resetInputs = () => {
    setFormData(prev => ({
      ...prev,
      title: '',
      amount: '',
      description: '',
      imagePath: '',
      imageFile: null
    }));
  };

  return (
    <div className="entry-form-container">
      <div className="form-section">
        <div className="input-group">
          <label className="input-label">Title*</label>
          <input
            type="text"
            value={formData.title}
            className="form-input"
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter title"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            value={formData.description}
            className="form-textarea"
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter description"
            rows={3}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Amount*</label>
          <input
            type="number"
            value={formData.amount}
            className="form-input"
            onChange={(e) => validateAmount(e.target.value)}
            placeholder="Enter amount"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.date.toISOString().slice(0, 10)}
            // readOnly
            onChange={handleDateChange}
            placeholder="Select date"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Type</label>
          <select
            className="form-select"
            value={formData.selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Category</label>
          <div className="category-input-container">
            <select
              className="form-select category-select"
              value={formData.selectedCategoryId}
              onChange={(e) => handleInputChange('selectedCategoryId', parseInt(e.target.value))}
            >
              <option value={0}>Select Category</option>
              {formData.categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <button
              className="add-category-btn"
              onClick={() => handleInputChange('showCategoryModal', true)}
              title="Add New Category"
            >
              +
            </button>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">User</label>
          <select
            className="form-select"
            value={formData.selectedUser}
            onChange={(e) => handleInputChange('selectedUser', e.target.value)}
          >
            {formData.users.map((item) => (
              <option key={item.username} value={item.username}>
                {item.username}
              </option>
            ))}
          </select>
        </div>

        <div className="submit-section">
          <button
            className="submit-btn"
            onClick={submitForm}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {formData.showCategoryModal && (
        <CategoryFormModal
          title={`Add New ${formData.selectedType.toUpperCase()} Category`}
          checkCategory={checkCategory}
          submitData={addCategory}
          closeModal={() => handleInputChange('showCategoryModal', false)}
          buttonTitle="Add"
        />
      )}
    </div>
  );
}
