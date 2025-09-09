const { con } = require('../dbConection.js');
const AddMessage = ({ email, name, message}) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO messages (sender_email, sender_name, message_text)
      VALUES (?, ?, ?)
    `;
    con.query(sql, [email, name, message], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const GetAllMessages = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM messages
      ORDER BY created_at DESC
    `;
    con.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const MarkMessageRead = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE messages SET is_read = 1 WHERE id = ?
    `;
    con.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  AddMessage,
  GetAllMessages,
  MarkMessageRead,
};
