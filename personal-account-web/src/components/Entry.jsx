import React, { useState, useEffect } from 'react';
import { FaCamera, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Entry.css';

export default function Entry({ 
  entry 
}) {

  const navigate = useNavigate()

  return (
<div className="entry-container">
      <div className="control-buttons">
        <FaEdit
          size={10}
          className="control-button"
          color="green"
          onClick={() => {
            // markDateEdit();
            // navigation.navigate('UpdateEntry', { entry });
          }}
        />
        <FaTrash
          size={10}
          className="control-button"
          color="red"
          // onClick={confirmAndDelete}
        />
      </div>

      <p className="category-text">{entry.cTitle}</p>

      <div className="entry-main">
        <p className="entry-text">{entry.title}</p>
        <p className="amount-text">$ {entry.amount}</p>
      </div>

      <div className="entry-bottom">
        {entry.description && <p className="desc-text">{entry.description}</p>}
        <p className="username-text">{entry.username}</p>
      </div>
    </div>
  );
}