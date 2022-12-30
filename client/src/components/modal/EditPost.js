import { useContext, useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { EditContext } from '../../utilitis/Context';
import axios from '../../AxiosInstance'; 
import { useNavigate } from 'react-router-dom';

const EditPost = ({ postid }) => {

    const { editmodal, setEditmodal } = useContext(EditContext)
    const [formData, setFormData] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/getpost/' + postid, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        }).then((res) => {
            setFormData(res.data)
        }).catch((err) => {
            navigate('/error')
        })
    }, [])

    const chageModal = () => {
        setEditmodal(!editmodal)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData
            , discription: e.target.value
        })
    }

    const submit = (e) => {
        axios.post("/editpost", formData, {
            headers: {
                "x-access-token": localStorage.getItem("user"),
            },
        })
            .then((response) => {
                setEditmodal(!editmodal)
            }).catch((error) => {
                navigate('/error')
            })
    }
    return (
        <div>
            {
                <div className="bg-slate-800 bg-opacity-50 flex justify-center 
                 min-h-screen items-center absolute  top-0 right-0 bottom-0 left-0">
                    < CgClose className='right-8 top-5 absolute h-10 w-12 text-gray-100' onClick={chageModal} />
                    <div className='bg-white rounded-md w-11/12 md:w-9/12 lg:w-5/12 flex h-80'>
                        <div class=" w-full md:w-1/2 h-full  rounded-md text-center">
                            <div className="w-full h-fit rounded-md flex">
                                <h1 className="p-2 my-auto  text-base font-semibold" >Edit Post</h1>
                            </div>
                            <div className=' pt-0 my-auto h-5/6 w-full'>
                                <img className='w-11/12 h-full mx-auto outline outline-4 outline-white ' src={`/images/${formData?.post}`} alt="" />
                            </div>
                        </div>
                        <div className='w-0.5 h-[80%] my-auto bg-gray-200'></div>
                        <div class=" w-full md:w-1/2 h-full rounded-md text-center">
                            <h1 className="p-1 my-auto  text-base font-semibold" >discription</h1>
                            <div className=" w-full mt-10 h-[37%]  rounded-md">
                                <textarea type='text' className="p-2 h-full w-full text-base font-serif focus:outline-none"
                                    defaultValue={formData?.discription} placeholder='Write your discription' name='discription' onChange={handleChange} />
                            </div>
                            <button className='p-1 mt-10 rounded-md bg-blue-400 text-white text-base font-mono' onClick={submit}>Submit</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}


export default EditPost
