import React, { useState, useEffect } from 'react';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import CategoryFormModal from '../../modals/CategoryFormModal';
import './RecurringModal.css';
import RecurringDBHandler from '../../databasehandler/recurringhandler';
import UserDBHandler from '../../databasehandler/userhandler';

export default function RecurringModal({ isVisible, close, handleData, recurring }) {
  const [formData, setFormData] = useState({
    showDatePicker: false,
    showCategoryModal: false,
    date: new Date(),
    selectedType: 'income',
    selectedCategoryId: 0,
    title: '',
    freq: '',
    amount: '',
    description: '',
    incomeCategories: [],
    expenseCategories: [],
    users: [],
    imagePath: '',
    selectedUser: '',
    imageFile: null
  });
  

  const [categoryHandler] = useState(new CategoryDBHandler());
  const [userHandler] = useState(new UserDBHandler());

  const buttonText = recurring ? 'Update' : 'Add';

  useEffect(() => {
    if (recurring) {
      setFormData(prev => ({
        ...prev,
        date: new Date(recurring.start_date),
        selectedType: recurring.cType,
        selectedCategoryId: recurring.cId,
        title: recurring.title,
        freq: recurring.freq,
        amount: recurring.amount.toString(),
        description: recurring.description,
        selectedUser: recurring.username
      }));
    }
  }, [recurring]);

  useEffect(()=> {
    getCategories('income');
    getCategories('expense');
    getUsers();
  },[])

  const getCategories = async (type) => {
    try {
      const result = await categoryHandler.getCategories(type);
      if (result.success) {
        const categories = result.message;
        if(type=='income'){
          setFormData(prev => ({
            ...prev,
            incomeCategories: categories
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            expenseCategories: categories
          }));
        }
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
    console.log("Handle type change");
    setFormData(prev => ({
      ...prev,
      selectedType: type
    }));
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
    const { title, description, amount, date, freq, selectedCategoryId, selectedType, selectedUser } = formData;
    
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
      const newRecurring = {
        title: title,
        description: description,
        amount: amount,
        freq: freq,
        start_date: date.toISOString().slice(0, 10),
        last_run_date: null,
        next_run_date: date.toISOString().slice(0, 10),
        cId: selectedCategoryId.toString(),
        cType: selectedType,
        username: selectedUser
      };

      if (recurring) {
        newRecurring.id = recurring.id;
      }

      console.log(newRecurring);
      handleData(newRecurring);
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
  if (!isVisible) return null;
  return (    
    <div className="recurring-modal-overlay">
      <div className="recurring-modal-container">
        <div className="recurring-modal-content">
          <div className="recurring-input-group">
            <label className="recurring-input-label">Title*</label>
            <input
              type="text"
              value={formData.title}
              className="form-recurring-input"
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="recurring-input-group">
            <label className="recurring-input-label">Description</label>
            <textarea
              value={formData.description}
              className="form-recurring-textarea"
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="recurring-input-group">
            <label className="recurring-input-label">Amount*</label>
            <input
              type="number"
              value={formData.amount}
              className="form-recurring-input"
              onChange={(e) => validateAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
            />
          </div>

          <div className="recurring-input-group">
            <label className="recurring-input-label">Start Date</label>
            <input
              type="date"
              className="form-recurring-input"
              value={formData.date.toISOString().slice(0, 10)}
              // readOnly
              onChange={handleDateChange}
              placeholder="Select date"
            />
          </div>

          <div className="recurring-input-group">
            <label className="recurring-input-label">Frequency</label>
            <select
              className="form-recurring-select"
              value={formData.freq}
              onChange={(e) => handleInputChange("freq",e.target.value)}
            >
              <option value="week">Week</option>
              <option value="bi-week">Bi-week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="recurring-input-group">
            <label className="recurring-input-label">Type</label>
            <select
              className="form-recurring-select"
              value={formData.selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="recurring-input-group">
            <label className="recurring-input-label">Category</label>
            <div className="category-recurring-input-container">
              <select
                className="form-recurring-select category-select"
                value={formData.selectedCategoryId}
                onChange={(e) => handleInputChange('selectedCategoryId', parseInt(e.target.value))}
              >
                {formData.selectedType=='income' && formData.incomeCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
                {formData.selectedType=='expense' && formData.expenseCategories.map((item) => (
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

          <div className="recurring-input-group">
            <label className="recurring-input-label">User</label>
            <select
              className="form-recurring-select"
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

          <div className="submit-recurring-section">
            <button
              className="submit-recurring-btn"
              onClick={submitForm}
            >
              {buttonText}
            </button>
            <button
              className="cancel-recurring-btn"
              onClick={close}
            >
              Cancel
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
    </div>
  );
}
