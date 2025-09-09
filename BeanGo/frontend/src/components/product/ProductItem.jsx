import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductItem = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="product-item" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>₪{product.price}</p>
      </div>
      {isHovered && (
        <div className="add-to-cart">
          <button className="add-to-cart-btn">
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
