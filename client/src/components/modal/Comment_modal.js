import axios from '../../Axios/AxiosInstance';
import { useContext, useEffect, useState } from 'react'
import { CgClose } from 'react-icons/cg';
import Profilepic from '../../assets/images.jpg'
import { format } from 'timeago.js';
import { CommentContext, UserContext } from '../../utilitis/Context';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


const Comment_modal = ({ userdata, socket, user }) => {

    const { showCommentmodal, setShowCommentmodal } = useContext(CommentContext)
    const { usermodal, setusermodal } = useContext(UserContext)

    const navigate = useNavigate()

    const [value, setValue] = useState(true);
    const [modaldata, setModalData] = useState([]);
    const [postmodaldata, setPostModalData] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const commentUp = (e) => {
        axios.get("/getpost/" + e, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((responce) => {
            setPostModalData(responce.data)
        }).catch((error) => {
            navigate('/error')
        })
        axios.get("/getComments/" + e, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        })
            .then((responce) => {
                setModalData(responce.data)
            }).catch((error) => {
                navigate('/error')
            })
    }

    useEffect(() => {
        commentUp(userdata._id)
    }, [value])

    const sendComment = (e) => {
        const userId = usermodal.id
        const comment = e.comment
        const type = 2
        const postId = postmodaldata._id
        const post = userdata.id
        const comments = { comment, userId, postId }
        if (comment) {

            axios.post("/comment", comments, {
                headers: {
                    "x-access-token": localStorage.getItem("user"),
                },
            }).then(async(res) => {
                socket?.emit("sendNotification", {
                    senderName: user,
                    receiverName: post,
                    postId:postId,
                    type
                })

                const receiverId = post
        const notificationData = { userId, postId,receiverId ,type }
          const response = await axios.post("/notification", notificationData, {
                headers: {
                    "x-access-token": localStorage.getItem("user"),
                },
            })
                setValue(!value)
                reset()
            }).catch((error) => {
                navigate('/error')
            })
        } else {
            console.log("no comment");
        }

    }
    const toggleModal = () => {
        setShowCommentmodal(!showCommentmodal)
    }
    return (
        <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            < CgClose className='right-8 top-5 absolute h-10 w-12 text-gray-100' onClick={toggleModal} />
            <div className=' rounded-md w-11/12 md:w-10/12 lg:w-7/12 flex h-[60%] lg:h-[70%]'>
                <div className='hidden md:block w-1/2'>
                    <img alt='#' className='w-auto h-full object-cover ml-auto' src={`${axios.images}/images/${postmodaldata.post}`}></img>
                </div>
                <div class=" w-full md:w-1/2 h-full bg-white rounded-md text-center">
                    <div className="p-2 w-full h-[10%] rounded-md flex">
                        <div className=" my-auto text-lg font-semibold">Comments</div>
                    </div>
                    <div className=' border border-y-10 w-full mx-auto h-[80%] overflow-y-scroll scrollbar-hide'>
                        {
                            modaldata.length > 0 ?
                                modaldata.map((item) => (
                                    <div className='m-2 '>
                                        <div className=" w-fit flex h-fit rounded-md ">
                                            <div className="w-10 h-10 rounded-full border-2 p-[2px] border-slate-300">
                                                {
                                                    item?.profile != null ?
                                                        <img className='rounded-full object-cover' src={`${axios.images}/images/${item?.profile}`} alt="" />
                                                        :
                                                        <img className='rounded-full object-cover' src={Profilepic} alt="yess" />
                                                }
                                            </div>
                                            <div className=" text-base text-gray-900 h-full my-auto mx-2 font-semibold text-start ">{item.userName}</div>
                                        </div>
                                        <div className='mx-8 rounded-md bg-gray-100'>
                                            <div className=' p-2 rounded-md bg-gray-100 my-auto text-left text-sm text-gray-900 w-auto '>{item.message}</div>

                                            <div className="m-2 text-xs text-gray-500 font-mono text-end"> {format(item.time)}</div>
                                        </div>
                                    </div>
                                )) : <h1>No comments</h1>
                        }
                    </div>
                    <div className='h-[10%] '>
                        <div className='my-auto w-11/12 h-full  mx-auto'>
                            <form className='flex my-auto w-full h-full justify-between mx-auto' onSubmit={handleSubmit(sendComment)}>
                                <input className='bg-gray-200 w-full rounded-xl p-2 text-gray-600 h-10 my-auto focus:outline-none'
                                    name='comment' placeholder='Write comment...'
                                    {...register("comment", {
                                        required: "comment Required",
                                        pattern: {
                                            value: /^\S/,
                                            message: "invalid comment "
                                        }
                                    })} />
                                <button type="submit" className='p-2 text-blue-400 h-10 my-auto'>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment_modal