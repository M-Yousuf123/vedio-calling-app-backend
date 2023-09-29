const {Server} = require('socket.io');

const io = new Server(8000,{
    cors:true,
});


const emailToScoketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on('connection', socket => {
    console.log('New Connection');
     socket.on('room:join', (data)=>{
        const {roomId, emailId} = data;
        console.log('User', emailId, 'joined room', roomId);
        emailToScoketIdMap.set(emailId, socket.id);
        socketidToEmailMap.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit('joined-room', {roomId});
        socket.broadcast.to(roomId).emit('user-joined', {emailId, id: socket.id})
     });
     socket.on('user:call', ({to, offer})=>{
           io.to(to).emit('incomming:call', {from:socket.id, offer});
     })
     socket.on('call:accepted', ({to, ans})=>{
        io.to(to).emit('call:accepted', {from:socket.id, ans});
     })
     socket.on('peer:nego:needed', ({to, offer})=>{
        io.to(to).emit('peer:nego:needed', {from:socket.id, offer});
     })
     socket.on('peer:nego:done', ({to, ans})=>{
        io.to(to).emit("peer:nego:final", {from:socket.id, ans});
     })
})

