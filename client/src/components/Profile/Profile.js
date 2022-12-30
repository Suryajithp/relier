import Profilepic from '../../assets/images.jpg'
import coverImg from '../../assets/kristina-tripkovic-8Zs5H6CnYJo-unsplash.jpg'
import { useContext, useEffect, useState } from 'react'
import axios from '../../AxiosInstance'; 
import { CommentContext, FollowContext, UserContext } from '../../utilitis/Context';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Comment_modal from '../modal/Comment_modal';
import { FaHeart } from 'react-icons/fa';
import FollowModal from '../modal/FollowModal';

const Profile = () => {

  const { usermodal, setusermodal } = useContext(UserContext)
  const { followmodal, setFollowmodal } = useContext(FollowContext)
  const { showCommentmodal, setShowCommentmodal } = useContext(CommentContext)

  const [data, setData] = useState([]);
  const [followdata, setFollowData] = useState('');
    const [status, setStatus] = useState(true);
    const [frienddata, setfriendData] = useState('');
  const [userdata, setUserData] = useState('');

  const navigate = useNavigate()

  const getUserDetails = () => {

    const token = localStorage.getItem('user')
    let decoded = jwt_decode(token)
    axios.get("/getuserpost/" + decoded.id,{
      headers: {
        "x-access-token": localStorage.getItem("user"),
      },
    })
      .then((response) => {
        setData(response.data)
      }).catch((error) => {
        navigate('/error')
      })
    axios.get("/checkfollow/" + decoded.id,{
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

  useEffect(() => {
    getUserDetails()
  }, [usermodal])

  const EditProfile = () => {
    navigate('/editProfile')
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
        <div className='w-full mt-[-2%] flex justify-end'>
          <button className='w-fit bg-white h-full p-0.5 rounded-lg text-center border-gray-300 border' onClick={EditProfile}>Edit profile</button>
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