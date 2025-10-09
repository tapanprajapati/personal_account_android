import React, { useState, useRef } from 'react';
import './ImageUpload.css';

export default function ImageUpload({ onImageUpload, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onImageUpload(selectedFile, URL.createObjectURL(selectedFile));
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="image-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Upload Image</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="image-upload-content">
          <div className="file-input-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="file-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="file-input-label">
              📁 Choose Image
            </label>
          </div>

          {preview && (
            <div className="image-preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
              <button 
                className="remove-preview-btn"
                onClick={handleRemove}
                title="Remove image"
              >
                ✕
              </button>
            </div>
          )}

          {selectedFile && (
            <div className="file-info">
              <p><strong>File:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
