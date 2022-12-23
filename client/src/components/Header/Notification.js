import axios from 'axios';
import React, { useEffect } from 'react'
import Profilepic from '../../assets/images.jpg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = ({ usersData }) => {

    const [data, setData] = useState(null)
    const [action, setAction] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const userId = usersData.userId
        const type = usersData.type
        if (type === 1) {
            setAction("liked")
        } else {
            setAction("comment on")
        }

        axios.get("http://localhost:4000/editProfile/" + userId, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((res) => {
            setData(res.data)
        }).catch(() => {
            navigate('/error')
        })

    }, [usersData])
    return (
        <div className=' bg-white mt-2'>
            {
                <div className='flex p-1 w-80 '>
                    {
                        data?.profile != null ?
                            <img className='rounded-full w-10 h-10 ml-2 object-cover' src={`/images/${data?.profile}`} alt="#" />
                            :
                            <img className='rounded-full w-10 h-10 ml-2 object-cover' src={Profilepic} alt="yess" />
                    }
                    <h1 className='text-lg ml-2 font-semibold text-gray-900 text-center my-auto'>{data?.username} </h1>
                    <h1 className='text-base ml-2 font-normal text-gray-700 text-center my-auto overflow-x-hidden'>{action} your post</h1>
                </div>
            }
        </div>
    )
}

export default Notification
