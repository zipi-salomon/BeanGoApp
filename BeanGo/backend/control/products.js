const  {GetProduct, GetAllProducts,AddProduct,UpdateProduct,DeleteProduct}  =require( "../service/products.js");

const GetProductControl = async (req, res) => {
    try {
      const { productId } = req.params;
        const data = await GetProduct(productId);
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  const GetAllProductsControl = async (req, res) => {
    try {
        const isAdmin = req.user?.role === 'admin';
        const data = await GetAllProducts(null, isAdmin);
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  const AddProductControl = async (req, res) => {
    try {
      const productDetails = req.body;

      if (!req.file) {
        return res.status(400).send('לא נבחר קובץ תמונה.');
      }

      const imageName = req.file.filename;
      const productData = {
        ...productDetails,
        p_img_source: imageName,
      };
      const data = await AddProduct(productData);
      res.status(201).json(data);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).send('שגיאה בהוספת המוצר.');
    }
  }

  const UpdateProductControl = async (req, res) => {
    try {
      const  product  = req.body;
        const data = await UpdateProduct(product);
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  const DeleteProductControl = async (req, res) => {
    try {
      const { productId } = req.params;
        const data = await DeleteProduct(productId);
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  const GetProductsByShopControl = async (req, res) => {
    try {
      const { shopId } = req.params;
        const data = await GetAllProducts(shopId);
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }
  module.exports = {
    GetProductControl,
    GetAllProductsControl,
    AddProductControl,
    UpdateProductControl,
    DeleteProductControl,
    GetProductsByShopControl
  };