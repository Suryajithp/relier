import Profilepic from '../../assets/images.jpg'
import { FaRegComment, FaHeart } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { useContext, useEffect, useState } from 'react';
import { format } from 'timeago.js';
import axios from 'axios';
import { CommentContext, EditContext, friendContext, UserContext } from '../../utilitis/Context';
import Comment_modal from '../modal/Comment_modal';
import EditPost from '../modal/EditPost';
import { useNavigate } from 'react-router-dom';


const Body = ({ socket, user }) => {
    const { showCommentmodal, setShowCommentmodal } = useContext(CommentContext)
    const { editmodal, setEditmodal } = useContext(EditContext)
    const { friend, setFriend } = useContext(friendContext)
    const { usermodal, setusermodal } = useContext(UserContext)
    const [value, setValue] = useState(false);
    const [reportDetails, setReportDetails] = useState(false);
    const [dropdown, setDropdown] = useState({ status: false, data: null });
    const [data, setData] = useState([]);
    const [Suggetion, setSuggetion] = useState([]);
    const [userdata, setUserData] = useState('');
    const [postData, setPostData] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:4000/getallpost", {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        })
            .then((response) => {
                setData(response.data)
            }).catch((error) => {
                navigate('/error')
            })
    }, [value, editmodal])

    const commentUp = (e) => {
        setUserData(e)
        setShowCommentmodal(!showCommentmodal)
    }

    const like = (post) => {
        const userId = usermodal.id
        const postId = post._id
        const type = 1
        const likeData = { userId, postId }
        axios.post("http://localhost:4000/like", likeData, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then(async (res) => {
            setValue(!value)
            socket?.emit("sendNotification", {
                senderName: userId,
                receiverName: post.id,
                postId: postId,
                type
            })
            const receiverId = post.id
            const notificationData = { userId, postId, receiverId, type }
            const response = await axios.post("http://localhost:4000/notification", notificationData, {
                headers: {
                    "x-access-token": localStorage.getItem("user"),
                },
            })

        }).catch((error) => {
            navigate('/error')
        })
    }

    const unlike = (postId) => {
        const userId = usermodal.id
        const likeData = { userId, postId }
        axios.post("http://localhost:4000/like", likeData, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((res) => {
            setValue(!value)
        }).catch((error) => {
            navigate('/error')
        })
    }
    const editPost = (e) => {
        setPostData(e)
        setEditmodal(!editmodal)
        setDropdown({ status: !dropdown.status, data: null })
    }

    const report = (message) => {
        const userId = usermodal.id
        const postId = dropdown.data._id
        const reportData = { userId, postId, message }
        axios.post("http://localhost:4000/report", reportData, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((res) => {
            setValue(!value)
            setDropdown({ status: !dropdown.status, data: null })
            setReportDetails(!reportDetails)
        }).catch((error) => {
            navigate('/error')
        })
    }

    const deletePost = (postId) => {
        const id = { postId }
        axios.post("http://localhost:4000/deletepost", id, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((res) => {
            alert('post was deleted')
            setValue(!value)
            setDropdown({ status: !dropdown.status, id: null })
        }).catch((error) => {
            navigate('/error')
        })
    }

    const ckeck = (data) => {
        return data.userId === usermodal.id
    }

    const friendProfile = (UserId) => {
        if (UserId === usermodal.id) {
            navigate('/userprofile')
        } else {
            setFriend(UserId)
            navigate('/friendprofile')
        }
    }

    useEffect(() => {
        const userId = usermodal.id

        if (userId) {

            axios.get("http://localhost:4000/getsuggestion/" + userId, {
                headers: {
                    "x-access-token": localStorage.getItem("user"),
                },
            })
                .then((response) => {
                    setSuggetion(response.data)
                }).catch(() => {
                    navigate('/error')
                })
        }

    }, [usermodal])

    return (

        <div className="flex justify-center mt-4 h-auto  max-h-screen ">
            <div className="w-full md:w-11/12 lg:w-8/12 flex justify-between">
                <div className="w-4/12 h-72 hidden md:block p-2 top-24 bg-white rounded-md shadow-md">
                    <div className='h-12 w-full rounded-md'>
                        <h1 className=' text-lg font-semibold'>Suggestion for you</h1>
                    </div>
                    <div className='overflow-y-scroll scrollbar-hide h-5/6'>
                        {
                            Suggetion?.map((item) => (
                                <>{
                                    item.userData._id !== usermodal.id &&

                                    <div className='flex w-full rounded hover:bg-gray-200 p-2' onClick={() => friendProfile(item.userData._id)}>
                                        {
                                            item?.userData.profile != null ?
                                                <img className='w-12 h-12 rounded-full object-cover' src={`/images/${item?.userData.profile}`} alt="#" />
                                                :
                                                <img className='w-12 h-12 rounded-full object-cover' src={Profilepic} alt="yess" />
                                        }
                                        <div className='flex justify-between w-full'>
                                            <div className="p-2 my-auto text-lg font-semibold ">{item.userData.username}</div>
                                            <button className="px-3 my-auto text-lg  rounded-3xl font-semibold text-blue-400">View</button>
                                        </div>
                                    </div>
                                }
                                </>
                            ))
                        }
                    </div>
                </div>
                <div className="w-11/12 md:w-6/12 min-h-[50vh] mx-auto">
                    <div className='h-[95%] overflow-y-scroll scrollbar-hide'>
                        {
                            data.map((item, index) => {
                                return (

                                    <div className="w-full mb-3 shadow-md  bg-white rounded-md  " >
                                        <div className="p-2 pb-0 w-full h-fit rounded-md flex justify-between">
                                            <div className='flex'>
                                                <div className="w-12 h-12 rounded-full border-2 p-[2px] border-slate-300">
                                                    {
                                                        item?.profile != null ?
                                                            <img className='rounded-full object-cover' src={`/images/${item?.profile}`} alt="#" />
                                                            :
                                                            <img className='rounded-full object-cover' src={Profilepic} alt="yess" />
                                                    }
                                                </div>
                                                <div className="p-2 my-auto text-base font-bold text-gray-700 ">{item.username}</div>
                                            </div>
                                            <div className=' flex justify-end relative'>
                                                <h1 className='text-xl mr-5 text-gray-500 my-auto text-end' onClick={() => setDropdown({ status: !dropdown.status, data: item })}><BsThreeDots /></h1>
                                                {dropdown.status && dropdown.data._id === item._id && (dropdown.data.id === usermodal.id ?
                                                    <div className='w-32 h-15 border shadow-lg absolute bg-white border-gray-400 rounded mt-10 right-0'>
                                                        <p className='w-full my-2  text-center font-normal text-gray-600 cursor-pointer' onClick={e => editPost(item._id)} >Edit</p>
                                                        <hr />
                                                        <p className='w-full my-2  text-center font-normal text-red-400 cursor-pointer' onClick={e => deletePost(item._id)} >Delete</p>
                                                    </div> :

                                                    dropdown.data.report.some(ckeck) ? <h1></h1> : (
                                                        <div className='w-24 h-10 border shadow-lg absolute bg-white border-gray-400 rounded mt-10 right-0'>
                                                            <p className='w-full my-2  text-center font-semibold text-gray-500 cursor-pointer' onClick={e => setReportDetails(!reportDetails)} >Report</p>
                                                        </div>)
                                                )}
                                            </div>
                                            {reportDetails &&
                                                <div className="overflow-y-auto fixed top-0 right-0 left-0 bg-slate-800 bg-opacity-10  h-modal  md:h-full justify-center items-center">
                                                    <div class="relative mx-auto mt-36 w-full max-w-sm h-full md:h-auto">
                                                        <div class="relative bg-white  m-2 rounded-lg shadow-md ">
                                                            <div className=" my-auto py-2 text-center text-gray-600 text-lg font-semibold">Why are you reporting this post?</div>
                                                            <hr />
                                                            <button type="button" class="absolute top-2 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal" onClick={() => setReportDetails(false)}>
                                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                                <span class="sr-only">Close modal</span>
                                                            </button>
                                                            <div class="p-6 pt-2  w-full">
                                                                <div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('It is a scam')}>It is a scam</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('Violence or dangerous signal')}>Violence or dangerous signal</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('Sale of illegal goods')}>Sale of illegal goods</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('Bullying or harrassment')}>Bullying or harrassment</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('Suicide or life injury')}>Suicide or life injury</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('False information')}>False information</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('Fraud contents')}>Fraud contents</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                    <div className='flex mt-2 p-1 w-full'>
                                                                        <div className='w-full'>
                                                                            <h1 class=" text-base font-normal cursor-pointer text-black w-full" onClick={() => report('I just dont like this')}>I just dont like this</h1>
                                                                        </div>
                                                                        <AiOutlineDoubleRight className=' mr-0' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <hr className='m-1' />
                                        <div className="p-2 pt-0 my-auto text-md font-sans">{item.discription}</div>
                                        <div className="mx-2 bg-slate-200">
                                            <img alt='#' src={`/images/${item.post}`} className="h-auto max-h-[560px] object-cover w-auto mx-auto" />
                                        </div>
                                        <div className=" w-full h-12 pb-2 flex " >
                                            {item.like.includes(usermodal.id) ? <FaHeart onClick={(e) => { unlike(item._id) }} className=" m-3 mr-0 h-5  w-5 my-auto " color='red' /> : <FaHeart onClick={(e) => { like(item) }} className=" m-3 mr-0 h-5  w-5 my-auto " color='gray' />}<h1 className='my-auto mx-2'>{item.like.length}</h1>
                                            <FaRegComment className=" m-3 mr-0 h-5  w-5 my-auto" onClick={(e) => { commentUp(item) }}></FaRegComment>
                                        </div>
                                        <h1 className='p-3 text-xs text-gray-500'> {format(item.date)}</h1>

                                    </div>
                                )
                            }
                            )}
                        <div className="w-full mt-3 mb-24 shadow-md  bg-white rounded-md">
                            <div className="p-2 w-full h-fit rounded-md flex">
                                <div className="p-2 my-auto mx-auto text-lg text-sky-400 font-semibold capitalize ">the end</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                showCommentmodal && (<Comment_modal userdata={userdata} socket={socket} user={user} />)
            }

            {
                editmodal && (<EditPost postid={postData} />)
            }
        </div>

    )
}

export default Body
