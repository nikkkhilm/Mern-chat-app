import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { ViewIcon } from '@chakra-ui/icons'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const {isOpen,onClose,onOpen}=useDisclosure()

    const {selectedChat,setSelectedChat,user}=ChatState()
    
    const [groupChatName,setgroupChatName]=useState()
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const [renameloading,setRenameLoading]=useState(false)

    const toast=useToast()

    const handleRemove=async(user1)=>{
        // console.log(selectedChat.groupAdmin._id)
        // console.log(user._id)
        // console.log(user1._id)

         if(selectedChat.groupAdmin._id !==user._id && user1._id !== user._id)
        {
            toast({
                title:"only admins can remove members! or logged in user cant remove others",
                duration:5000,
                position:"bottom",
                isClosable:true,
                status:"error"
            });
            return;
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            }
            const {data}=await axios.put(`api/chat/groupremove`,
                {
                    chatId:selectedChat._id,
                    userId:user1._id
                },config
            );
            user1._id===user._id?setSelectedChat():setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            fetchMessages()//to get all messages reset
            setLoading(false)
        } catch (error) {
             toast({
                 title:"Error Occured",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
             setLoading(false)
        }
    }

    const handleAddUser=async(user1)=>{
        console.log("groupAdmin ID:", selectedChat.groupAdmin._id, "logged-in user ID:", user1._id);
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title:"User already in group!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            return
        }
        if(selectedChat.groupAdmin._id !==user._id)
        {
            toast({
                title:"only admins can add members!",
                duration:5000,
                position:"bottom",
                isClosable:true,
                status:"error"
            });
            return;
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            }
            const {data}=await axios.put('/api/chat/groupadd',{
                chatId:selectedChat._id,
                userId:user1._id
            },config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                 title:"Error Occured",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
             setLoading(false)
        }


    }

    const handleRename=async()=>{
        if(!groupChatName)return
        try {
            setRenameLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            }
            const {data}=await axios.put('/api/chat/rename',{
                chatId:selectedChat._id,
                chatName:groupChatName,
            },
            config
            )

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title:"Error Occured",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            setRenameLoading(false)
        }
        setgroupChatName("");
    }


     const handleSearch=async(query)=>{
        setSearch(query);
        if(!query)
        {
            setSearchResult([]);
            return;
        }
        try {
            setLoading(true);
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                }
            };
            const {data} = await axios.get(`/api/user?search=${query}`,config);
            console.log(data)
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"error occured",
                description:"failed to load the search result",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-right"
            })
             setLoading(false);
        }
    }

    
  return (
    <>
    <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton/>

          <ModalBody display="flex" flexDir="column" alignItems="center">


           <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map(u=>(
                <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)}/>
            ))}
           </Box>

           <FormControl display="flex">
                <Input placeholder="chat Name" mb={3} value={groupChatName} onChange={(e)=>setgroupChatName(e.target.value)}></Input>
           <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameloading} onClick={handleRename}>Update</Button>
           </FormControl>

           <FormControl >
                <Input placeholder="Add User to Group" mb={1} onChange={(e)=>handleSearch(e.target.value)}></Input>
           </FormControl>
           {loading?(<Spinner size="lg"/>):(
            searchResult?.map((user)=>(
                <UserListItem key={user._id}
                user={user}
                handleFunction={()=>handleAddUser(user)}/>
            ))
           )}


          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red'  onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    

  )
}

export default UpdateGroupChatModal