import React from 'react'
import Sidebar from '../../components/Admin/sidebar/sidebar'
import Usertable from '../../components/Admin/Usertable'

const Dashboard = () => {
  return (
    <div className='bg-gray-100 h-screen overflow-hidden'>
      <Sidebar>
      <Usertable/>
      </Sidebar>
    </div>
  )
}

export default Dashboard