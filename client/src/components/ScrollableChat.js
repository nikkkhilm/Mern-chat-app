import React, { useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Box, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

       const onOpen = (image) => {
        setSelectedImage(image);
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
        setSelectedImage("");
    };

    return (
        <Box className="chat-container" height="500px" overflowY="auto" backgroundImage="url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" backgroundSize="cover" w="100%">
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }} key={m._id}>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        {
                            (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )
                        }
                        <span style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                        }}>
                            {m.content}
                                    <Text textAlign="right" fontSize="xx-small" color="gray.500">
  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  {/* Outputs something like "5:30 PM" */}
</Text>

                        </span>
                    </div>
                    {/* Image or File Display */}
                    {m.file && (
                        <span style={{ marginLeft: isSameSenderMargin(messages, m, i, user._id), marginTop: '5px'  ,maxWidth: "75%",padding: "5px 15px",}}>
                            {m.file.endsWith('.jpg') || m.file.endsWith('.png') || m.file.endsWith('.jpeg') ? (
                                <img src={m.file} alt="uploaded" onClick={() => onOpen(m.file)}  style={{ maxWidth: '150px', borderRadius: '10px' }} />
                            ) : (
                                <a href={m.file} target="_blank" rel="noopener noreferrer">Download File</a>
                            )}
                        </span>
                    )}
                </div>
            ))}
        </ScrollableFeed>
         {/* Modal for displaying the image */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton  padding="10px" 
                        size="lg" />
                    <ModalBody display="flex" justifyContent="center" alignItems="center" padding="40px">
                        <Image src={selectedImage} alt="Selected" maxWidth="100%" />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ScrollableChat;
