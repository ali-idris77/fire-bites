module.exports = order =>{
    return `
    <h2>Order Status Update</h2>
    <p>Hello ${order.customerName}</p>
    <p>We wanted to inform you that the status of your order has been updated.</p>
    <p>Order ID: ${order._id}</p>
    <p>Current Status: ${order.status}</p>
    <a href="${process.env.FRONTEND_URL}/orders/${order._id}" target="_blank">View Order Details</a>
    `}