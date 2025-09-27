const express = require("express");
const { connectDb } = require("./Config/dbConfig");
const cors = require("cors");
const http = require('http');
const app = express();

const corsOptions = {
  origin: ['https://souayah-malek12.github.io', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
require('dotenv').config();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Create Socket.IO server
const io = require("socket.io")(server, {
  cors: {
    origin: ['https://souayah-malek12.github.io', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Initialize database connection
connectDb();

// Import and initialize WorkersController with io instance
const { setIO } = require('./Controllers/WorkersController');
setIO(io);

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Global variables
let users = [];
let workers = [];
let orders = [];
let acquiredOrds = [];

// Socket.IO connection handler
io.on('connection', socket => {
    console.log('New client connected:', socket.id);
    
    socket.on('addUser', userId => {
        const userExist = users.find(user => user.userId === userId);
        if (!userExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
        console.log('Client disconnected:', socket.id);
        workers = workers.filter(worker => worker.socketId !== socket.id)
    });

    socket.on('addWorkers', worker=>{
        const workerExist = workers.find(user =>user.worker.id === worker.id)
        if(!workerExist){
            const w = {worker , socketId: socket.id};
            workers.push(w);
        }
        console.log("wokers list",workers)
       
    })

    socket.on('sendOrder', ({order })=>{
        orders.push(order)
        console.log("******recived ONE******",orders)
        console.log("Orders",orders)
        const receiverWorker = workers.filter((w) => w.worker.profession === order.category);
    if (receiverWorker.length>0) {
        // Emit the order to the specific worker
        receiverWorker.forEach( worker => {
        io.to(worker.socketId).emit('getOrder', { order });
        console.log("sednde Order ######",order)
            })
    }else {
        console.log('No workers available');

    }
    })

    

    let bids = [];
let bidTimeout = null;
const GRACE_PERIOD = 10000;

socket.on("bid", (OrdBid) => {
  const categoryId = OrdBid?.order?.category;

  const existingCat = bids.find((bid) => bid.categoryId === categoryId);
  if (existingCat) {
    existingCat.bids.push(OrdBid);
  } else {
    bids.push({ categoryId, bids: [OrdBid] });
  }
  console.log("Updated bids:", bids);

  if (bids.length > 0) {
    const allBids = bids.flatMap((cat) => cat.bids);

    const minBid = allBids.reduce((min, current) =>
      parseFloat(current.price) < parseFloat(min.price) ? current : min
    );

    console.log("Lowest bid:", minBid);

    if (bidTimeout) clearTimeout(bidTimeout);

    bidTimeout = setTimeout(() => {
      console.log("Final winner:", minBid);
      if (minBid) {
        io.to(minBid.socketId).emit("acquiredOrder", minBid);
        const data = minBid.price;
        socket.emit("bidEnd", data);
        console.log(data)
      }

      bids = [];
      bidTimeout = null;
    }, GRACE_PERIOD);
  }
});


    socket.on("disconnect", ()=>{
        workers = workers.filter(worker => worker.socketId !== socket.id)
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
module.exports = {io};
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


module.exports = {}