const  {GetOrder,GetOrdersByUserId,GetOrders,AddOrder,UpdateOrder}  =require( "../service/orders.js");
const  {GetOrderItemsByOrderId,AddOrderItems}  =require( "../service/orderItems.js");


const GetOrderControl = async (req, res) => {
    try {
      const { orderId } = req.params;
        const orderDetails = await GetOrder(orderId);
        const itemsDetails = await GetOrderItemsByOrderId(orderId);
        const data = {...orderDetails,
            items: itemsDetails};
        res.json(data)
    }
    catch(error) {
        res.status(400).send('error');
    }
  }
  const GetOrdersControl = async (req, res) => {
    try {
      const role = req.user.role;
      let orders;
      
      if (role === "admin") {
        orders = await GetOrders();
      } else {
        orders = await GetOrdersByUserId(req.user.id);
      }

      const data = await Promise.all(
        orders.map(async (order) => {
          const items = await GetOrderItemsByOrderId(order.id);
          return { ...order, items: items };
        })
      );

      res.json(data);
    } catch (error) {
      console.error('Error in GetOrdersControl:', error);
      res.status(400).send('Error fetching orders');
    }
  }

  const AddOrderControl = async (req, res) => {
    try {
      const { items, ...order } = req.body;
        const dataOrder = await AddOrder(order);
        const orderId = dataOrder.insertId;
        const fullItems = items.map(item => ({
          ...item,
          order_id: orderId,
        }));
        const dataItems = await AddOrderItems(fullItems);
        res.json({dataOrder, dataItems})
    }
    catch(error) {
        res.status(400).send('error');
    }
  }
  
  const UpdateOrderControl = async (req, res) => {
    try {
      const {status} = req.body;
      const { orderId } = req.params;
        const data = await UpdateOrder({orderId,status});
        res.json(data)
    }
    catch(error) {
        res.status(400).send('error');
    }
  }
  
  module.exports = {
    GetOrderControl,
    GetOrdersControl,
    AddOrderControl,
    UpdateOrderControl
  };