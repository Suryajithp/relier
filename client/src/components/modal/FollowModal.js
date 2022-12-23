import React, { useContext } from 'react'
import Profilepic from '../../assets/images.jpg'
import { CgClose } from 'react-icons/cg'
import { FollowContext, friendContext, UserContext } from '../../utilitis/Context'
import { useNavigate } from 'react-router-dom'

const FollowModal = (Props) => {

    const { props, status } = Props
    const { friend, setFriend } = useContext(friendContext)
    const { usermodal, setusermodal } = useContext(UserContext)
    const { followmodal, setFollowmodal } = useContext(FollowContext)

    const navigate= useNavigate()

    const close = () => {
        setFollowmodal(!followmodal)
    }

    const friendProfile=(UserId)=>{
        if(UserId===usermodal.id){
            navigate('/userprofile')
            setFollowmodal(!followmodal)
        }else{
            setFriend(UserId)
            navigate('/friendprofile')
            setFollowmodal(!followmodal)
        }
    }

    return (
        <div className="bg-slate-600 bg-opacity-50 
                           max-h-screen absolute top-0 right-0 bottom-0 left-0" >
            <div className='h-60 w-72  mx-auto my-60 p-2 bg-white rounded-md '>
                <div className='h-fit flex border-b-2 p-1 w-full'>
                    {status===true ?
                        <h1 className='text-base font-semibold'>Followers</h1> : <h1 className='text-base font-semibold'>Following</h1>
                    }
                    <CgClose className='ml-auto h-5 w-5 text-gray-600' onClick={close} />
                </div>
                <div className='h-44 overflow-y-scroll scrollbar-hide p-2'>
                    {
                        props.length > 0 ?
                            props.map((item) => (
                                <div className='flex h-12 my-1 cursor-pointer gap-2'  onClick={e=>friendProfile(item._id)}>
                                    
                                    <div className="w-12  rounded-full flex border-2  border-slate-300">
                                        {
                                            item?.profile != null ?
                                                <img className='rounded-full w-12   h-auto mx-auto outline outline-4 outline-white ' src={`/images/${item?.profile}`} alt="#" />
                                                :
                                                <img className='rounded-full w-12   h-auto mx-auto outline outline-4 outline-white ' src={Profilepic} alt="yess" />
                                        }
                                    </div>
                                    <h1 className="p-2 my-auto text-lg font-sm ">{item.username}</h1>
                                </div>
                            ))
                            :
                            <h1 className="p-2 my-auto text-center text-lg font-sm ">No Result found</h1>
                    }

                </div>
            </div>
        </div>
    )
}

export default FollowModal