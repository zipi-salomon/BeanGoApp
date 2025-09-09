const {con} = require('../dbConection.js');

const GetOrderItemsByOrderId = (orderId) => {
    return new Promise((resolve, reject) => {
      con.query('SELECT order_items.*, products.name product_name, description product_description FROM order_items join products on order_items.product_id = products.id WHERE order_id=?', [orderId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };
 const AddOrderItems = (items) => {
  return new Promise((resolve, reject) => {
  
    const values = items.map(item => [
      item.order_id,      
      item.product_id,
      item.quantity,
      item.item_price,
    ]);

    const sql = `INSERT INTO order_items (order_id, product_id, quantity, item_price) VALUES ?`;

    con.query(sql, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}
  module.exports = {
    GetOrderItemsByOrderId,
    AddOrderItems
};