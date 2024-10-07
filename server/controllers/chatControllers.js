const asyncHandler = require("express-async-handler");
const Chat=require('../models/chatmodel');
const User = require("../models/usermodel");

const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body;

    if(!userId)
    {
        console.log("UserId param not sent with the request");
        return res.sendStatus(400);
    }

    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat=await User.populate(isChat,{
        path:'latestMessage.sender',
        select:"name pic email"
    });

    if(isChat.length>0)
    {
        res.send(isChat[0]);
    }
    else
    {
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        };

        try {
            const createdChat=await Chat.create(chatData);
            const FullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password");

            res.status(200).send(FullChat);
        } catch (error) {
            
        res.status(400);
        throw new Error(error.message);
        }
    }
});


const fetchChats=asyncHandler(async(req,res)=>{
    try {
        console.log("in")
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            });
            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


// create groupchat
const createGroupChat=asyncHandler(async(req,res)=>{
    console.log(req.user)
    if(!req.body.users || !req.body.name)
    {
return res.status(400).send({message:"Please fill all the fields"});

    }

    var users=JSON.parse(req.body.users);//DATA SENT AS STREING SO THIS LINE
    if(users.length<2)
    {
        return res.status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user._id)
    try {
        const groupChat=await Chat.create({
            chatName:req.body.name,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user,
            pic:req.body.pic
        });

        const fullGroupChat=await Chat.findOne({_id:groupChat._id}).populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
     throw new Error(error.message);
    }

});


const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;

    const updatedChat=await Chat.findByIdAndUpdate(chatId,{chatName:chatName},{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChat)
    {
        res.status(404);
        throw new Error("Chat not found")
    }
    else
    {
        res.json(updatedChat);
    }

});


const addToGroup=asyncHandler(async(req,res)=>{
    // console.log(hi)
    const {chatId,userId}=req.body;

    const added=await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },{new:true}
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!added)
    {
        res.status(404)
        throw new Error("Chat not found");
    }
    else{
    res.json(added);
    }
});


const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;

    const removed=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },{new:true}
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed)
    {
        res.status(404)
        throw new Error("Chat not found");
    }
    else{
    res.json(removed);
    }
});

// const updateLastSeenMessage = async (req, res) => {
//   const { lastSeenMessageId } = req.body;
//   const chatId = req.params.selectedChatid;
//   const userId = req.user._id;  // Extract the user ID from the protected middleware

//   try {
//     // Find the chat
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: 'Chat not found' });
//     }

//     // Ensure the user is part of the chat
//     if (!chat.users.includes(userId)) {
//       return res.status(403).json({ message: 'You are not authorized to update this chat' });
//     }

//     // Update the lastSeenMessageId for the current user in the chat
//     const updatedChat = await Chat.findOneAndUpdate(
//       { _id: chatId, 'users._id': userId },  // Find the chat where the user is part of the users array
//       { $set: { 'users.$.lastSeenMessageId': lastSeenMessageId } },  // Update lastSeenMessageId for that user
//       { new: true }  // Return the updated chat
//     );

//     if (!updatedChat) {
//       return res.status(500).json({ message: 'Failed to update last seen message' });
//     }

//     res.status(200).json(updatedChat);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


module.exports = {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}