import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import { fetchServer } from "../service/server";
import '../styles/Profile.css';

const MyOrders = () => {
    const { user } = useUserContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchServer(`/orders`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Error loading orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
        );
    }

    if (error) {
        return (
            <div className="message error">
                {error}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="message">
                אין ההזמנות
            </div>
        );
    }
const handleCancelOrder = async (order) => {
    try {
        const response = await fetchServer(`/orders/${order.id}`, { ...order, status: 'cancel' }, 'PATCH');
        if (response.ok) {
            const updatedOrder = await response.json();
            setOrders(prev => 
                prev.map(o => 
                    o.id === order.id ? updatedOrder : o
                )
            );
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('שגיאה עדכון סטטוס הזמנה');
    }
}
    return (
        <div className="orders-table-container">
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>מספר הזמנה</th>
                        <th>תאריך הזמנה</th>
                        <th>סטטוס</th>
                        <th>סה"כ סכום</th>
                        <th>ביטול הזמנה</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td className="order-date">
                                {new Date(order.created_at).toLocaleDateString('he-IL')}
                            </td>
                            <td className={`status ${order.status.toLowerCase()}`}>
                                {order.status === 'picked' ? 'נאסף' : 
                                 order.status === 'ordered' ? 'הוזמן' : 
                                 order.status==='preparing'?'בהכנה':
                                 order.status==='cancel'?'בוטל':'ממתין לאיסוף'}                            </td>
                            <td className="order-total">
                                {order.total_price} ₪
                            </td>
                           {order.status === 'ordered' && <td>
                                <button onClick={() => handleCancelOrder(order)}>ביטול הזמנה</button>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyOrders;
