import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Profilepic from '../../assets/images.jpg'
import axios from '../../Axios/AxiosInstance';
import { friendContext, SearchContext, UserContext } from '../../utilitis/Context';

const SearchModal = ({ searchData }) => {

    const { friend, setFriend } = useContext(friendContext)
    const { usermodal, setusermodal } = useContext(UserContext)
    const {searchmodal,setSearchmodal}= useContext(SearchContext)


    const navigate= useNavigate()

    const friendProfile=(UserId)=>{
        if(UserId===usermodal.id){
            navigate('/userprofile')
            setSearchmodal(!searchmodal)
        }else{
            setFriend(UserId)
            navigate('/friendprofile')
            setSearchmodal(!searchmodal)
        }
    }
    return (
        <div>
            {
                <div className="hidden md:block bg-slate-600 bg-opacity-50 
                            min-h-screen absolute  top-20 right-0 bottom-0 left-0" >
                    <div className='h-56 w-80 mx-[27%] mt-1 bg-white rounded-md p-5 overflow-y-scroll scrollbar-hide'>
                        {
                            searchData.length > 0 ?
                                searchData.map((item, index) => (
                                    <div className='flex h-12 my-1 cursor-pointer' onClick={e=>friendProfile(item._id)} >
                                        <div className="w-12  rounded-full flex border-2  border-slate-300">
                                            {
                                                item?.profile != null ?
                                                    <img className='rounded-full w-12   h-auto mx-auto outline outline-4 outline-white ' src={`${axios.images}/images/${item?.profile}`} alt="#" />
                                                    :
                                                    <img className='rounded-full w-12   h-auto mx-auto outline outline-4 outline-white ' src={Profilepic} alt="yess" />
                                            }
                                        </div>
                                        <h1 className="p-2 my-auto text-lg font-sm ">{item.username}</h1>
                                    </div>
                                )) :
                                <h1 className="p-2 my-auto text-center text-lg font-sm ">No Result found</h1>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default SearchModal