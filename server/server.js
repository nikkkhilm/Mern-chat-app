const express=require('express')
const app=express()
const colors=require('colors')
const dotenv=require('dotenv')
dotenv.config()

// routes import
const userRoutes  =require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes');
const path =require( 'path')

// to connect db to monog
const connectdb =require('./config/db')
const Message = require('./models/messageModel')

const {notFound,errorHandler} = require('./middlewares/errorMiddleware')

app.use(express.json()) //to accept json data


// this is a function written inside the config->db.js
connectdb();

// const chats= require('./data/data')

const port=process.env.PORT

// end points then goes to routes with default api/user
app.use('/api/user',userRoutes)

// chat route
app.use('/api/chat',chatRoutes)

// message route
app.use('/api/message',messageRoutes)




// deployment //

const __dirname1 = path.resolve()
if(process.env.NODE_ENV==='production')
{
        app.use(express.static(path.join(__dirname1,"client/build")))

        app.get("*",(req,res)=>{
            res.sendFile(path.resolve(__dirname1,"client","build","index.html"))
        })
}
else{
    app.get('/',(req,res)=>{
        res.send("Api is running successfully")
    })
}

// deployement //





// error handling middlewares
app.use(notFound)
app.use(errorHandler)



const server=app.listen(port,()=>
console.log(`server is running on port ${port}`.yellow.bold)//.yellow.bold is just an added color to differentiate using npm i colors
)

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"*"
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io")

    socket.on('setup',(userData)=>{
        // create a new room with id of user
        socket.join(userData._id);
        // console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log("User joined Room:"+room)
    })

    socket.on('typing',(room)=>socket.in(room).emit("typing"))

    socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"))


    socket.on('new message',async(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat
        if(!chat.users)
        {
            return console.log("chat.users not defined")
        }
       
            
            chat.users.forEach(user=>{
                // dont send message to same person who sent message in group
                if(user._id===newMessageRecieved.sender._id)
                {
                    return;
                }
    
                socket.in(user._id).emit("message recieved",newMessageRecieved)//here i have changed message from newMessageRecieved
            })
       

    });

    socket.off("setup",()=>{
        console.log("user disconnected")
        socket.leave(userData._id)
    });
});

