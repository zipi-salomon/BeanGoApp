import { fetchServer } from "../service/server.js";
import { useNavigate, Link } from 'react-router-dom';
import { use, useContext, useState } from 'react';
import { useUserContext } from "../context/UserContext.jsx";
import "../styles/Form.css";

const Login = () => {
    const navigate = useNavigate();
    const {setUser}=useUserContext();
    const [error, setError] = useState('');
    const submitLogin = async(e) => {
        e.preventDefault()        
        setError('')
        try {
            const response = await fetchServer(`/users/login`, {
                username: e.target.username.value, 
                password: e.target.password.value
            }, 'POST');
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                alert('התחברת בהצלחה!');
                navigate('/menu');
            } else {
                const errorText = await response.text();
                setError(errorText || 'שם משתמש או סיסמה לא נכונים');
            }
        } catch (error) {
            setError('שם משתמש או סיסמה לא נכונים');
        }
    }
    return (
        <div className="form-container">
            {error && <div className="error-message">{error}</div>}
            <h2 className="form-title">התחברות</h2>
            <form className="form" onSubmit={submitLogin}>
                <label htmlFor="username">שם משתמש</label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="password">סיסמא</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Login</button>
            </form>
            <div className="signup-link">
                <Link to="/signup">לא נרשמת אלינו? הרשם כאן</Link>
            </div>
          </div>
    )
}

export default Login;
