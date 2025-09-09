import React, { useState, useEffect } from 'react';
import { fetchServer } from '../service/server';
import '../styles/Modal.css';
import '../styles/Form.css';

const AddShopModal = ({ isOpen, onClose, onShopAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });
  const [logoFile, setLogoFile] = useState(null);

  // איפוס שדות בכל פתיחה של המודל
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', address: '' });
      setLogoFile(null);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      alert('אנא בחרי לוגו לחנות.');
      return;
    }

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('address', formData.address);
    submissionData.append('Logo_source', logoFile);

    try {
      const response = await fetchServer('/shops', submissionData, 'POST', true);
      if (response.ok) {
        alert('החנות נוספה בהצלחה!');
        onShopAdded();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`שגיאה בהוספת החנות: ${errorData.message || 'נסה שוב'}`);
      }
    } catch (error) {
      console.error('שגיאה בשליחת הטופס:', error);
      alert('שגיאה בשליחת הטופס.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="form-title">הוספת חנות חדשה</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="name">שם החנות:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />

          <label htmlFor="address">כתובת:</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required />

          <label htmlFor="Logo_source">לוגו:</label>
          <input type="file" id="Logo_source" name="Logo_source" onChange={handleFileChange} accept="image/*" required />

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">ביטול</button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">שמור חנות</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShopModal;
