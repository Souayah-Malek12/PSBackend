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