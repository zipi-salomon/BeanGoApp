import React, { useState, useEffect } from 'react';
import { fetchServer } from '../../service/server';
import '../../styles/Form.css';
import '../../styles/AddUpdateUser.css';
const AddUpdateUser = ({ userToUpdate, onClose,setRefresh, refresh }) => {
  const isEdit = !!userToUpdate;
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    tz: '',
    role: '',
    is_active: '',
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        id: userToUpdate.id || '',
        username: userToUpdate.username || '',
        email: userToUpdate.email || '',
        password: userToUpdate.password || '', 
        tz: userToUpdate.tz || '',
        role: userToUpdate.role || '',
        is_active: userToUpdate.is_active || '',
      });
    }
  }, [userToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const verifyCheck = () => {
    if(formData.password.length<6)
    {
        setMessage('הסיסמה חייבת להכיל לפחות 6 תווים');
        return false;
    }
    //checl mail
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mailRegex.test(formData.email)) {
        setMessage('כתובת אימייל לא תקינה');
        return false;
    }
    if(formData.username.length<3)
    {
        setMessage('השם חייב להכיל לפחות 3 תווים');
        return false;
    }
    return true;
  }

  const AddAdmin = async () => {
    const adminData = {
        ...formData,
        role: 'admin'
    };
    
    try {
        const response = await fetchServer('/users', adminData, 'POST', false);
        if (!response.ok) {
            throw new Error('Failed to add user');
        }
        const data = await response.json();
        onClose();
        setRefresh(!refresh);
    } catch (err) {
        console.error('Error adding user:', err);
        setMessage('Failed to add user. Please try again.');
    }
  }
  const UpdateUser = async () => {
    try {
        const response = await fetchServer('/users', formData, 'PATCH', false);
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        const data = await response.json();
        onClose();
        
        setRefresh(!refresh);
    } catch (err) {
        console.error('Error updating user:', err);
        setMessage('Failed to update user. Please try again.');
    }
}
const handleSubmit = (e) => {
    e.preventDefault();
    if(verifyCheck())
    {
        if(isEdit)
        {
            UpdateUser();
        }
        else
        {
            AddAdmin();
        }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="form-container">
          <h2 className="form-title">{isEdit ? 'עדכון משתמש' : 'הוספת משתמש'}</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>שם משתמש:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>ת.ז.:</label>
              <input
                name="tz"
                value={formData.tz}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>אימייל:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            {!isEdit && (
              <div className="form-group">
            {!isEdit && <label>סיסמה:</label>}
                {!isEdit &&<input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />}
              </div>
            )}
            <div className="form-group">
              <div className="form-buttons">
                <button type="submit" className="primary-btn">
                  {isEdit ? 'עדכן' : 'הוסף'}
                </button>
                <button type="button" onClick={onClose} className="cancel-btn">
                  ביטול
                </button>
              </div>
            </div>
            {message && <p className="error-message">{message}</p>}
          </form>
        </div>
      </div>
    </div>
   
  );
};

export default AddUpdateUser;