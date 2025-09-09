import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext()

  useEffect(() => {
    // ניקוי נתוני משתמש מה-localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('cart'); // אם את רוצה גם לנקות את העגלה
     setUser(null)
    // הפניה לעמוד הכניסה
    navigate('/login');
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>מתנתקת...</h2>
    </div>
  );
};

export default Logout;
