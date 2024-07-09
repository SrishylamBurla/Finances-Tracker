const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routes/userRouter")
const errorHandler = require("./middlewares/errorHandlerMiddleware")
const categoryRouter = require("./routes/categoryRouter")
const cors = require("cors")
const dotEnv = require("dotenv")

const transactionRouter = require("./routes/transactionRouter")
const PORT = process.env.PORT || 8000
const path = require('path');
const app = express()
app.use(express.json())

dotEnv.config()

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// const MONGO_URI = "mongodb+srv://srishylam125:rksrishylam@srishylam.0wf14ig.mongodb.net/mern-expenses"

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
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