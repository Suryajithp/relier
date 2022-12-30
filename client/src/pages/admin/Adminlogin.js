import axios from '../../AxiosInstance'; 
import {  useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'

const Adminlogin = () => {
    const navigate = useNavigate()
    const [error,setError] = useState(false)
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
  } = useForm();
  
  const Submit =(e)=>{
  const {email,password} = e
  if(email && password){
    axios.post("/admin",e)
      .then((response)=>{
          navigate('/admin/dashboard')
      }).catch((error)=>{
        setError(true)
      })
  }else{
  }
  }
    return (
        <div className="flex justify-center  min-h-screen place-items-center">
            <div className="w-11/12 p-12 m-4 bg-white sm:w-4/12  border rounded-md shadow-lg lg:w-3/12">
                <h1 className="text-xl text-center font-semibold">LOGIN </h1>
                <form className="mt-6" onSubmit={handleSubmit(Submit)}>
                    <label for="email" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">E-mail</label>
                    <input id="email" type="email" name="email"
                        className="block w-full p-3 mt-2 text-gray-700 rounded bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                        {...register("email", {
                            required: "Email Required",
                            pattern: {
                                value: /^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/,
                                message: "invalid Email Address"
                            }
                        })} />
                    {errors.email && (<span className='text-red-500'>{errors.email.message}</span>)}
                    <label for="password" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Password</label>
                    <input id="password" type="password" name="password"
                        className="block w-full p-3 mt-2 text-gray-700 rounded bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                        {...register("password", {
                            required: "password Required",
                            pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                message: "invalid password "
                            }
                        })} />
                    {errors.password && (<span className='text-red-500'>{errors.password.message}</span>)}
                    <button type="submit" className="w-full py-3 mt-6 font-medium rounded tracking-widest text-white uppercase bg-blue-500 shadow-lg focus:outline-none hover:bg-blue-700 hover:shadow-none">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Adminlogin