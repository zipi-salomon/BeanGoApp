import React, { useState } from 'react';
import { useUserContext } from "../context/UserContext";
import MyOrders from './MyOrders.jsx';
import { fetchServer } from '../service/server.js';
import '../styles/Profile.css';

// פונקציה לעדכון פרטי משתמש


const Profile = () => {
  const { user, login,setUser } = useUserContext(); 
  const updateUserDetails = async (user, username, email) => {
    try {
      const response = await fetchServer(`/users`, {
        ...user,
        username,
        email
      }, 'PATCH');
      setUser({ ...user, username:username, email:email });
      setIsEditingDetails(false);
      if (!response.ok) {
        throw new Error('Failed to update user details');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  };
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // מצב עבור שדות עדכון הפרטים
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  
  const [message, setMessage] = useState(''); // הודעות למשתמש (הצלחה/כישלון)
  const [isUpdating, setIsUpdating] = useState(false); // מצב לטעינה בזמן עדכון

  // ודא ש-user קיים לפני שניגשים למאפיינים שלו
  if (!user) {
    return (
      <div className="profile-container">
        <h2>Profile</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault(); // מונע ריענון דף בטופס
    setMessage(''); // ננקה הודעות קודמות
    setIsUpdating(true); // נפעיל מצב טעינה

    // בדיקות ולידציה בסיסיות בצד הלקוח
    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirmation do not match.");
      setIsUpdating(false);
      return;
    }

    if (newPassword.length < 6) { // דוגמה: סיסמה מינימלית
      setMessage("New password must be at least 6 characters long.");
      setIsUpdating(false);
      return;
    }

    try {
      const response = await fetchServer(`/users`, {
        ...user,
        password: newPassword
      },
      'PATCH', false);
      setUser({ ...user, password: newPassword });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password: HTTP error! status: " + response.status);
      }

      const result = await response.json();
      setMessage(result.message || "Password updated successfully!");
      
      // אם השרת מחזיר טוקן חדש לאחר עדכון סיסמה (פרקטיקה מומלצת),
      // צריך לעדכן את הקונטקסט של המשתמש.
      // לדוגמה, אם ה-backend מחזיר { message: "...", newToken: "..." }
      // if (result.newToken) {
      //   login({ ...user, token: result.newToken }, result.newToken);
      // }

      // איפוס שדות הסיסמה לאחר הצלחה
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (err) {
      console.error("Password update error:", err);
      setMessage("Error updating password: " + (err.message || 'Please try again.'));
    } finally {
      setIsUpdating(false); // כבה מצב טעינה
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
                try {
                  setIsUpdating(true);
                  await updateUserDetails(user, newUsername, newEmail);
                  login({ ...user, username: newUsername, email: newEmail });
                  setIsEditingDetails(false);
                  setMessage('פרטים עודכנו בהצלחה!');
                } catch (error) {
                  setMessage('שגיאה בעדכון הפרטים');
                } finally {
                  setIsUpdating(false);
                }
            }
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>פרופיל אישי</h2>
      </div>

      <div className="content-sections">
        
        
        <div className="password-update-section">
          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="oldPassword">סיסמה נוכחית:</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                disabled={isUpdating}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">סיסמה חדשה:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isUpdating}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">אימות סיסמה חדשה:</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={isUpdating}
              />
            </div>
            <div className="form-group">
              {isUpdating ? (
                <div className="loading-spinner"></div>
              ) : (
                <button type="submit" disabled={isUpdating}>
                  עדכן סיסמה
                </button>
              )}
            </div>
            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="user-details">
          <div className="user-info">
            <h3>פרטי משתמש</h3>
            <p><strong>ת.ז.:</strong> {user.tz}</p>
            <p><strong>שם משתמש:</strong> {user.username}</p>
            <p><strong>אימייל:</strong> {user.email}</p>
            <p><strong>תפקיד:</strong> {user.role}</p>
          </div>
          <div className="user-details-section">
          <div className="user-details">
            <button 
              onClick={() => setIsEditingDetails(!isEditingDetails)}
              className="edit-details-btn"
              disabled={isUpdating}
            >
              {isEditingDetails ? 'ביטול' : 'ערוך'}
            </button>
          </div>
          
          {isEditingDetails && (
            <form 
              onSubmit={async (e) => {
                
              }}
              className="details-form"
            >
              <div className="form-group">
                <label htmlFor="newUsername">שם משתמש חדש:</label>
                <input
                  type="text"
                  id="newUsername"
                  name="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  disabled={isUpdating}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newEmail">אימייל חדש:</label>
                <input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  disabled={isUpdating}
                />
              </div>
              <button type="submit" className="update-details-btn" disabled={isUpdating}>
                עדכן
              </button>
            </form>
          )}
        </div>
        </div>
      </div>

      <div className="orders-section">
        <h2>הזמנות שלי</h2>
        <MyOrders />
      </div>
    </div>
  );
};


export default Profile;