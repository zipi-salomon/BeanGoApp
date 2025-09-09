import React, { useState, useEffect } from 'react';
import { fetchServer } from '../service/server';
import '../styles/OrdersManagement.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchServer('/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setLoading(false);
        } else {
          setError('שגיאה בטעינת ההזמנות');
          setLoading(false);
        }
      } catch (err) {
        setError('שגיאה בטעינת ההזמנות');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetchServer(`/orders/${orderId}`, { status: newStatus }, 'PATCH');
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? updatedOrder : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('שגיאה עדכון סטטוס הזמנה');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-200 text-yellow-800';
      case 'processing':
        return 'bg-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">טוען ההזמנות...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="page-title">ניהול הזמנות</h1>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>מספר הזמנה</th>
              <th>שם לקוח</th>
              <th>תאריך הזמנה</th>
              <th>סטטוס</th>
              <th>סה"כ סכום</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order,index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.user_name}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <div className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </td>
                <td>{order.total_price} ₪</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="ordered">הוזמן</option>
                    <option value="preparing">בהכנה</option>
                    <option value="picked">נאסף</option>
                    <option value="ready">ממתין לאיסוף</option>
                    <option value="cancel">בוטל</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManagement;
