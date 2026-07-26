const {Server} = require('socket.io')

let io
module.exports.initIo = (server) =>{
     io = new Server( server,{
        cors:{
            origin: process.env.FRONTEND_URL,
            credentials:true
        }
    })

    io.on("connection", (socket)=>{
        console.log("User connected", socket.id)
        socket.on("join-room", ({email, role})=>{
            socket.join(email)
            socket.join(role)

            console.log(`${socket.id} joined: ${email} or ${role}`)
        })
        socket.on("disconnect", ()=>{
            console.log("User disconnected", socket.id)
        });
    });
        return io;
};

module.exports.getIo = () =>{
    if(!io){
        throw new Error("Socket.o has not been inited yet")
    };
    return io;
};