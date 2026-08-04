module.exports = order =>{
    return `
    <div style="display: flex; align-items: center; gap: 2px;">
      <h2  style='font-family: quicksand; color:#EB2F00;'>Firey</h2>
    <h2 style='font-family: quicksand;' >Bites</h2></div>
    <h2>Order Receipt</h2>
    <p>Hello ${order.customerEmail.split('@')[0]}</p>
    <p>Thank you for your order. Here are the details:</p>
    <p>Order ID: ${order._id}</p>
    <p>Items:</p>
    <ul>
    ${order.items.map(item => `<li>${item.dish.name} - Quantity: ${item.quantity} - Price: ${item.dish.discountPrice || item.dish.price}</li>`).join('')}
    </ul>
    <p>Payment Status: ${order.payment.status}</p>
    <p>Order Status: ${order.status}</p>
    <p>Date: ${new Date(order.createdAt).toDateString()}</p>
    <p>Time: ${new Date(order.createdAt).toTimeString()}</p>
    <p>Total Amount: ${order.amount}</p>
    <a href="${process.env.FRONTEND_URL}/orders/${order._id}" target="_blank">View Order Details</a>
    `}