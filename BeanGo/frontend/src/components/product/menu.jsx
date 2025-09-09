import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchServer } from '../../service/server';
import { useUserContext } from '../../context/UserContext';
import '../../styles/table.css';
import '../../styles/layout.css';
import '../../styles/catalog.css';
import '../../styles/Form.css';
import { FaShoppingCart, FaPen, FaTrash } from 'react-icons/fa';
import AddProductModal from '../AddProductModal'
//
const Menu = () => {

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUserContext();
  const { shopId } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  const deleteProduct = async (product) => {
    const confirmOrder = window.confirm(`האם אתה בטוח שברצונך למחוק את המוצר?\n\n`);

    if (!confirmOrder) {
      return; // User cancelled, do nothing
    }
    try {
      const response = await fetchServer(`/products`, { ...product, is_enable: 1 }, 'PATCH');
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
  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const openModal = () =>
   {
     setSelectedProduct(null);
     setIsModalOpen(true);
   }

  useEffect(() => {
      fetchProducts();
    
  }, [shopId]);
  let shopResponse;
  const fetchProducts = async () => {
    try {
      let endpoint = '/products';
      if (shopId) {
        endpoint = `/products/shop/${shopId}`;
         shopResponse = await fetchServer(`/shops/${shopId}`);
         if (!shopResponse.ok) {
          throw new Error('חנות לא קיימת');
          
        }
        const shop = await shopResponse.json();
      
      if (shop.is_enable === 1) {
        throw new Error('החנות לא זמינה');
      }
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
      alert(err.message);
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
        {user?.role === 'admin' && <button onClick={openModal} className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded">
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
                {user?.role === 'customer' ? <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  <FaShoppingCart />
                </button>
                  :
                  <button className="delete-product-btn" onClick={() => deleteProduct(product)}>
                    <FaTrash />
                  </button>
                }
                {user.role === 'admin' && (
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateProduct(product)}
                    title="עדכון מוצר"
                  >
                    <FaPen className="icon" />
                  </button>
                )}
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
        setProducts={setProducts}
      />
    </div>
  );
};

export default Menu;
