//requiring backend dependencies
const express = require('express');
const {createServer} = require('http')
const {Server} = require('socket.io')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
dotenv.config();
//declaring important variables
const app = express();
const server = createServer(app)
//importing middlewares
const {initIo} = require('./sockets/socket')
//importing routes
const authRoutes = require('./routes/authRoutes');
const dishRoutes = require('./routes/dishRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reserveRoutes = require('./routes/reserveRoutes')
const orderRoutes = require('./routes/orderRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes');
//middlewares
app.use(cors({
     origin: process.env.FRONTEND_URL,
        credentials:true
}))

app.use(express.json());
app.use('/api/uploads', express.static(__dirname + '/uploads'))
//calling routes
app.use('/api/user', authRoutes);
app.use('/api/dish', dishRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reserve', reserveRoutes);
app.use('/api/order', orderRoutes)
app.use('/api/nots', notificationRoutes)
app.use('/api/dash', dashboardRoutes)

//io init
initIo(server)
//start server here
mongoose.connect(process.env.MONGODB_URI)
.then((res) => {
    server.listen( process.env.PORT, ()=>{
        console.log('listening at port 4000');
    });
}).catch(err =>{
    console.log(err);
});