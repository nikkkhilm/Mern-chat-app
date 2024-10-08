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
import axios from 'axios';

const UpdateProfileModal = ({ user, isOpen, onClose }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [pic, setPic] = useState(user?.pic || '');
  const [newPicFile, setNewPicFile] = useState(null); // To store the selected file
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  // Handle submit to update user profile
  const submitHandler = async () => {
    setLoading(true);

    // Validate password match if provided
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

    // Upload new pic if a new file is selected
    let uploadedPic = pic;
    if (newPicFile) {
      const data = new FormData();
      data.append('file', newPicFile);
      data.append('upload_preset', 'chat_app');
      data.append('cloud_name', 'your_cloud_name');

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dcpnsvjkp/auto/upload', {
          method: 'POST',
          body: data,
        });
        const result = await res.json();
        uploadedPic = result.url.toString();
      } catch (err) {
        console.error(err);
        toast({
          title: 'Image upload failed',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
        setLoading(false);
        return;
      }
    }

    // Prepare the update object with only the changed fields
    const updatedData = {};
    if (name && name !== user.name) updatedData.name = name;
    if (email && email !== user.email) updatedData.email = email;
    if (password) updatedData.password = password;
    if (uploadedPic && uploadedPic !== user.pic) updatedData.pic = uploadedPic;

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

      // Update local storage and UI with new user data
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      onClose(); // Close modal after successful update

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

  const handleFileChange = (file) => {
    setNewPicFile(file); // Store the selected file but don't upload yet
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="confirmpassword">
              <FormLabel>Confirm New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="pic">
              <FormLabel>Profile Picture</FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])} // Set the file, but don't upload
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
