import React, { useState } from 'react'
import './sidebar.css'
import {FaTh, FaThList} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
function Sidebar({children}) {
    const [isOpen,setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem =[
        {
            path:"/admin/dashboard",
            name:"User Details",
            icon:<FaTh/>
        },
        {
            path:"/admin/postmanage",
            name:"Post manage", 
            icon:<FaThList/>
        }
    ]
  return (
    <div className='continer items-start'>
        <div className="sidebar w-[50px] md:w-[300px]">
            <div className="top_section h-[80px]">
                <h1 className="logo hidden md:block">Logo</h1>
            </div>
            {
                menuItem.map((item,index)=>(
                    <NavLink to={item.path} key={index} className="link" activeclassName="active">
                        <div className="icon">{item.icon}</div>
                        <div className="link_text hidden md:block ">{item.name}</div>
                    </NavLink>
                ))
            }
        </div>
        <main>{children}</main>
    </div>    
  )
}

export default Sidebar