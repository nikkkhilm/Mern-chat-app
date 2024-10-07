import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Button, Stack, useToast, Text, Tooltip, Avatar, Badge } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const Mychats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    // Fetching all chats for the current user
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/chat', config);
            // console.log(data);
            setChats(data); // Set the fetched chats to state
        } catch (error) {
            toast({
                title: "Error Occurred",
                description: "Failed to load chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats(); // Fetch chats on component load or when fetchAgain changes
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p="3"
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb="3"
                px="3"
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display="flex"
                flexDir="column"
                p="3"
                w="100%"
                bg="#F8F8F8"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="auto"> {/* Enable scrolling */}
                        {chats.map((chat) => {
                            const other = chat.users.find(u => u._id !== user._id);

                            return (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    display="flex"
                                    alignItems="center"
                                    gap="35px"
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px="3"
                                    py="2"
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Tooltip label={chat.isGroupChat ? chat.chatName : other.name} placement="bottom-start" hasArrow>
                                        <Avatar
                                            mt="7px"
                                            mr={1}
                                            size="md"
                                            cursor="pointer"
                                            name={chat.isGroupChat ? chat.chatName : other.name}
                                            src={chat.isGroupChat ? chat.pic : other.pic}
                                        />
                                    </Tooltip>

                                    <Box >
                                    <Text fontSize={'20px'} mb={2}>
                                        {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                    </Text>

                                    {/* Place latest message content right after the username */}
                                    {chat.latestMessage && (
                                        <Text fontSize={'16px'} color="gray.600" ml={2}>
                                            {chat.latestMessage.content}
                                        </Text>
                                    )}
                                    </Box>
                                    
                                    {/* Optionally add unread message count in badge if needed */}
                                    {/* {unreadCount > 0 && (
                                        <Badge colorScheme="red" ml="auto">
                                            {unreadCount}
                                        </Badge>
                                    )} */}
                                </Box>
                            );
                        })}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default Mychats;
