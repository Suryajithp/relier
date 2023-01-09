import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import loginImg from '../assets/login.jpeg';
import axios from '../Axios/AxiosInstance';
import { useEffect, useState } from 'react'



const Login = () => {

  const navigate = useNavigate()
  const [error, setError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const userAuthenticeted = () => {
    axios.get("/isUserAuth", {
      headers: {
        "x-access-token": localStorage.getItem("user"),
      },
    }).then((response) => {
      if (response.data.auth==true) {
        navigate('/home')
      }
     
    });
  };


  useEffect(()=>{
    userAuthenticeted()
  },[])

  const Submit = (e) => {
    const { email, password } = e
    if (email && password) {
      console.log(e);
      axios.post("/", e)
        .then((response) => {
          localStorage.setItem('user', response.data.token)
          console.log('yessss');
          navigate('/home')
        }).catch((error) => {
          const errormsg = error.response.data.msg
         console.log('noooo');
          setError(errormsg)
        })
    } else {
      console.log("error");
    }
  }

    return (
        <div className="flex justify-center  min-h-screen place-items-center">
            <div className=" m-4 p-12 bg-white hidden md:block md:w-1/2  lg:w-5/12">
                <img src={loginImg} alt='#' className="w-full" />
            </div>
            <div className="w-11/12 p-12 m-4 bg-white sm:w-8/12 md:w-1/2 border rounded-md shadow-lg lg:w-4/12">
                <h1 className="text-xl text-center font-semibold">LOGIN </h1>
            {error ? <h1 className="text-red-500 text-center mx-auto">{error}</h1> : <h1></h1>}
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
                    <div className='flex justify-between'>
                    <Link to="/signup">
                        <p className=" justify-between inline-block mt-4 text-base text-gray-500 cursor-pointer hover:text-blue-800">Create New Account?</p>
                    </Link>
                    <Link to="/forgotpassword">
                        <p className=" justify-between inline-block mt-4 text-base text-gray-500 cursor-pointer hover:text-blue-800">Forgot password?</p>
                    </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login