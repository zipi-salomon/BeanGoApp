import { useState } from 'react';

const PublicContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess('ההודעה נשלחה בהצלחה!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setSuccess('שגיאה בשליחה, נסי שוב מאוחר יותר.');
      }
    } catch (err) {
      console.error(err);
      setSuccess('שגיאה בשליחה, נסי שוב מאוחר יותר.');
    }
  };

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
      <h4>נתקלת בבעיה? כתבי לנו:</h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="השם שלך" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="האימייל שלך" required />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="ההודעה שלך" required />
        <button type="submit">שליחה</button>
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default PublicContactForm;
