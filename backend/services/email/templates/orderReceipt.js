module.exports = order =>{
    return `
    <h2>Order Receipt</h2>
    <p>Hello ${order.customerName}</p>
    <p>Thank you for your order. Here are the details:</p>
    <p>Order ID: ${order._id}</p>
    <p>Items:</p>
    <ul>
    ${order.items.map(item => `<li>${item.name} - Quantity: ${item.quantity} - Price: ${item.price}</li>`).join('')}
    </ul>
    <p>Payment Status: ${order.paymentStatus}</p>
    <p>Order Status: ${order.status}</p>
    <p>Date: ${new Date(order.createdAt).toDateString()}</p>
    <p>Time: ${new Date(order.createdAt).toTimeString()}</p>
    <p>Total Amount: ${order.totalAmount}</p>
    <a href="${process.env.FRONTEND_URL}/orders/${order._id}" target="_blank">View Order Details</a>
    `}