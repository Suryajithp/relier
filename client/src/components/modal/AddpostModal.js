import { useContext, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { BiImageAdd } from 'react-icons/bi';
import { ModalContext } from '../../utilitis/Context';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddpostModal = () => {
    const { showmodal, setShowmodal } = useContext(ModalContext)
    const [formData, setFormData] = useState({ image: '', discription: ' ' })
    const [showimage, setshowImage] = useState('')

  const navigate = useNavigate()

    const chageModal = () => {
        setShowmodal(!showmodal)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const fileUpload = (e) => {
        const post = e.target.files[0]
        setFormData({
            ...formData,
            image: post
        })
        setshowImage(URL.createObjectURL(post))
    }

    const submit = (e) => {
        const Data = new FormData();
        for (let key in formData) {
            Data.append(key, formData[key])
        }
        const token = localStorage.getItem('user')
        var decoded = jwt_decode(token)
        Data.append('user', decoded.id)
        const { image, discription } = formData
        if (image || discription) {
            axios.post("http://localhost:4000/addpost", Data,{
                headers: {
                  "x-access-token": localStorage.getItem("user"),
                },
              })
                .then((response) => {
                    setShowmodal(!showmodal)
                }).catch((error) => {
                    navigate('/error')
                })
        } else {
            setShowmodal(!showmodal)
        }
    }
    return (
        <div>
            {
                <div className="bg-slate-800 bg-opacity-50 flex justify-center 
                 min-h-screen items-center absolute  top-0 right-0 bottom-0 left-0">
                    < CgClose className='right-8 top-5 absolute h-10 w-12 text-gray-100' onClick={chageModal} />
                    <div className='bg-white rounded-md w-11/12 md:w-9/12 lg:w-5/12 flex h-3/6'>
                        <div class=" w-full md:w-1/2 h-full  rounded-md text-center">
                            <div className="p-2 w-full h-fit rounded-md flex">
                                <h1 className="p-2 my-auto  text-lg font-semibold" >Create new Post</h1>
                            </div>
                            <div className=' p-5 my-auto h-5/6 w-full'>
                                {
                                    showimage ?
                                        <img className='w-11/12 h-5/6 mx-auto outline outline-4 outline-white ' src={showimage} alt="" /> :
                                        <BiImageAdd className='my-auto mt-3 h-20 w-full' />
                                }

                                <label class="w-fit flex flex-col items-center rounded-md text-blue-500 mt-4 mx-auto tracking-wide border
                                 border-blue-500 cursor-pointer hover:bg-blue-400 hover:text-white">

                                    <input type='file' onChange={(e) => fileUpload(e)} class="hidden" accept="image/*" />
                                    <span className='p-1  text-base font-mono'>Choose file</span>
                                </label>
                            </div>
                        </div>
                        <div className='w-0.5 h-[80%] my-auto bg-gray-200'></div>
                        <div class=" w-full md:w-1/2 h-full rounded-md text-center">
                            <div className=" w-full mt-10 h-[37%]  rounded-md">
                                <textarea type='text' className="p-2 h-full w-full text-base font-serif focus:outline-none"
                                    placeholder='Write your discription' name='discription' onChange={handleChange} />
                            </div>
                            <button className='p-1 mt-10 rounded-md bg-blue-400 text-white text-base font-mono' onClick={submit}>Submit</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AddpostModal