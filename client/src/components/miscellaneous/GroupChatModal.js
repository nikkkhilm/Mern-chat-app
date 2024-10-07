import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
  FormLabel,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [GroupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [pic,setPic]=useState('')


    const toast=useToast();

    const {user,chats,setChats}=ChatState();

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        // if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat app");
            data.append("cloud_name", "dcpnsvjkp");
            fetch("https://api.cloudinary.com/v1_1/dcpnsvjkp/auto/upload", {
                method: "post", body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        // }
        //  else {
        //     toast({
        //         title: 'Please select a valid Image (JPEG or PNG)',
        //         status: 'warning',
        //         duration: 5000,
        //         isClosable: true,
        //         position: "bottom"
        //     });
            setLoading(false);
            return;
        // }
    };

    const handleSearch=async(query)=>{
        setSearch(query);
        if(!query)
        {
          setSearchResult([])
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
            setLoading(false)
        }
    }

    const handleSubmit=async()=>{
        if(!GroupChatName || !selectedUsers)
        {
            toast({
                    title:"Please fill all the fields",
                    status:"warning",
                    duration:5000,
                    isClosable:true,
                    position:"top"
                });
                return;
        }
        try {
            setLoading(true);
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                }
            };
            const {data} =await axios.post('/api/chat/group',{
                name:GroupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id)),
                pic
            },config);

            setChats([data,...chats]);
            onClose();
            toast({
                    title:"New Group created",
                    
                    status:"success",
                    duration:5000,
                    isClosable:true,
                    position:"top"
                });
                return;
            
        } catch (error) {
            
        }
    }
    
    const handleGroup=(userToAdd)=>{
            if(selectedUsers.includes(userToAdd))
            {
                toast({
                    title:"User already added",
                    status:"warning",
                    duration:5000,
                    isClosable:true,
                    position:"top"
                });
                return;
            }
            setSelectedUsers([...selectedUsers,userToAdd]);
    }

    const handleDelete=(deluser)=>{
setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== deluser._id))
    }

    
  return (
    <div>
        <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>

          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">Create Group Chat</ModalHeader>

          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" alignItems="center">

           <FormControl mb={3}>
            <FormLabel >Chat Name</FormLabel>
            <Input placeholder='Chat Name'  onChange={(e)=>setGroupChatName(e.target.value)}></Input>
           </FormControl>

            <FormControl id="signup-pic" mb="3">
                <FormLabel>Upload your picture</FormLabel>
                <Input placeholder="Upload pic" type='file' p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>

           <FormControl mb={3}>
            <FormLabel>Add Users</FormLabel>
            <Input placeholder='Add Users' mb="1" onChange={(e)=>handleSearch(e.target.value)}></Input>
           </FormControl>

           <Box  w="100%" display="flex" flexWrap="wrap">
           {/* selected users */}
           {selectedUsers.map(u=>(
            <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
           ))}
           </Box >
           {/* render searched users */}
           {loading?(<div>Loading</div>):(searchResult?.slice(0,4).map(user=>(<UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
        )))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default GroupChatModal