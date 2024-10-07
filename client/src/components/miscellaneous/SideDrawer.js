import { Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Effect} from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'

import {Drawer,DrawerBody,DrawerHeader,DrawerOverlay,DrawerContent} from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false); // Initialize with false

  const { user, setSelectedChat, setChats, chats ,setUser,notification,setNotification} = ChatState();
  // const history = useHistory();
  const navigate=useNavigate()
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logouthandler = () => {
    localStorage.removeItem('userInfo');
    setChats([])
    setUser(null)

    // history.push('/');
    navigate('/')
  };

  const handleSearch = async () => {
    if (!search) {
      setSearchResult([])
      toast({
        title: 'Please enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load search result',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false); // Ensure loading is reset
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: { // Correct spelling of 'headers'
          'Content-type': 'application/json', // Correct spelling of 'Content-Type'
          Authorization: `Bearer ${user.token}`,
        },
      };

      // u have to write userId only because in backend it will destructure it like that
      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) 
        {
          setChats([data, ...chats]);
        }

      setSelectedChat(data);
      onClose(); // Move this inside try to ensure it's called on success
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoadingChat(false); // Ensure loadingChat is reset
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* search button tooltip */}
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            {/* here for small screen it will not show search user for medium onwards it will be displayed */}
            <Text display={{ base: 'none', md: 'flex' }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* APP NAME */}
        <Text fontSize="2xl" fontFamily="Work sans">CHIT-CHAT</Text>


        <div>
          <Menu>
            <MenuButton p="1" >
                {/* notification badge using react-notification-badge */}
                <NotificationBadge count={notification.length} effect={Effect.SCALE}/>

              <BellIcon fontSize="2xl" m="1"/>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.filter((notif,index,self)=>self.findIndex(n=>n.chat._id === notif.chat._id)===index)
              .map((notif)=>(
                <MenuItem key={notif._id} onClick={()=>{
                  setSelectedChat(notif.chat)
                  setNotification(notification.filter((n)=>n.chat._id!==notif.chat._id))
                }}>
                  
                  {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                  </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
              {/* this user.name has come from  chatstate from context/chatProvider file */}
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logouthandler}> Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb="2">
              <Input
                placeholder='Search by name or email'
                mr="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />} {/* Ensure spinner shows when loadingChat is true */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
