import React, { useState, useEffect } from 'react';
import { fetchServer } from '../service/server';
import '../styles/Modal.css';
import '../styles/Form.css';

const AddProductModal = ({ isOpen, onClose, shopId, onProductAdded, selectedProduct = null, setProducts }) => {
  const [formData, setFormData] = useState({
    p_id: '',
    p_name: '',
    p_description: '',
    p_price: '',
    shop_id: selectedProduct ? selectedProduct.p_shop_id : shopId
  });
  const [imageFile, setImageFile] = useState(null);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchShops = async () => {
        try {
          const response = await fetchServer('/shops');
          if (response.ok) {
            const data = await response.json();
            setShops(data);
          } else {
            alert('שגיאה בקבלת רשימת החנויות.');
          }
        } catch (error) {
          console.error('Error fetching shops:', error);
        }
      };
      fetchShops();
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          p_id: selectedProduct.p_id,
          p_name: selectedProduct.p_name,
          p_description: selectedProduct.p_description,
          p_price: selectedProduct.p_price,
          shop_id: selectedProduct.p_shop_id
        }));
      }
    }
  }, [isOpen, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      setFormData({
        p_id: '',
        p_name: '',
        p_description: '',
        p_price: '',
        shop_id: shopId || ''
      });
    }
  }, [shopId, isOpen, selectedProduct]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        p_id: '',
        p_name: '',
        p_description: '',
        p_price: '',
        shop_id: shopId || ''
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct && !formData.shop_id) {
      alert('אנא בחר חנות.');
      return;
    }
    if (!selectedProduct && !imageFile) {
      alert('אנא בחר תמונה להעלאה.');
      return;
    }

    let dataToSend;
    let isForm = false;

    if (!selectedProduct || imageFile) {
      // משתמשים ב־FormData רק אם זו הוספה או שיש תמונה לעדכן
      const submissionData = new FormData();
      submissionData.append('p_name', formData.p_name);
      submissionData.append('p_description', formData.p_description);
      submissionData.append('p_price', formData.p_price);
      submissionData.append('shop_id', formData.shop_id);
      if (imageFile) {
        submissionData.append('p_img_source', imageFile);
      }
      dataToSend = submissionData;
      isForm = true;
    } else {
     
      dataToSend = {
        p_id: formData.p_id,
        p_name: formData.p_name,
        p_description: formData.p_description,
        p_price: formData.p_price,
        shop_id: formData.shop_id
      };
    }

    try {
      const method = selectedProduct ? 'PATCH' : 'POST';
      const url = '/products';
      const response = await fetchServer(url, dataToSend, method, isForm);

      if (response.ok) {
        const updatedProduct = await response.json(); 
        alert(selectedProduct ? 'המוצר עודכן בהצלחה!' : 'המוצר נוסף בהצלחה!');
      
        if (!selectedProduct) onProductAdded();
      
        setProducts(prev =>
          prev.some(p => p.p_id === updatedProduct.p_id)
            ? prev.map(p => p.p_id === updatedProduct.p_id ? updatedProduct : p)
            : [...prev, updatedProduct]
        );
        
        // ניקוי הטופס אם זה לא עדכון
        if (!selectedProduct) {
          setFormData({
            p_id: '',
            p_name: '',
            p_description: '',
            p_price: '',
            shop_id: shopId || ''
          });
        }
      //   p_id: '',
      //   p_name: '',
      //   p_description: '',
      //   p_price: '',
      //   shop_id: ''
      // });
        onClose();
      }
      else {
        const errorData = await response.json();
        alert(`שגיאה: ${errorData.message || 'אנא נסה שוב'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('שגיאה בשליחת הטופס.');
    }
    
    // ניקוי הטופס אחרי שליחה
    if (!selectedProduct) {
      setFormData({
        p_id: '',
        p_name: '',
        p_description: '',
        p_price: '',
        shop_id: shopId || ''
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="form-title">הוספת מוצר חדש</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="p_name">שם המוצר:</label>
          <input type="text" id="p_name" name="p_name" value={formData.p_name} onChange={handleInputChange} required />

          <label htmlFor="p_description">תיאור:</label>
          <textarea id="p_description" name="p_description" rows="3" value={formData.p_description} onChange={handleInputChange} required></textarea>

          <label htmlFor="p_price">מחיר:</label>
          <input type="number" id="p_price" name="p_price" step="0.01" value={formData.p_price} onChange={handleInputChange} required />

          {!selectedProduct && (
            <>
              <label htmlFor="shop_id">חנות:</label>
              <select id="shop_id" name="shop_id" value={formData.shop_id} onChange={handleInputChange} required>
                <option value="" disabled>בחר חנות...</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>

              <label htmlFor="p_img_source">העלה תמונה:</label>
              <input type="file" id="p_img_source" name="p_img_source" onChange={handleFileChange} required />
            </>
          )}

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
              ביטול
            </button>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              שמור מוצר
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
