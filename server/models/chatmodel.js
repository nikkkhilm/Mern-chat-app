const mongoose=require('mongoose')

const chatmodel = mongoose.Schema(
    {
        chatName:{type:String,trim:true},

        isGroupChat:{type:Boolean,default:false},

        users:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            // refrence to user model
        }],
        latestMessage:{type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        },
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        pic:{
            type:String,default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
        // for unread messages
    //     userLastSeen: [
    //   {
    //     userId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User"
    //     },
    //     lastSeenMessageId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Message"
    //     },
    //   }
    // ]
        
    },{
        timestamps:true,
    }
);

const Chat=mongoose.model('Chat',chatmodel);
module.exports = Chat