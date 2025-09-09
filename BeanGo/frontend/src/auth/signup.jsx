import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import { fetchServer } from "../service/server";
import { useUserContext } from "../context/UserContext";
import "../styles/Form.css";

const Signup = () => {
    const navigate = useNavigate();
    const {setUser}=useUserContext();
    const [error, setError] = useState('');
    const [currentValues,setcurrentValues] = useState({
        tz: '',
        username: '',
        password: '',
        verifypassword: '',
        email: ''
    })

    const validateValues = () => {

        if (currentValues.tz.length !== 9) {
            setError("תעודת זהות חייבת להכיל 9 ספרות");
            return false;
        }
        if (currentValues.username.length < 3) {
            setError("שם משתמש חייב להכיל לפחות 3 תווים");
            return false;
        }
        if (currentValues.password.length < 6) {
            setError("סיסמה חייבת להכיל לפחות 6 תווים");
            return false;
        }
        if (currentValues.password !== currentValues.verifypassword) {
            setError("הסיסמאות לא תואמות");
            return false;
        }
        if (!currentValues.email.includes('@')) {
            setError("כתובת אימייל לא תקינה");
            return false;
        }
        return true;
    }

    const submitSignup = async(e) => {
        e.preventDefault()        
        setError('')
        if (!validateValues()) return;
        try {

            const response = await fetchServer(`/users`, {
                tz: currentValues.tz, 
                username: currentValues.username, 
                password: currentValues.password,
                email: currentValues.email,
                role: 'customer',
                isActive: true
            }, 'POST');
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                alert('נרשמת בהצלחה!');
                navigate('/menu');
            }
        } catch (error) {
            setError("שדה אחד או יותר לא תקינים, אנא נסה שוב");
        }
    }
    const updateCurrentValues = (e) => {
        setcurrentValues({...currentValues,[e.target.name]: e.target.value})
    }
    
    return (
        <div className="form-container">
            <h2 className="form-title">הרשמה</h2>
            <form className="form" onSubmit={submitSignup}>
                <label htmlFor="tz">תעודת זהות:</label>
                <input type="text" id="tz" name="tz" 
                        onChange={(e) => updateCurrentValues(e)} required/>
                <label htmlFor="username">שם משתמש</label>
                <input type="text" id="username" name="username" 
                        onChange={(e) => updateCurrentValues(e)} required/>
                <label htmlFor="password">סיסמא</label>
                <input type="password" id="password" name="password" 
                        onChange={(e) => updateCurrentValues(e)} required/>
                <label htmlFor="verifypassword">אימות סיסמא</label>
                <input type="password" id="verifypassword" name="verifypassword" 
                        onChange={(e) => updateCurrentValues(e)} required/>
                <label htmlFor="email">כתובת אימייל</label>
                <input type="email" id="email" name="email" 
                        onChange={(e) => updateCurrentValues(e)} required />
                <button type="submit">הירשם</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <Link to="/">כבר נרשמת אלינו? התחבר כאן</Link>
        </div>
    )
}

export default Signup