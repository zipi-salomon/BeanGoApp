import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { useContext } from 'react';
import { useUserContext } from '../context/UserContext';

const Header = () => {
  const location = useLocation();

  const { user } = useUserContext();
  // אם נמצאים בעמוד login או signup — אל תציג את ה-Header
  // if (location.pathname === '/login' || location.pathname === '/signup') {
  // if (!user) {
  //   return null;
  // }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="header">
      {user?.username}
      <div className="header-links">
        <Link to="/about" className={`header-link ${isActive('/about') ? 'active' : ''}`}>אודות</Link>
        <Link to="/contact" className={`header-link ${isActive('/contact') ? 'active' : ''}`}>צור קשר</Link>
        {user ? <>

          <Link to="/shops" className={`header-link ${isActive('/shops') ? 'active' : ''}`}>חנויות</Link>
          {user&&<Link to="/menu" className={`header-link ${isActive('/menu') ? 'active' : ''}`}>תפריט</Link>}
          {user &&<Link to="/logout" className={`header-link ${isActive('/logout') ? 'active' : ''}`}>התנתק</Link>}
          {user &&<Link to="/profile" className={`header-link ${isActive('/profile') ? 'active' : ''}`}>פרופיל</Link>}
          {user?.role === 'admin' && <Link to="/adminUser" className={`header-link ${isActive('/adminUser') ? 'active' : ''}`}>ניהול משתמשים</Link>}
           {user?.role === 'customer' && <Link to="/cart" className={`header-link ${isActive('/cart') ? 'active' : ''}`}>הסל שלי</Link>}
           {user?.role === 'admin' && <Link to="/orders" className={`header-link ${isActive('/orders') ? 'active' : ''}`}>ניהול הזמנות</Link>}
        </>:<>
        <Link to="/signup" className={`header-link ${isActive('/signup') ? 'active' : ''}`}>הרשמה</Link>
        <Link to="/login" className={`header-link ${isActive('/login') ? 'active' : ''}`}>כניסה</Link>
        </>}
      </div>
    </div>
  );
};

export default Header;
