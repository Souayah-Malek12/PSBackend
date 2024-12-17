const express = require("express");
const {connectDb} = require("./Config/dbConfig")
const cors = require("cors")
const app = express();



app.use(cors())


require('dotenv').config();
app.use(express.json());

const PORT = 5000
app.listen(PORT,()=>{
    console.log(`app running on port : ${PORT}`)
})

connectDb();
//io 
const io = require("socket.io")(5001, {
    cors :{
        origin : 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
})

let users = [];
io.on('connection', socket=>{
    console.log(socket.id)
    socket.on('addUser', userId=>{
        const userExist = users.find(user =>user.userId === userId)
        if(!userExist){
            const user = {userId, socketId: socket.id};
            users.push(user);
            io.emit('getUsers', users);
        }
       
    })

    socket.on('sendMessage',  ({ conversationId, senderId , message , rId  })=>{
        const receiver = users.find(user => user.userId === rId);
        if(receiver){
            socket.to(receiver.socketId).emit('getMessage', {
                conversationId,
                senderId,
                message,
                rId
            });
            console.log("receiverId",rId)

                console.log("Message received on server:", { conversationId, senderId , message , rId });
            
        }
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users)
    })    
})
//end of socket part
app.get('/',(req, res)=>{
    res.send("Hello to project");
}); 

app.use('/api/auth', require('./Routes/authRoutes'));

app.use('/api/adm', require('./Routes/adminRoutes'));

app.use('/api/cat', require('./Routes/categoryRoutes'));

app.use('/api/order', require('./Routes/serviceOderRoutes'));

app.use('/api/serv', require('./Routes/serviceRoutes'));

app.use('/api/worker', require('./Routes/workersRoutes'))

app.use('/api/conversation', require('./Routes/ConversationRoutes'))