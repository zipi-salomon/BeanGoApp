import React, { useState } from "react";
import { useUserContext } from '../context/UserContext';
import "../styles/Form.css";
import { fetchServer } from '../service/server';

const Contact = () => {
  const { user } = useUserContext();
  const [form, setForm] = useState({ name: '', email: '', message: "" });
  const [success, setSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setErrorMsg(null);


    try{
      const response = await fetchServer(`/contact`,
        {
          message: form.message,
          name: !user?form.name:user.username,
          email: !user?form.email:user.email
        },
        'POST'
      );
    }
    catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg("שגיאה בשליחה, נסי שוב מאוחר יותר.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">צור קשר</h2>
      <form className="form" onSubmit={handleSubmit}>
        {!user && (
          <>
            <label htmlFor="name">שם:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="שם..."
              required
            />
            <label htmlFor="email">אימייל:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="אימייל..."
              required
            />
          </>
        )}
        <label htmlFor="message">ההודעה שלך:</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="ההודעה שלך..."
          rows="5"
          required
        />
        <button type="submit">שליחה</button>
      </form>

      {/* הצגת הודעות שגיאה או הצלחה */}
      {errorMsg && (
        <p style={{ marginTop: "10px", color: "red" }}>{errorMsg}</p>
      )}
      {success && (
        <p style={{ marginTop: "10px", color: "green" }}>{success}</p>
      )}
    </div>
  );
};

export default Contact;
