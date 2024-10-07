
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import Mychats from '../components/miscellaneous/Mychats';
import ChatBox from '../components/miscellaneous/ChatBox';
import { useState } from 'react';


const Chatpage = () => {

  const {user} = ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);



  return (


    <div style={{width:"100%"}}>

      {/* this is sidedrawer with search ,app name, and notificatiob badge,profile and logout */}
      {user && <SideDrawer/>}


      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px"> 
        {user && <Mychats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
      
    </div>
  )
}

export default Chatpage;