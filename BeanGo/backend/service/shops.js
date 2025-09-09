const {con} = require('../dbConection.js');

//return shop by ID
const GetShop= (shopId) => {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM shops WHERE id=?', [shopId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
}

const GetShops = () => {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM shops', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
}

const AddShop = (shop) => {
    const { name, address, Logo_source } = shop;
    return new Promise((resolve, reject) => {
      con.query('INSERT INTO shops (name, address, Logo_source) VALUES (?, ?, ?)', 
        [name, address, Logo_source], (err, results) => {
        if (err) {
            console.error('Error adding shop:', err);
            return reject(err);
        }
        resolve(results);
      });
    });
}

const UpdateShop = (shop) => {
    const { id, name, address,Logo_source,is_enable } = shop;
    return new Promise((resolve, reject) => {
      con.query('UPDATE shops SET name = ?, address = ?, Logo_source = ?,is_enable = ? WHERE id = ?', 
        [name, address, Logo_source,is_enable, id],  async (err, results) => {
          if (err) return reject(err);
          try {
            const updatedShop = await GetShop(id);
            resolve(updatedShop);
          } catch (getErr) {
            reject(getErr);
          }
        });
    });
}

const DeleteShop = (shopId) => {
    return new Promise((resolve, reject) => {
      con.query('DELETE FROM shops WHERE id=?', [shopId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
}
module.exports = {
   GetShop,
   GetShops,
   AddShop,
   UpdateShop,
   DeleteShop
};