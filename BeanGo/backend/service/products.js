const {con} = require('../dbConection.js');

const GetProduct = (productId) => {
    return new Promise((resolve, reject) => {
      con.query(`SELECT
         products.id AS p_id,
         shops.id AS s_id,
         products.name AS p_name,
         products.description AS p_description,
         products.price AS p_price,
         products.img_source AS p_img_source,
         products.inStock AS p_inStock,
         products.shop_id AS p_shop_id,
         products.is_enable AS p_is_enable,
         shops.name AS s_name
        FROM products join shops on products.shop_id=shops.id
        WHERE products.id=?`
        , [productId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  };

  const GetAllProducts = (shopId, isAdmin) => {
    return new Promise((resolve, reject) => {
      let conditions = [];
      if (!isAdmin) conditions.push('products.is_enable = 0');
      if (shopId) conditions.push(`products.shop_id = ${shopId}`);
      conditions.push('(shops.is_enable = 0 OR shops.id IS NULL)');
  
      const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  
      con.query(`SELECT 
        products.id AS p_id,
        shops.id AS s_id,
        products.name AS p_name,
        products.description AS p_description,
        products.price AS p_price,
        products.img_source AS p_img_source,
        products.inStock AS p_inStock,
        products.shop_id AS p_shop_id,
        products.is_enable AS p_is_enable,
        shops.is_enable AS s_is_enable,
        shops.name AS s_name
        FROM products 
        LEFT JOIN shops ON products.shop_id = shops.id 
        ${whereClause}`, (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
    });
  };
  

  const AddProduct = (product) => {
    const { p_name, p_description, p_price, p_img_source, shop_id } = product;
    const inStock = 1; // Default to 1 (true) since it's not in the form
    const isEnable = 0; // Default to 0 (true) since it's not in the form

    // Explicitly convert types to prevent DB errors
    const priceNumber = parseFloat(p_price);
    const shopIdNumber = parseInt(shop_id, 10);

    // Validate conversion
    if (isNaN(priceNumber) || isNaN(shopIdNumber)) {
      return Promise.reject(new Error('Invalid data format for price or shop ID.'));
    }

    return new Promise((resolve, reject) => {
      con.query(
        'INSERT INTO products (name, description, price, img_source, inStock, shop_id) VALUES (?, ?, ?, ?, ?, ?)', 
        [p_name, p_description, priceNumber, p_img_source, inStock, shopIdNumber], 
        (err, results) => {
          if (err) {
            console.error("Database error in AddProduct:", err);
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  };

  const UpdateProduct = (product) => {
    const { p_id, p_name, p_description, p_price } = product;
    return new Promise((resolve, reject) => {
      con.query(
        'UPDATE products SET name = ?, description = ?, price = ?, is_enable = ? WHERE id = ?',
        [p_name, p_description, p_price, product.is_enable || 0, p_id],
        async (err, results) => {
          if (err) return reject(err);
          try {
            const updatedProduct = await GetProduct(p_id);
            resolve(updatedProduct);
          } catch (getErr) {
            reject(getErr);
          }
        }
      );
    });
  };
  
  const DeleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
      con.query('DELETE FROM products WHERE id=?', [productId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
  module.exports = {
    GetProduct,
    GetAllProducts,
    AddProduct,
    UpdateProduct,
    DeleteProduct
};