import {createContext, useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext()

const ChatProvider = ({children})=>{

    // creating a user state
    const [user,setUser]=useState();
    const [chats,setChats]=useState([]);
    const [selectedChat,setSelectedChat]=useState()
    const [notification,setNotification]=useState([])

    const navigate=useNavigate();

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // console.log(`userINFO-${userInfo}`)
        
if (userInfo && userInfo.token) {
  // console.log(`Token: ${userInfo.token}`);  // Make sure this prints the actual token
  setUser(userInfo);
} else {
  // console.log("No token found");
   navigate('/');
}

        
        // console.log(user)
        // if(!userInfo)
        // {
        //     navigate('/')
        // }
    },[navigate,])//see y

    return <ChatContext.Provider value={{ user , setUser , selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
        {children}
    </ChatContext.Provider>
    
};

export const ChatState=()=>{
    
   return  useContext(ChatContext)
}

export default ChatProvider;