import axios from '../../Axios/AxiosInstance';
import { useContext, useEffect, useState } from 'react';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import postimgTwo from '../../assets/images.jpg'
import { UserContext } from '../../utilitis/Context';

const EditProfile = () => {

    const { usermodal, setusermodal } = useContext(UserContext)
    const navigate = useNavigate()
    const [data, setData] = useState(false)
    const [image, setImage] = useState('')
    const [showimage, setshowImage] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const userDetails = () => {
        axios.get("/editProfile/" + usermodal.id, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((response) => {
            setData(response.data)
            setImage(response.data.profile)
        })

    };


    useEffect(() => {
        userDetails()
    }, [])

    const fileUpload = (e) => {
        const post = e.target.files[0]
        setImage(post)
        setshowImage(URL.createObjectURL(post))
    }

    const Submit = (e) => {
        const userId = usermodal.id
        e = { ...e, userId: userId, profile: image }
        const Data = new FormData();
        for (let key in e) {
            Data.append(key, e[key])
        }
        const { email, username } = e
        if (email && username) {
            axios.post("/editProfile", Data, {
                headers: {
                    "x-access-token": localStorage.getItem("user"),
                },
            })
                .then((response) => {
                    navigate('/userprofile')
                }).catch((error) => {
                    navigate('/error')
                })
        } else {
            navigate('/error')
        }
    }

    return (
        <div className='w-full mt-4 md:w-10/12 lg:w-7/12 h-auto max-h-[90%] p-5 mx-auto rounded-sm bg-white overflow-y-scroll scrollbar-hide'>
            <div className='w-10/12 mb-10 mx-auto h-full'>
                <form className="mt-6" onSubmit={handleSubmit(Submit)}>
                    {
                        showimage ?
                            <img className='rounded-full w-3/12 md:w-2/12 h-auto mt-3 mx-auto outline outline-4 outline-white ' src={showimage} alt="" /> :
                            data.profile != null ?
                                <img className='rounded-full w-3/12 md:w-2/12 h-auto mt-3 mx-auto outline outline-4 outline-white ' src={`${axios.images}/images/${data?.profile}`} alt="" /> :

                                <img className='rounded-full w-3/12 md:w-2/12 h-auto mt-3 mx-auto outline outline-4 outline-white ' src={postimgTwo} alt="" />
                    }

                    <div className="block w-3/12 mx-auto">
                        <label htmlFor="ImageUpload" className=' text-white rounded-md '><MdOutlineAddAPhoto color='gray' className='h-8 w-8 mx-auto' /></label>
                        <input type="file" name='image' className='hidden' defaultValue={data.profile} onChange={(e) => fileUpload(e)} id="ImageUpload" />
                    </div>
                    <div className='m-5 w-full h-full mx-auto flex flex-col '>
                        <h1 className='text-lg my-auto font-serif text-gray-800 sm:mx-10'>User Name :</h1>
                        <input id='username' name="username" className='p-2 w-10/12 mx-auto bg-gray-100 m-3 rounded focus:outline-cyan-200'
                            {...register("username", { required: "user name Required" })} defaultValue={data.username} />
                        {errors.username && (<span className='text-red-500 ml-auto md:mr-16'>{errors.username.message}</span>)}
                        <h1 className='text-lg my-auto font-serif text-gray-800 sm:mx-10'>Email :</h1>
                        <input id='email' name="email" className='p-2 w-10/12 mx-auto bg-gray-100 m-3 rounded focus:outline-cyan-200'
                            {...register("email", {
                                required: "Email Required",
                                pattern: {
                                    value: /^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/,
                                    message: "invalid Email Address"
                                }
                            })} defaultValue={data.email} />
                        {errors.email && (<span className='text-red-500 ml-auto md:mr-16'>{errors.email.message}</span>)}
                        <h1 className='text-lg my-auto font-serif text-gray-800 sm:mx-10'>Bio :</h1>
                        <input id='bio' name='bio' className='p-2 w-10/12 mx-auto bg-gray-100 m-3 rounded focus:outline-cyan-200'
                            {...register("bio", { required: "user" })} Value={data.bio} />
                        <h1 className='text-lg my-auto font-serif text-gray-800 sm:mx-10'>Place :</h1>
                        <input id='place' name='place' className='p-2 w-10/12 mx-auto bg-gray-100 m-3 rounded focus:outline-cyan-200'
                            {...register("place", { required: 'user' })} Value={data.place} />
                    </div>
                    <div className='w-full flex '>
                        <button type="submit" className=" p-2  mx-auto font-semibold rounded tracking-widest text-white
                     bg-blue-500 shadow-lg focus:outline-none hover:bg-blue-700 hover:shadow-none">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfile