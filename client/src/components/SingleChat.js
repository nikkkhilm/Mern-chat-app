import React, { useEffect, useState} from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text,  useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender ,getSenderFull} from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import '../components/SingleChat.css'
import Addfile from './miscellaneous/Addfile'


const ENDPOINT="http://localhost:5000";

var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const toast=useToast()

    const [timerId, setTimerId] = useState(null);


    const  { user,selectedChat,setSelectedChat,notification,setNotification}= ChatState()
    const [messages,setMessages]=useState([])
    const [loading,setLoading]=useState(false)
    const [newMessage,setNewMessage]=useState()
     const [file, setFile] = useState(null)

    const [socketConnected,setSocketConnected]=useState()
    const [typing,setTyping]=useState()
    const [isTyping,setIsTyping]=useState()


    const fetchMessages=async()=>{
        if(!selectedChat)return
        try {
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }

            setLoading(true)

            const {data}=await axios.get(`/api/message/${selectedChat._id}`,config)

            // console.log(data)

            setMessages(data)
            setLoading(false)

            socket.emit('join chat',selectedChat._id)

    //          if (data.length > 0) {
    //   updateLastSeenMessage(data[data.length - 1]._id);  // Pass the last message ID
    // }

        } catch (error) {
             toast({
                    title:"Error occured",
                    description:"Failed to fetch all the message",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                    status:"error"
                })
        }
    }

    // for socket connection from frontend at the mount
    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup",user)
        socket.on('connected',()=>setSocketConnected(true))

        socket.on('typing' ,()=>setIsTyping(true))
        socket.on('stop typing' ,()=>setIsTyping(false))
    },[])

//     const updateLastSeenMessage = async () => {
//   try {
//     const config = {
//       headers: {
//         "Content-type": "application/json",
//         Authorization: `Bearer ${user.token}`,
//       },
//     };

//     // Assuming `selectedChat` and the latest message's `_id` are available
//     const { data } = await axios.put(
//       `/api/chat/${selectedChat._id}/lastSeenMessage`, 
//       { lastSeenMessageId: messages[messages.length - 1]._id }, 
//       config
//     );
//   } catch (error) {
//     console.error("Failed to update last seen message", error);
//   }
// };



    useEffect(()=>{

            fetchMessages();

            selectedChatCompare=selectedChat;
    },[selectedChat])

    // console.log(notification,"........")


    // recieveing the message here
  useEffect(()=>{
    socket.on('message recieved',(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id)
            {

             

                // give notification
                if(!notification.includes(newMessageRecieved))
                {
                    setNotification([newMessageRecieved,...notification])

                    setFetchAgain(!fetchAgain)
                }
               
            }
       
            else
            {
                setFetchAgain(!fetchAgain)
                setMessages([...messages,newMessageRecieved])
            }
  })
})

    const sendMessage=async(e)=>{
        if(e.key==="Enter" && (newMessage|| file))
        {
            socket.emit('stop typing',selectedChat._id)
            try {
                let fileUrl=""
                if(file)
                {
                // changes done for file &image upload
                    const formData = new FormData(); // Use FormData to send file and message
                    formData.append("file", file);
                    formData.append("upload_preset", "chat app");
                     formData.append("cloud_name", "dcpnsvjkp");
                
                     const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dcpnsvjkp/auto/upload", {
                        method: "POST",
                        body: formData,
                        });
                    const data = await uploadResponse.json();
                    fileUrl = data.url;
                }

                // const contentToSend = file ? fileUrl : newMessage;


                const config={
                    headers:{
                        "Content-type":"application/json",
                        Authorization:`Bearer ${user.token}`,
                    }
                }

                // setNewMessage("")
                // SelectField(null)

                const {data}=await axios.post('/api/message',
                    {
                    content:newMessage,
                    chatId:selectedChat._id,
                    file:fileUrl
                }
                ,config);

                // console.log(data)

                socket.emit('new message',data)
                setNewMessage("")
                setFile(null)


                setFetchAgain(!fetchAgain)

                setMessages([...messages,data])

            } catch (error) {
                toast({
                    title:"Error occured",
                    description:"Failed to send the message",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                    status:"error"
                })
            }
        }
    }

    

    const typingHandler=(e)=>{
        setNewMessage(e.target.value)
        // typing indicator logic
        if(!socketConnected)return

        if(!typing)
        {
            setTyping(true)
            // sends emit when typing starts in the input
            socket.emit('typing',selectedChat._id);
        }
        // let lastTypingTime = new Date().getTime()
        var timerLength =3000
        // setTimeout(()=>{
        //     var timeNow=new Date().getTime()
        //     var timeDiff=timeNow - lastTypingTime
        //     if(timeDiff>=timerLength && typing)
        //     {
        //         socket.emit('stop typing',selectedChat._id)
        //         setTyping(false)
        //     }
        // },timerLength)
                if (timerId) {
            clearTimeout(timerId);
        }

        let timer = setTimeout(() => {
            socket.emit('stop typing',selectedChat._id);
               setTyping(false);

        }, timerLength);

        setTimerId(timer);

    }



  return (
   <>
   {selectedChat? (<>
    <Text fontSize={{base:"28px",md:"30px"}} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent={{base:"space-between"}} alignItems="center">

            <IconButton display={{base:"flex",md:"none"}} icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat("")}/>

            {!selectedChat.isGroupChat?
            (<>
            {/* returns the sender name in single chat*/}
            {getSender(user,selectedChat.users)}

                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>

            </>):(

            <>
            {selectedChat.chatName.toUpperCase()}

            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                   
            </>)}
        </Text>

        {/* messages here */}
            <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">

                {loading?


                (<Spinner size="xle" w={20} h={20} alignSelf="center" margin="auto"/>):

                (<div display="flex" flexDir="column" overflowY="scroll" scrollbar-width="none">
                    {/* this is the chat page where messages are seen  */}
                         <ScrollableChat messages={messages}/>
                </div>
            
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3} display="flex"  bg="#E0E0E0"> 
                {/* this is plus button for uploading file or photo */}
                <Addfile setFile={setFile}/>

                {/* typing dots  */}
                {isTyping?<div class="loader"></div>:<></>}

                <Input variant="filled" bg="#E0E0E0" placeholder='Enter a Message'
                onChange={typingHandler}
                value={newMessage}
                ></Input>
            </FormControl>

            </Box>
   </>): (
    <Box display="flex" alignItems="center" justifyContent="center" h="100%" backgroundImage="url('https://wallpapercave.com/wp/wp6988830.jpg')" backgroundSize="cover" w="100%" backgroundRepeat="no-repeat">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans" fontWeight="bold" color={'white'}>
            Click on a User to start Chatting
        </Text>
    </Box>
   )}
   </>
  )
}

export default SingleChat