import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Adminlogin from './pages/admin/Adminlogin';
import Dashboard from './pages/admin/Dashboard';
import EditUserProfile from './pages/EditUserProfile';
import Home from './pages/Home';
import Login from './pages/Login';
import jwt_decode from "jwt-decode";
import { io } from 'socket.io-client';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import FriendProfile from './pages/FriendProfile';
import ForgotPassword from './pages/ForgotPassword';
import { ChatView, CommentModal, EditModal, Followmodal, Friend, Modal, Searchmodal, User } from './utilitis/Context';
import ChangePssword from './pages/ChangePssword';
import Notfound from './pages/Notfound';
import ErrorPage from './pages/ErrorPage';
import PostManage from './pages/admin/PostManage';
import { useEffect, useState } from 'react';
const socket = require('socket.io-client')('http://relier.tk',{path:"/socket/socket.io"})
function App() {

  const [sockettwo, setSockettwo] = useState(null)

  const token = localStorage.getItem('user')?jwt_decode(localStorage.getItem('user')):'' 

  useEffect(() => {
    socket?.emit('addUser', token.id)
  }, [token.id])


  useEffect(() => {
    setSockettwo(io('http://relier.tk',{path:"/socketnotification/socket.io"}))
  }, [])
  return ( 
    <Router>
      <Modal>
        <EditModal>
          <User>
            <Friend>
              <CommentModal>
                <Searchmodal>
                  <Followmodal>
                  <ChatView>
                    <Routes>
                      <Route path="/" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgotpassword" element={<ForgotPassword />} />
                      <Route path="/changepassword" element={<ChangePssword />} />
                      <Route path="/home" element={<Home socket={sockettwo}/>} />
                      <Route path="/userprofile" element={<UserProfile />} />
                      <Route path="/friendprofile" element={<FriendProfile />} />
                      <Route path="/editProfile" element={<EditUserProfile />} />
                      <Route path="/chat" element={<Chat socket={socket} notification={sockettwo}/>} />
                      <Route path="/admin" element={<Adminlogin />} />
                      <Route path="/admin/dashboard" element={<Dashboard />} />
                      <Route path="/admin/postmanage" element={<PostManage />} />
                      <Route path="*" exact element={<Notfound />} />
                      <Route path="/error" exact element={<ErrorPage />} />
                    </Routes>
                  </ChatView>
                  </Followmodal>
                </Searchmodal>
              </CommentModal>
            </Friend>
          </User>
        </EditModal>
      </Modal>
    </Router>
  );
}

export default App;
