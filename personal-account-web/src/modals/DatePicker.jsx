import React, { useState, useEffect } from 'react';
import './DatePicker.css';

export default function DatePicker({ date, onDateChange, onClose }) {
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleSave = () => {
    onDateChange(selectedDate);
  };

  const handleCancel = () => {
    setSelectedDate(date);
    onClose();
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="date-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Date</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="date-picker-content">
          <div className="date-input-group">
            <label htmlFor="date-input">Date</label>
            <input
              type="date"
              id="date-input"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={handleDateChange}
              className="date-input"
            />
          </div>

          <div className="quick-actions">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleToday}
            >
              Today
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
