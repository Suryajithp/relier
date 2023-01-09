import axios from '../Axios/AxiosInstance';
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Body from '../components/Userhome/Body'
import Navbar from '../components/Header/Navbar'
import { UserContext } from '../utilitis/Context';

const Home = ({socket}) => {

  const { usermodal, setusermodal } = useContext(UserContext)

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

  useEffect(() => {
    userAuthenticeted()
  }, [])

  useEffect(() => {
    socket?.emit("newUser", usermodal)
  }, [socket, usermodal])

  return (
    <div className=' bg-sky-50 max-h-screen scrollbar-hide overflow-hidden'>

      <Navbar socket={socket} />
      <Body socket={socket} user={usermodal} />
    </div>
  )
}

export default Home