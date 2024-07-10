const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routes/userRouter")
const errorHandler = require("./middlewares/errorHandlerMiddleware")
const categoryRouter = require("./routes/categoryRouter")
const cors = require("cors")
require("dotenv").config()

const transactionRouter = require("./routes/transactionRouter")
const PORT = process.env.PORT || 8000
const path = require('path');
const app = express()
app.use(express.json())



__dirname = path.resolve();
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname, "/frontend/dist")))

  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  })
}else{
  app.get('/', (req, res) => {
    const port = process.env.PORT || 5000;
    res.send('Server is working on port ' + port);
  });
}

// const MONGO_URI = "mongodb+srv://srishylam125:rksrishylam@srishylam.0wf14ig.mongodb.net/mern-expenses"

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("DB connected");})
.catch((e)=>console.log(e))

const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ["POST", "GET"],
    credentials:true
}

app.use(cors(corsOptions))

// app.use("/", (req, res)=>{
//     res.json("hello")
// })
app.use("/", userRouter)
app.use("/", categoryRouter)
app.use("/", transactionRouter)

app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`server is up and running... on port ${PORT}`);
})