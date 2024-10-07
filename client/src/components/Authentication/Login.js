import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack ,useToast} from '@chakra-ui/react'
import React,{ useState} from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show,setShow] = useState(false)
    const [loading,setLoading]=useState(false)
    const {user,setUser} =ChatState()
    const toast=useToast()
    // const history=useHistory()
    const navigate=useNavigate()

    const handleclick = ()=>{
        setShow(!show)
    }

    const submitHandler=async()=>{
        setLoading(true);
        if(!email || !password)
        {
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            setLoading(false);
            return;
        }
        try {
            const config={
                headers:{
                    "Content-type":"application/json",
                }
            };

            const {data}=await axios.post('/api/user/login',{email,password},config);

            toast({
                title:"Login Sucessful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            // history.push('/chats');
            // setUser(JSON.stringify(data));
            navigate('/chats')

        } catch (error) {
             toast({
                title: "Error occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }

    }; 

  return (
    <VStack spacing='5px'>

        <FormControl id="email" isRequired>
            <FormLabel >Email</FormLabel>
            <Input placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel >Password</FormLabel>
            <InputGroup>
            <Input type={show?'text':'password'}
            value={password} placeholder='Enter Your Password' onChange={(e)=>setPassword(e.target.value)}></Input>
           
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size='sm' onClick={handleclick}>
                {show?"Hide":"Show"}
                </Button>
                </InputRightElement>
                </InputGroup>
        </FormControl>

        <Button colorScheme='blue' width='100%' style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>Login</Button>
        {/* guest user */}
        <Button colorScheme='red' width='100%' style={{marginTop:15}} onClick={()=>{
            setEmail("guest@email.com");
            setPassword("123456789")
        }}>Login as Guest</Button>
    </VStack>
   
  )
}

export default Login