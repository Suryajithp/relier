import axios from '../AxiosInstance'; 
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EditProfile from '../components/EditProfile/EditProfile'
import Navbar from '../components/Header/Navbar'

const EditUserProfile = () => {
  const navigate = useNavigate()
  const userAuthenticeted = () => {
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
    userAuthenticeted()
  },[])
  return (
    <div className='bg-sky-50 h-screen scrollbar-hide overflow-hidden'>
        <Navbar/>
        <EditProfile/>
    </div>
  )
}

export default EditUserProfile
