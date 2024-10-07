import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import UpdateProfileModal from './UpdateProfileModal';

const ProfileModal = ({ user, children }) => {
  // Modal state for profile view
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Modal state for update profile
  // const {
  //   isOpen: isUpdateOpen,
  //   onOpen: onUpdateOpen,
  //   onClose: onUpdateClose,
  // } = useDisclosure();

  return (
    <>
      {/* Trigger for the profile modal */}
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      {/* Profile modal */}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name} />
            <Text fontFamily="Work sans" fontSize={{ base: '28px', md: '30px' }}>
              Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            {/* Trigger for update profile modal */}
            {/* <Button colorScheme="blue" mr={3} onClick={onUpdateOpen}>
              Edit Profile
            </Button> */}
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Profile modal */}
      {/* <UpdateProfileModal isOpen={isUpdateOpen} onClose={onUpdateClose} user={user} /> */}
    </>
  );
};

export default ProfileModal;
