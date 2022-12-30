import Profilepic from '../../assets/images.jpg'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../utilitis/Context'
import axios from '../../AxiosInstance'; 
import { useNavigate } from 'react-router-dom'

const Conversation = ({ conversation }) => {

    const { usermodal, setusermodal } = useContext(UserContext)
    const [user, setUser] = useState(null)

  const navigate = useNavigate()


    useEffect(() => {

        const friendId = conversation.members.find(m => m !== usermodal.id)

        const getUser = async () => {
            try {
                const res = await axios.get('/getuserpost/' + friendId,{
                    headers: {
                      "x-access-token": localStorage.getItem("user"),
                    },
                  })
                setUser(res.data)
            } catch (error) {
                navigate('/error')
            }
        }
        getUser()
    }, [usermodal, conversation])

    return (
        <div>
            <div className='md:flex w-16 md:w-full  h-fit p-1 rounded hover:bg-gray-200 transition-transform '>

                <div className=" m-1 flex ">
                    {
                      user &&user[0]?.profile ?
                            <img className='rounded-full  w-7 h-7 md:w-12 md:h-12 mx-auto ' src={`/images/${user[0]?.profile}`} alt="#" />
                            : <img className='rounded-full w-7 h-7 md:w-12 md:h-12 mx-auto' src={Profilepic} alt="yess" />
                    }
                </div>
                {
                    user &&

                    <h1 className="md:p-2 w-10 md:w-32 my-auto text-center md:text-start text-sm md:text-lg font-sm overflow-x-hidden mx-auto md:mx-0">{user[0]?.username}</h1>
                }
            </div>
        </div>
    )
}

export default Conversation
