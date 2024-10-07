import React, { useEffect } from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

const Home = () => {

  const navigate = useNavigate(); // using useNavigate hook

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate('/chats'); // navigate instead of history.push
    }
  }, [navigate]);

  return (
    // container makes responsive
    <Container maxW='xl' centerContent >
      <Box d="flex" justifyContent="center" bg={'white'} w="100%" p={3} m="40px 0 15px 0" borderRadius="lg" borderWidth='1px' textAlign='center'>
        <Text fontSize='4xl' fontFamily='Work Sans' color={'black'}>CHIT-CHAT</Text>
      </Box>

      <Box bg={'white'} w="100%" p={4} borderRadius="lg" borderWidth='1px' color={'black'}>
        <Tabs variant='soft-rounded'>
          <TabList mb='1em'>
            <Tab width="50%">LOGIN</Tab>
            <Tab width="50%">SIGNUP</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* login component */}
              <Login />
            </TabPanel>
            <TabPanel>
              {/* signup component */}
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home;
