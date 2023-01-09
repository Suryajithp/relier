import axios from '../../Axios/AxiosInstance';
import React, { useEffect, useReducer, useState } from 'react'

const Usertable = () => {
    const [data, setData] = useState([])
    const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage] = useState(5)


    useEffect(() => {
        axios.get("/admin/userlist").then((response) => {
            setData(response.data.userData)
        })
    }, [reducerValue])


    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

    const pageNumber = []

    for (let i = 1; i <= Math.ceil(data.length / postPerPage); i++) {
        pageNumber.push(i)
    }
    const paginate = pageNumber => setCurrentPage(pageNumber);


    const changeStatus = (e, id) => {
        axios.post("/admin/changestatus/" + id)
            .then((res => {
                forceUpdate()
            }))
    }

    return (
        <div>
            <div className='flex   justify-center items-center h-screen my-auto'>
                <div className="w-8/12 border rounded-lg shadow-md p-5  ">
                    <h1 className='text-lg font-bold text-teal-400'>User details</h1>
                    <div className="bg-white mt-7 shadow-md rounded overflow-x-auto ">
                        <table class="text-left w-full border-collapse ">

                            <thead>
                                <tr>
                                    <th class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">No</th>
                                    <th class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">User Name</th>
                                    <th class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Email</th>
                                    <th class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentPosts.map((item, index) => (
                                        <tr class="hover:bg-grey-lighter">
                                            <td class="py-4 px-6 border-b border-grey-light">{index + 1}</td>
                                            <td class="py-4 px-6 border-b border-grey-light">{item.username}</td>
                                            <td class="py-4 px-6 border-b border-grey-light">{item.email}</td>
                                            <td class="py-4 px-6 border-b text-center border-grey-light">{item.status === "true" ?
                                                <button className='bg-rose-400 rounded px-2 text-white font-medium' onClick={(e) => changeStatus(e, item._id)}>block</button>
                                                : <button className='bg-emerald-400 rounded px-2 text-white font-medium' onClick={(e) => changeStatus(e, item._id)}>unblock</button>}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                        <ul className='w-full flex justify-center  '>
                            {pageNumber.map(number => (
                                <li key={number} className='m-2'>
                                    <a onClick={() => paginate(number)} href='#' className='bg-emerald-400 font-bold rounded-3xl text-white font px-1.5'>
                                        {number}
                                    </a>
                                </li>
                            ))}
                        </ul>
                </div>
            </div>
        </div>
    )
}

export default Usertable
