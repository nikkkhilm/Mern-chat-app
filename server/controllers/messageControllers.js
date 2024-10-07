const asyncHandler=require('express-async-handler');
const Message = require('../models/messageModel');
const User=require('../models/usermodel');
const Chat = require('../models/chatmodel');

const allMessages=asyncHandler(async(req,res)=>{
    try {
        const messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")

        res.status(200).json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId,file}=req.body
    console.log("1")

    if(!content && !file || !chatId)
    {
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newMessage={
        sender:req.user._id,
        content,
        chat:chatId,
        file
    }
    console.log("2")
    try {
        let message=await Message.create(newMessage);

        message = await message.populate("sender","name pic")
        console.log("3")
        message = await message.populate("chat");
        message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email",
        });
        console.log("1")

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.status(200).json(message);

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

module.exports={sendMessage,allMessages}