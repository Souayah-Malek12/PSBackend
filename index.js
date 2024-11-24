const express = require("express");
const {connectDb} = require("./Config/dbConfig")
const app = express();

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

app.use('/api/serviceClient', require('./Routes/seviceClientRoutes'));

app.use('/api/client', require('./Routes/clientRoutes'))