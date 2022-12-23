import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { CgClose } from 'react-icons/cg'


const Post = () => {

    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage] = useState(5)

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = data?.slice(indexOfFirstPost, indexOfLastPost);

    const pageNumber = []

    useEffect(() => {
        axios.get("http://localhost:4000/admin/postlist").then((response) => {
            setData(response.data)
        })
    }, [reducerValue])



    for (let i = 1; i <= Math.ceil(data?.length / postPerPage); i++) {
        pageNumber.push(i)
    }
    const paginate = pageNumber => setCurrentPage(pageNumber);


    const changeStatus = (id) => {
        axios.post("http://localhost:4000/admin/changepoststatus/" + id)
            .then((res => {
                forceUpdate()
            }))
    }

    const viewDetails = (e) => {
        setOpen(!open)
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
                                    <th class="py-4 px-6 bg-grey-lightest text-center font-bold uppercase text-sm text-grey-dark border-b border-grey-light">No of Reports</th>
                                    <th class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">discription</th>
                                    <th class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">View</th>
                                    <th class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentPosts?.map((item, index) => (
                                        <tr class="hover:bg-grey-lighter">
                                            <td class="py-4 px-6 border-b border-grey-light">{index + 1}</td>
                                            <td class="py-4 px-6 text-center border-b border-grey-light">{item.numberOfReports}</td>
                                            <td class="py-4 px-6 border-b border-grey-light">{item.discription}</td>
                                            <td class="py-4 px-6 border-b border-grey-light">
                                                <button className='bg-cyan-400 rounded px-2 text-white font-medium' onClick={() => viewDetails(item._id)}>view</button></td>
                                            <td class="py-4 px-6 border-b text-center border-grey-light">{item.status === true ?
                                                <button className='bg-rose-400 rounded px-2 text-white font-medium' onClick={() => changeStatus(item._id)}>block</button>
                                                : <button className='bg-emerald-400 rounded px-2 text-white font-medium' onClick={() => changeStatus(item._id)}>unblock</button>}
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
            {
                open &&
                (< div className='absolute top-0 left-[250px] right-0 bottom-0 h-screen bg-gray-700 bg-opacity-50 flex' onClick={() => setOpen(!open)}>
                    < CgClose className='right-8 top-5 absolute h-10 w-12 text-gray-100' />
                    <div className='mx-auto my-auto w-80 h-56 bg-white p-1 border rounded '>
                        <h1 className='text-base font-semibold w-fit my-1 mx-auto text-red-400'>Reports</h1>
                        <hr />
                        {
                            
                            data[0].report.map((item, index) => (
                                <div className='flex bg-white'>
                                    <h1 className='text-lg w-full font-normal text-gray-600 text-center p-1'>{item.message}</h1>
                                </div>
                            ))
                        }
                    </div>
                </div>)

            }
        </div >

    )
}

export default Post