import axios from '../../Axios/AxiosInstance';
import Profilepic from '../../assets/images.jpg'
import { useEffect, useState } from 'react'
import { format } from 'timeago.js';
import { useNavigate } from 'react-router-dom';

const Message = ({ message,own}) => {

    const [data, setData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("/editProfile/" + message.sender,{
            headers: {
              "x-access-token": localStorage.getItem("user"),
            },
          }).then((response) => {
            setData(response.data)
        }).catch(()=> navigate('/error'))

    }, [message])


    return (
        <div>
            <div className="chat-message">
                <div className={own ? "flex  justify-end items-end" : "flex items-end"}>
                    <div className={own ? "flex flex-col text-xs max-w-xs mx-2 order-1 items-end"
                        : "flex flex-col  text-xs max-w-xs mx-2 order-2 items-start"}>
                        <div>{own ?
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message.text}</span>
                            : <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message.text}</span>
                        }
                        </div>
                        <div className='m-0 text-xs'>{format(message.createdAt)}</div>
                    </div>
                    {
                        data?.profile != null ?
                            <img className="w-6 h-6 rounded-full order-1 my-auto" src={`${axios.images}/images/${data?.profile}`} alt="#" />
                            :
                            <img className="w-6 h-6 rounded-full order-1 my-auto" src={Profilepic} alt="yess" />
                    }
                </div>
            </div>
        </div>
    )
}

export default Message