import React from 'react'
import Post from '../../components/Admin/Post'
import Sidebar from '../../components/Admin/sidebar/sidebar'

const PostManage = () => {
  return (
    <div>
        <Sidebar>
      <Post/>
      </Sidebar>
    </div>
  )
}

export default PostManage