import axios from 'axios'
import { useRef } from 'react'
import { useState, useContext, useEffect } from 'react'
import { FaRegPaperPlane } from 'react-icons/fa'
import { UserContext } from '../../utilitis/Context'
import chatImg from '../../assets/chat.png'
import Conversation from './Conversation'
import Message from './Message'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const Chat = ({socket}) => {

  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [arrivalMessages, setArrivalMessages] = useState(null)

  const { usermodal, setusermodal } = useContext(UserContext)

  const scrollRef = useRef()

  const navigate = useNavigate()


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    socket?.on('getMessage', data => {
      setArrivalMessages({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })
  }, [])

  useEffect(() => {
    arrivalMessages &&
      currentChat?.members.includes(arrivalMessages.sender) &&
      setMessages((prev) => [...prev, arrivalMessages])
  }, [arrivalMessages, currentChat])

  useEffect(() => {
    socket?.on('getUsers', users => {
    })
  }, [usermodal])


  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get('http://localhost:4000/conversations/' + usermodal.id, {
          headers: {
            "x-access-token": localStorage.getItem("user"),
          },
        })
        setConversations(res.data)
      } catch (error) {
        navigate('/error')
      }
    }
    getConversation()
  }, [usermodal.id])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('http://localhost:4000/messages/' + currentChat?._id, {
          headers: {
            "x-access-token": localStorage.getItem("user"),
          },
        })
        setMessages(res.data)
      } catch (error) {
        navigate('/error')
      }
    }
    getMessages()
  }, [currentChat])

  const submit = async (e) => {

    const newMessages = e.message

    const message = {
      sender: usermodal.id,
      text: newMessages,
      conversationId: currentChat._id
    }

    const receiverId = currentChat.members.find((member) => member !== usermodal.id)


    socket?.emit('sendMessage', {
      senderId: usermodal.id,
      receiverId,
      text: newMessages
    })
    try {
      const res = await axios.post('http://localhost:4000/messages', message, {
        headers: {
          "x-access-token": localStorage.getItem("user"),
        },
      })
      setMessages([...messages, res.data])
      reset()
    } catch (error) {
      navigate('/error')
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  return (
    <div className='w-full lg:w-8/12 md:flex bg-white mx-auto h-[86%] mt-4 shadow-gray-200 shadow-xl rounded-sm' >

      <div className='w-full md:w-4/12 h-1/6  md:h-full border-r-2 rounded-sm bg-white'>
        <div className='w-full md:h-10 md:mb-2 border-b-2 flex rounded-sm bg-white'>
          <h1 className='text-gray-700 text-lg font-semibold my-auto ml-3'>Resend Chats</h1>
        </div>
        <div className='flex md:block border-b-2 md:border-none w-full overflow-x-scroll scrollbar-hide'>
        {
          conversations.map((c) => (
            <div onClick={() => setCurrentChat(c)} >
              <Conversation conversation={c} />
            </div>
          ))
        }
        </div>
      </div>
      <div className='w-full md:w-8/12 h-5/6 md:h-full '>
        <div className='w-full h-[90%]  rounded-sm overflow-y-scroll scrollbar-hide bg-gradient-to-r from-gray-100 to-blue-100'>
          {
            currentChat ?
              <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-fit">
                <div id="messages" className="flex flex-col space-y-4 p-3  ">
                  {
                    messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message message={m} own={m.sender === usermodal.id} />
                      </div>
                    ))
                  }
                </div>
              </div> :
              <div className='flex w-full h-full bg-blue-100' >
                <img src={chatImg} alt="" />
              </div> 
          }
        </div>
        <div className=' bg-white w-full h-[10%] flex justify-center rounded-sm'>
          <form className='flex my-auto w-full h-full justify-center' onSubmit={handleSubmit(submit)}>
            <input className=' h-4/6 w-10/12 bg-gray-100 rounded-md my-auto p-2 focus:outline-none '
              name='message' placeholder='Type a message'
              {...register("message", {
                required: "message Required",
                pattern: {
                  value: /^\S/,
                  message: "invalid message "
                }
              })} />
            <button type="submit" className='my-auto w-1/12'>
              <FaRegPaperPlane className='h-7 w-7 text-blue-500 mx-auto '></FaRegPaperPlane>
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Chat

