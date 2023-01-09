import Chats from '../components/Chats/Chats';
import axios from '../Axios/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Header/Navbar'


const Chat = ({socket,notification}) => {

    const navigate = useNavigate()
    const userAuthenticated = () => {
      axios.get("/isUserAuth", {
        headers: {
          "x-access-token": localStorage.getItem("user"),
        },
      }).then((response) => {
        if (!response.data.auth) {
          navigate('/')
        }
      });
    };
  
    useEffect(()=>{
      userAuthenticated()
    },[])

    return (
        <div className='bg-sky-50 h-screen scrollbar-hide overflow-hidden'>
            <Navbar />
            <Chats socket={socket} notification={notification}/>
        </div>
    )
}

export default Chat
