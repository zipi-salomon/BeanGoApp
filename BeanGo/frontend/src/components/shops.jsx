import { useEffect, useState } from 'react';
import { fetchServer } from '../service/server';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import AddShopModal from '../components/AddShopModal';
import '../styles/Shops.css';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserContext();

  const fetchData = async () => {
    try {
      const response = await fetchServer('/shops');
      if (response.ok) {
        const data = await response.json();
        setShops(data);
      } else {
        console.error('Failed to fetch shops');
      }
    } catch (err) {
      console.error('שגיאה:', err.message);
    }
  };

  const toggleShopStatus = async (shop) => {
    try {
      const response = await fetchServer(`/shops/${shop.id}`, { ...shop,is_enable: !shop.is_enable }, 'PATCH');
      if (response.ok) {
        const updatedShop = await response.json();
        setShops(prev => 
          prev.map(s => 
            s.id === shop.id ? updatedShop : s
          )
        );
      }
    } catch (error) {
      console.error('Error updating shop status:', error);
      alert('שגיאה עדכון סטטוס החנות');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {user.role === 'admin' && (
        <button onClick={openModal} className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded mb-4">
          ➕ הוסף חנות
        </button>
      )}

       {shops.length > 0 ? (
        <div className="shops-container">
          {shops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <div className="shop-content">
                <div className="shop-header">
                  <img
                    src={'http://localhost:3000/images/logos/' + shop.Logo_source}
                    alt={shop.name}
                    className="shop-image"
                  />
                  <div className="shop-info">
                    <p className="shop-name">{shop.name}</p>
                    <p className="shop-address">{shop.address}</p>
                    <p className="shop-description">{shop.description}</p>
                  </div>
                </div>
                <div className="shop-actions">
                  <button 
                    onClick={() => navigate(`/menu/${shop.id}`)}
                    className="shop-view-btn"
                  >
                    צפייה
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => toggleShopStatus(shop)}
                      className={`shop-status-btn ${shop.is_enable ? 'active' : 'inactive'}`}
                    >
                      {!shop.is_enable ? 'השבת' : 'הפעל'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">לא נמצאו חנויות להצגה.</p>
      )}

      <AddShopModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onShopAdded={fetchData}
      />
    </div>
  );
};

export default Shops;
