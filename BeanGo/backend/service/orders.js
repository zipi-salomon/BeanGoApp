const {con} = require('../dbConection.js');

const GetOrder = (orderId) => {
    return new Promise((resolve, reject) => {
      con.query(`SELECT orders.id,orders.status,orders.created_at,orders.total_price,
         users.username as user_name,users.id as user_id FROM orders join users on orders.user_id = users.id WHERE orders.id=?`, [orderId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  };

const GetOrdersByUserId = (userId) => {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM orders WHERE user_id=?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
}

const GetOrders= () => {
    return new Promise((resolve, reject) => {
      con.query(`SELECT 
                orders.id,
                orders.status,
                orders.created_at,
                orders.total_price,
                users.username as user_name,
                users.id as user_id
                 FROM orders join users on orders.user_id = users.id `, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
}
const AddOrder= (order) => {
    const {shop_id, created_at, total_price,user_id } = order;
    return new Promise((resolve, reject) => {
      con.query('INSERT INTO orders ( status, created_at, total_price,user_id) VALUES (?, ?, ?,?)', 
        ['ordered', created_at, total_price,user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
}

const UpdateOrder = (order) => {
    const { orderId, status } = order;
    return new Promise((resolve, reject) => {
      con.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], 
          async (err, results) => {
                  if (err) return reject(err);
                  try {
                    const updatedOrder = await GetOrder(orderId);
                    resolve(updatedOrder);
                  } catch (getErr) {
                    reject(getErr);
                  }
                }
      );
    });
}

module.exports = {
    GetOrder,
    GetOrdersByUserId,
    GetOrders,  
    AddOrder,
    UpdateOrder
};