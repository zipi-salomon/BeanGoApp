import { fetchServer } from "../service/server";
import { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { useUserContext } from '../context/UserContext';

const Cart = () => {
  const { user } = useUserContext();
  const [products, setProducts] = useState([]);
  var cart = JSON.parse(localStorage.getItem('cart')) || [];

  const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    const itemIndex = cart.findIndex(item => item.id === id);
  
    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        cart.splice(itemIndex, 1); // מוחק לגמרי אם הכמות הייתה 1
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.location.reload();
    }
  };
  

  useEffect(() => {
    const fetchProductById = async (id) => {
      try {
        const response = await fetchServer(`/products/${id}`);
        if (response.ok) {
          const productData = await response.json();
          return productData;
        }
        return null; // Or handle error appropriately
      } catch (error) {
        console.error(`שגיאה בטעינת מוצר ${id}:`, error.message);
        return null;
      }
    };

    const fetchAllProducts = async () => {
      const productPromises = cart.map(async (cartItem) => {
        const product = await fetchProductById(cartItem.id);
        if (product) {
          // הוספת quantity מהעגלה לכל מוצר
          return { ...product, quantity: cartItem.quantity };
        }
        return null;
      });

      const productsData = await Promise.all(productPromises);
      setProducts(productsData.filter(product => product !== null));
    };

    fetchAllProducts();
  }, []);

  const handleOrder = async () => {
    try {
      // Create order items array with the required structure
      const orderItems = products.map(product => ({
        product_id: product.p_id,
        quantity: product.quantity,
        item_price: product.p_price,
        product_name: product.p_name,
        product_description: product.p_description
      }));

      // Calculate total price
      const total_price = products.reduce((sum, product) => {
        return sum + (product.p_price * product.quantity);
      }, 0);

      // Create order object with the correct structure
      const order = {
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        total_price: total_price,
        user_id: user.id,
        items: orderItems
      };
      const confirmOrder = window.confirm(`האם אתה בטוח שברצונך להזמין את המוצרים?\n\nסה"כ: ₪${total_price}`);
      if (!confirmOrder) {
        return; 
      }
      const response = await fetchServer('/orders', order, 'POST');

      if (response.ok) {
        localStorage.removeItem('cart');
        setProducts([]);
        alert('ההזמנה נרשמה בהצלחה!');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('שגיאה בהזמנת המוצרים: ' + error.message);
    }
  };
  return (
    <div className="cart-container">
      {
      
      products.map(product => (
        <div key={product.p_id} className="cart-item">
          <img 
            src={'http://localhost:3000/images/' + product.p_img_source}
            alt={product.p_name}
            className="cart-item-image"
          />
          <div className="cart-item-info">
            <div className="cart-item-name">{product.p_name}</div>
            <div className="cart-item-price">₪{product.p_price}</div>
            <div className="cart-item-quantity">כמות: {product.quantity}</div>
            <div className="cart-item-shop">{product.s_name}</div>
            <button 
              className="remove-icon" 
              onClick={() => removeFromCart(product.p_id)}
              role="button"
              tabIndex="0"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
      <div className="total-price">סה"כ: ₪{products.reduce((sum, product) => sum + (product.p_price * product.quantity), 0)}</div>
      {products.length > 0 && (
        <button 
          onClick={handleOrder} 
          className="order-button"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          הזמין עכשיו
        </button>
      )}
    </div>
  );
};

export default Cart;
