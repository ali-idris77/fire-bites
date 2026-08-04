module.exports = order =>{
    return `
    <div style="display: flex; align-items: center; gap: 2px;">
      <h2  style='font-family: quicksand; color:#EB2F00;'>Firey</h2>
    <h2 style='font-family: quicksand;' >Bites</h2></div>
    <h2>Order Status Update</h2>
    <p>Hello ${order.customerEmail.split('@')[0]}</p>
    <p>We wanted to inform you that the status of your order has been updated.</p>
    <p>Order ID: ${order._id}</p>
    <p>Current Status: ${order.status}</p>
    <a href="${process.env.FRONTEND_URL}/orders/${order._id}" target="_blank">View Order Details</a>
    `}