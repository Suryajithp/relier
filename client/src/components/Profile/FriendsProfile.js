import Profilepic from '../../assets/images.jpg'
import coverImg from '../../assets/kristina-tripkovic-8Zs5H6CnYJo-unsplash.jpg'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { CommentContext, FollowContext, friendContext, UserContext } from '../../utilitis/Context';
import { useNavigate } from 'react-router-dom';
import Comment_modal from '../modal/Comment_modal';
import { FaHeart } from 'react-icons/fa';
import FollowModal from '../modal/FollowModal';

const Profile = () => {

    const { friend, setFriend } = useContext(friendContext)
    const { usermodal, setusermodal } = useContext(UserContext)
    const { followmodal, setFollowmodal } = useContext(FollowContext)
    const { showCommentmodal, setShowCommentmodal } = useContext(CommentContext)


    const [data, setData] = useState([]);
    const [followdata, setFollowData] = useState('');
    const [frienddata, setfriendData] = useState('');
    const [value, setvalue] = useState(true);
    const [status, setStatus] = useState(true);
    const [userdata, setUserData] = useState('');
    

    const navigate = useNavigate()

    const getUserDetails = () => {

        if (!friend) {
            navigate('/home')
        } else {
            axios.get("http://localhost:4000/getuserpost/" + friend,{
                headers: {
                  "x-access-token": localStorage.getItem("user"),
                },
              })
                .then((response) => {
                    setData(response.data)
                }).catch((error) => {
                    navigate('/error')
                })
            const friendId = friend
            axios.get("http://localhost:4000/checkfollow/" + friendId,{
                headers: {
                  "x-access-token": localStorage.getItem("user"),
                },
              })
                .then((response) => {
                    setFollowData(response.data)
                }).catch((error) => {
                    navigate('/error')
                })
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [friend, value])

    const Follow = () => {
        const friendId = friend
        const userId = usermodal.id
        const followData = {
            friendId, userId
        }
        axios.post("http://localhost:4000/follow", followData,{
            headers: {
              "x-access-token": localStorage.getItem("user"),
            },
          }).then(() => {
            setvalue(!value)
        }).catch((error) => {
            navigate('/error')
        })
    }
    const openModal = (e) => {
        setUserData(e)
        setShowCommentmodal(!showCommentmodal)
    }

    const followFriend = (e) => {
        if (e === 1) {
            setfriendData(followdata[0]?.followers)
            setStatus(true)
        } else {
            setfriendData(followdata[0]?.following)
            setStatus(false)
        }
        setFollowmodal(true)
    }

    const message= async ()=>{
       const receiverId=data[0]?.id
       const senderId=usermodal.id
       const details ={senderId,receiverId}
        axios.post("http://localhost:4000/conversations/check", details).then(async(res) => {
            if(!res.data.length>0){
            const messageId = await  axios.post("http://localhost:4000/conversations",details,{
                headers: {
                  "x-access-token": localStorage.getItem("user"),
                },
              })
            if(messageId){
            }
            }
                navigate('/chat')
        }).catch((error) => {
            navigate('/error')
        })
    }

    const ckeck = (data)=>{
        return data._id === usermodal.id
    }

    return (

        <div className='w-full mt-4 md:w-10/12 lg:w-7/12 h-auto max-h-[660px] p-5 mx-auto rounded-sm bg-white overflow-y-scroll scrollbar-hide'>
            <div className=' w-11/12 mx-auto'>
                <img className='rounded-md w-full h-auto z-0 ' src={coverImg} alt="" />
                {
                    data[0]?.profile != null ?
                        <img className='rounded-full w-3/12 md:w-2/12 h-auto mt-[-8%] mx-auto md:ml-10 outline outline-4 outline-white ' src={`/images/${data[0]?.profile}`} alt="" />
                        :
                        <img className='rounded-full w-3/12 md:w-2/12 h-auto mt-[-8%] mx-auto md:ml-10 outline outline-4 outline-white ' src={Profilepic} alt="yess" />
                }
                <div className='w-full mt-[-2%] flex justify-between md:justify-end'>
                    <button className=' w-fit h-full md:mr-3 px-3 py-1 rounded hover:bg-blue-400 hover:text-white border text-right text-base my-auto text-blue-400 font-mono'
                    onClick={message}>message</button>
                    {
                        followdata[0]?.followers.some(ckeck) ?
                    <button className='w-fit h-full px-2 py-1  bg-white rounded text-gray-500 font-semibold text-center border-gray-300 border' onClick={Follow}>Unfollow</button>
                    : <button className='w-fit h-full px-4 py-1 bg-blue-400 rounded hover:bg-blue-500 font-semibold text-white text-center border-gray-300 border' onClick={Follow}>Follow</button>
                    }

                </div>
                <h1 className=' w-3/12 md:w-2/12 mx-auto md:ml-10 text-center text-lg font-mono'>{data[0]?.username}</h1>
            </div>
            <div className='w-8/12 ml-12 mt-5 text-lg text-gray-600 font-serif'>{data[0]?.bio}</div>
            <div className=' h-16 p-4 w-full flex justify-center gap-10 md:gap-20'>
                <p className='w-auto h-full p-0.5 rounded-lg text-center text-cyan-600' onClick={(e) => followFriend(1)}><span className='font-semibold text-black'>
                    {followdata[0]?.followers.length}</span> Followers</p>

                <p className='w-auto h-full p-0.5 rounded-lg text-center text-cyan-600' onClick={(e) => followFriend(0)}><span className='font-semibold text-black'>
                    {followdata[0]?.following.length}
                </span> Following</p>
            </div>
            <h1 className='w-full text-center text-lg font-mono'>posts</h1>
            <hr className='w-5/12 mx-auto m-1 bg-black'></hr>
            <div className='w-10/12 mx-auto m-5 grid grid-cols-3 gap-1 md:gap-4'>
                {
                    data.map((item) => (
                        <div className='w-full relative' onClick={e => openModal(item._id)} >
                            <img className='rounded-sm w-full h-28 sm:36 lg:h-56 ' src={`/images/${item.post}`} alt="#" />
                            <div className='group/item hover:bg-slate-800 hover:bg-opacity-50 flex justify-center items-center absolute
                                top-0 right-0 bottom-0 left-0 text-white text-lg '>
                                <div className=' rounded-md w-5/12 md:w-3/12  group/edit invisible  group-hover/item:visible'>
                                    <h1 className="text-start text-white flex"><FaHeart className='my-auto mx-2' />{item.like.length}</h1>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                followmodal && (<FollowModal props={frienddata} status={status} />)
            }
            {
                showCommentmodal && (<Comment_modal userdata={userdata} />)
            }
        </div>
    )
}

export default Profile