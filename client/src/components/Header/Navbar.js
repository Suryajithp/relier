import axios from '../../Axios/AxiosInstance';
import { useContext, useEffect, useState } from 'react';
import { FaBell, FaFacebookMessenger, FaHome, FaPlus } from 'react-icons/fa';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Profilepic from '../../assets/images.jpg';
import logoImg from '../../assets/logo.jpg';
import { ModalContext, SearchContext, UserContext } from '../../utilitis/Context';
import AddpostModal from '../modal/AddpostModal';
import SearchModal from '../modal/SearchModal';
import Notification from './Notification';


const Navbar = ({ socket }) => {
    const navigate = useNavigate()
    const { showmodal, setShowmodal } = useContext(ModalContext)
    const { usermodal, setusermodal } = useContext(UserContext)
    const { searchmodal, setSearchmodal } = useContext(SearchContext)
    const [searchData, setSearchData] = useState([])
    const [data, setData] = useState(null)
    const [dropdown, setDropDown] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [notificationsStatus, setNotificationsStatus] = useState(false)
    const [chatnotifications, setChatNotifications] = useState('')
    const [open, setOpen] = useState(false)



    useEffect(() => {
        const token = localStorage.getItem('user')
        let decoded = jwt_decode(token)
        setusermodal(decoded)

        axios.get("/editProfile/" + decoded.id, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((res) => {
            setData(res.data)
        }).catch(() => {
            navigate('/error')
        })
    }, [])

    const logout = () => {
        localStorage.removeItem("user")
        navigate('/')
    }
    const dropDown = () => {
        setDropDown(!dropdown)
    }
    const Profile = () => {
        navigate('/userprofile')
    }
    const chat = () => {
        navigate('/chat')
    }
    const chageModal = () => {
        setShowmodal(!showmodal)
    }
    const Home = () => {
        navigate('/home')
    }
    const serchModal = (e) => {
        const data = e.target.value
        if (data) {
            axios.get('/getsearch/' + data, {
                headers: {
                    "x-access-token": localStorage.getItem("user"),
                },
            }).then((response) => {
                setSearchData(response.data)
            })
            setSearchmodal(true)
        } else {
            setSearchmodal(false)
        }

    }

    useEffect(() => {
        socket?.on('getMessageNotification', data => {
            setChatNotifications(data)
        })
    }, [socket])

    useEffect(() => {
        socket?.on('getNotification', data => {
            setNotificationsStatus(!notificationsStatus)
        })
    }, [socket])

    useEffect(() => {
        const userId = usermodal.id
        if (userId) {
            axios.get('/getNotification/' + userId, {
                headers: {
                    "x-access-token": localStorage.getItem("user"),
                },
            }).then((res) => {
                if (res.data.notification) {
                    let data = res.data.notification.reverse()
                    setNotifications(data)
                } else {
                    setNotifications([])
                }
            }).catch((error) => {
                navigate('/error')
            })
        }
    }, [usermodal, socket, open])

    const handleModal = () =>{
        setNotificationsStatus(!notificationsStatus)
        setOpen(!open)
    }
    return (
        <div className=' flex justify-center place-content-center h-20 w-full sticky top-0  bg-white '>
            <div className='w-10/12 sm:w-8/12 h-14 flex my-auto justify-between  bg-white '>
                <div className=' bg-white w-2/12 text-start my-auto'>
                    <img src={logoImg} alt='#' className='w-32' onClick={Home} ></img>
                </div>
                <div className='hidden md:block  md:w-4/12 my-auto'>
                    <input type='search' className='bg-gray-200 rounded-xl p-3 text-gray-400 h-10 my-auto focus:outline-none focus:text-gray-800'
                        placeholder='Search...'
                        onChange={(e) => serchModal(e)} />

                </div>
                <div className='text-2xl w-7/12 md:w-5/12 my-auto flex justify-end'>
                    <div className='grid grid-cols-4 gap-4 place-items-center my-auto text-xl w-10/12 text-center'>
                        <div className='text-xl  text-center hover:text-sky-500'><FaHome onClick={Home} /></div>
                        <div className='text-xl  text-center hover:text-sky-500'><FaPlus onClick={chageModal} /></div>
                        <div className='text-xl flex text-center '>
                            <FaFacebookMessenger className='my-auto hover:text-sky-500' onClick={chat} />
                            {chatnotifications &&
                                <h1 className='ml-[-5px] text-xs text-white text-center font-bold w-2 h-2 bg-cyan-600 rounded-full'></h1>
                            }
                        </div>
                        <div className='text-xl flex text-center '>
                            <FaBell className='my-auto hover:text-sky-500' onClick={() => setOpen(!open)} />
                            {notificationsStatus &&
                                <h1 className='ml-[-8px] text-xs text-white text-center font-bold w-2 h-2 bg-cyan-600 rounded-full'></h1>
                            }
                        </div>
                    </div>
                </div>

                <div className='w-min-10 bg-white grid place-items-center' onClick={dropDown}>
                    {
                        data?.profile != null ?
                            <img className='rounded-full  w-10 object-cover' src={`${axios.images}/images/${data?.profile}`} alt="#" />
                            :
                            <img className='rounded-full  w-10 object-cover' src={Profilepic} alt="#" />
                    }
                </div>
            </div>
            {
                dropdown && (
                    <div className='w-32 h-20 border shadow-lg absolute bg-white rounded mt-16 right-[14%]'>
                        <p className='w-full mt-2  text-center font-normal text-slate-500 cursor-pointer' onClick={Profile}>Profile</p>
                        <p className='w-full mt-2  text-center font-normal text-slate-500 cursor-pointer' onClick={logout}>Log Out</p>
                    </div>
                )
            }

            {open && (notifications.length > 0 ?
                <div className='absolute top-0 sm:left-[13%] sm:right-[16%] h-screen bg-transparent' onClick={handleModal}>
                    <div className=' my-16 ml-auto w-fit h-56  bg-white p-1 border rounded z-50 overflow-y-scroll scrollbar-hide'>
                        <h1 className='text-base font-semibold w-fit mx-auto '>Notifications</h1>
                        <hr />
                        {
                            notifications.map((n) => (
                                <Notification usersData={n} />
                            ))
                        }
                    </div>
                </div>
                : <div className='absolute top-0 left-[13%] right-[16%] h-screen bg-transparent' onClick={() => setOpen(!open)}>
                    <div className=' my-16 ml-auto w-fit h-56 bg-white p-1 border rounded z-50'>
                        <h1 className='text-base font-semibold w-fit mx-auto'>Notifications</h1>
                        <hr />
                        <div className='flex h-40 '>
                            <h1 className='text-sm w-80 font-normal text-center my-auto p-1'>no notifications</h1>
                        </div>
                    </div>
                </div>)
            }

            {showmodal && (<AddpostModal />)}
            {searchmodal && (<SearchModal searchData={searchData} />)}
        </div>

    )
}

export default Navbar