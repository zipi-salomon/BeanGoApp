const {con} = require('../dbConection.js');

//return user by password and username
//post function to keep the data
const GetUser = (username, password) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};
//return user by id
const GetUserById = (userId) => {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM users WHERE id=?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  };

//add user
const AddUser = (user) => {
    const { tz, username, password , email, role} = user;
    return new Promise((resolve, reject) => {
      con.query('INSERT INTO users (tz,username, password, email, role) VALUES (?, ?, ?, ?, ?)', 
        [tz,username, password, email, role], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  //get all users
  const GetAllUsers = () => {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM users', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  //get active users
  const GetActiveUsers = () => {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM users WHERE is_active = 1', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  const UpdateUser = (user) => {
    const { id, tz, username, password , email, role, is_active} = user;
    return new Promise((resolve, reject) => {
      con.query('UPDATE users SET tz = ?, username = ?, password = ?, email = ?, role = ?, is_active = ? WHERE id = ?', 
        [tz,username, password, email, role, is_active, id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
module.exports = {
    GetUser,
    GetUserById,
    AddUser,
    GetAllUsers,
    GetActiveUsers,
    UpdateUser,
    
};