import { ViewIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProfileModal = ({ user, isOpen, onClose }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [pic, setPic] = useState(user?.pic || '');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    // Validate that password and confirmPassword match if provided
    if (password && password !== confirmpassword) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    // Prepare the update object with only the changed fields
    const updatedData = {};
    if (name && name !== user.name) updatedData.name = name;
    if (email && email !== user.email) updatedData.email = email;
    if (password) updatedData.password = password;
    if (pic && pic !== user.pic) updatedData.pic = pic;

    // If no fields are changed, show a warning
    // if (Object.keys(updatedData).length === 0) {
    //   toast({
    //     title: 'No changes made',
    //     status: 'info',
    //     duration: 5000,
    //     isClosable: true,
    //     position: 'bottom',
    //   });
    //   setLoading(false);
    //   return;
    // }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.put('/api/user/profile/update', updatedData, config);

      toast({
        title: 'Profile Updated Successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      // Update localStorage with new user data
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      onClose(); // Close modal after successful update
      navigate('/chats'); // Redirect to chats or reload the page to reflect updates

    } catch (error) {
      toast({
        title: 'Error occurred',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast({
        title: 'Please select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('file', pics);
    data.append('upload_preset', 'chat app');
    data.append('cloud_name', 'dcpnsvjkp');

    fetch('https://api.cloudinary.com/v1_1/dcpnsvjkp/auto/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Your Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="5px">
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                placeholder="Enter Your Name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={show ? 'text' : 'password'}
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="confirm-password">
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={show ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="pic">
              <FormLabel>Upload your picture</FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={submitHandler} isLoading={loading}>
            Update
          </Button>
          <Button variant="ghost" ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProfileModal;
