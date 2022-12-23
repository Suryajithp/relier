import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Header/Navbar'
import Profile from '../components/Profile/Profile'

const UserProfile = () => {
  const navigate = useNavigate()
  const userAuthenticated = () => {
    axios.get("http://localhost:4000/isUserAuth", {
      headers: {
        "x-access-token": localStorage.getItem("user"),
      },
    }).then((response) => {
      if (!response.data.auth) {
        navigate('/')
      }
    }).catch((error)=>{
      navigate('/error')
    })
  };

  useEffect(()=>{
    userAuthenticated()
  },[])
  return (
    <div className='bg-sky-50 h-screen scrollbar-hide overflow-hidden'>
        <Navbar/>
        <Profile/>
    </div>
  )
}

export default UserProfile