import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Body from '../components/Userhome/Body'
import { io } from 'socket.io-client';
import Navbar from '../components/Header/Navbar'
import { UserContext } from '../utilitis/Context';

const Home = () => {

  const [socket, setSocket] = useState(null)
  const { usermodal, setusermodal } = useContext(UserContext)

  const navigate = useNavigate()
  const userAuthenticeted = () => {
    axios.get("http://localhost:4000/isUserAuth", {
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
    setSocket(io("http://localhost:5000"))
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