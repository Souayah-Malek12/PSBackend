// index.js
const express = require("express");
const { connectDb } = require("./Config/dbConfig");
const cors = require("cors");
const http = require('http');
const gopd = require('gopd'); // ✅ from node_modules

require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://souayah-malek12.github.io',
  'https://souayah-malek12.github.io/PSfrontend',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ps-backend.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy does not allow access from this origin.'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Create HTTP server
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Socket.IO setup
const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  perMessageDeflate: {
    threshold: 1024,
    clientNoContextTakeover: true
  }
});

// Connect to database
connectDb();

// Initialize WorkersController with io
const { setIO } = require('./Controllers/WorkersController');
setIO(io);

// Global variables for sockets
let users = [];
let workers = [];
let orders = [];

// Socket.IO events
io.on('connection', socket => {
  console.log('New client connected:', socket.id);

  socket.on('addUser', userId => {
    if (!users.find(u => u.userId === userId)) {
      users.push({ userId, socketId: socket.id });
      io.emit('getUsers', users);
    }
  });

  socket.on('addWorkers', worker => {
    if (!workers.find(w => w.worker.id === worker.id)) {
      workers.push({ worker, socketId: socket.id });
    }
  });

  socket.on('sendOrder', ({ order }) => {
    orders.push(order);
    const receiverWorker = workers.filter(w => w.worker.profession === order.category);
    receiverWorker.forEach(w => io.to(w.socketId).emit('getOrder', { order }));
  });

  socket.on('sendMessage', ({ conversationId, senderId, message, rId }) => {
    const receiver = users.find(u => u.userId === rId);
    if (receiver) {
      socket.to(receiver.socketId).emit('getMessage', { conversationId, senderId, message, rId });
    }
  });

  socket.on('disconnect', () => {
    users = users.filter(u => u.socketId !== socket.id);
    workers = workers.filter(w => w.socketId !== socket.id);
    io.emit('getUsers', users);
  });
});

// Routes
app.get('/', (req, res) => res.send("Hello to project"));
app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/adm', require('./Routes/adminRoutes'));
app.use('/api/cat', require('./Routes/categoryRoutes'));
app.use('/api/order', require('./Routes/serviceOderRoutes'));
app.use('/api/serv', require('./Routes/serviceRoutes'));
app.use('/api/worker', require('./Routes/workersRoutes'));
app.use('/api/conversation', require('./Routes/ConversationRoutes'));

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io }; // ✅ export only once
