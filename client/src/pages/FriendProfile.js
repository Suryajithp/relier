import axios from '../Axios/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Header/Navbar';
import FriendsProfile from '../components/Profile/FriendsProfile';

const FriendProfile = () => {
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
          <Navbar/>
          <FriendsProfile/>
      </div>
    )
  
}

export default FriendProfile