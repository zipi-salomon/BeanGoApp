import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchServer } from './service/server';
import { useUserContext } from './context/UserContext';
import './styles/table.css';
import './styles/layout.css';
import './styles/catalog.css';
import './styles/Form.css';
import './styles/menu.css';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa';
import AddProductModal from './components/AddProductModal';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useUserContext();
  const { shopId } = useParams();

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    fetchProducts();
  }, [shopId]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.p_id);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ id: product.p_id, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('המוצר נוסף לעגלה');
  };
  const deleteProduct = async (id) => {
    try {
      const response = await fetchServer(`/products/${id}`, null, 'DELETE');
      if (response.ok) {
        alert('המוצר נמחק בהצלחה');
        fetchProducts();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('שגיאה במחיקת המוצר');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shopId]);

  const fetchProducts = async () => {
    try {
      let endpoint = '/products';
      if (shopId) {
        endpoint = `/products/shop/${shopId}`;
      }
      const response = await fetchServer(endpoint);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', response.statusText);
        setProducts([]); // Clear products on error
      }
    } catch (err) {
      console.error('שגיאה:', err.message);
      setProducts([]); // Clear products on error
    }
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">☕Welcome to BeanGo</h1>
          <p className="text-gray-600">הזמן מראש, אסוף בקלות – בלי לחכות בתור</p>
        </div>
        {user.role === 'admin' && <button onClick={handleAddProduct} className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded">
          ➕ הוסף מוצר
        </button>}
      </div>

      {products.length > 0 ? (
        <div className="menu-container">
          {products.map((product) => (
            <div key={product.p_id} className="menu-card">
              <img
                src={'http://localhost:3000/images/' + product.p_img_source}
                alt={product.name}
                className="menu-image"
              />
              <div className="menu-details">
                <div className="menu-info">
                  <p className="menu-name">{product.p_name}</p>
                  <p className="menu-price">{product.p_price} ₪</p>
                  <p className="menu-description">{product.p_description}</p>
                  <p className="menu-shop">{product.s_name}</p>
                </div>
                <div className="menu-actions flex justify-between items-center">
                  {user.role === 'admin' && (
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateProduct(product)}
                      title="עדכון מוצר"
                    >
                      <FaPen className="icon" />
                    </button>
                  )}
                  {user.role === 'customer' && (
                    <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                      <FaShoppingCart className="icon" />
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button className="delete-btn" onClick={() => deleteProduct(product.p_id)}>
                      <FaTrash className="icon" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">לא נמצאו מוצרים להצגה.</p>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        shopId={shopId}
        onProductAdded={fetchProducts}
        selectedProduct={selectedProduct}
        fetchProducts={fetchProducts}
      />
    </div>
  );
};

export default Menu;
