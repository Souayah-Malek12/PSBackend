const mongoose = require("mongoose");

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.DB);
        console.log(`Connected to database successfully ${mongoose.connection.host}` )
    }catch(err){
        console.log("DB error", err)
    }
}

module.exports = {connectDb}