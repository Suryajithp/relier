import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Chat from './peges/Chat';
import Adminlogin from './peges/admin/Adminlogin';
import Dashboard from './peges/admin/Dashboard';
import EditUserProfile from './peges/EditUserProfile';
import Home from './peges/Home';
import Login from './peges/Login';
import jwt_decode from "jwt-decode";
import Signup from './peges/Signup';
import UserProfile from './peges/UserProfile';
import FriendProfile from './peges/FriendProfile';
import ForgotPassword from './peges/ForgotPassword';
import { CommentModal, EditModal, Followmodal, Friend, Modal, Searchmodal, User } from './utilitis/Context';
import ChangePssword from './peges/ChangePssword';
import Notfound from './peges/Notfound';
import ErrorPage from './peges/ErrorPage';
import PostManage from './peges/admin/PostManage';
import { useEffect, useRef } from 'react';

const socket = require('socket.io-client')('ws://localhost:8900')
function App() {

  const token = localStorage.getItem('user')?jwt_decode(localStorage.getItem('user')):''

  useEffect(() => {
    socket?.emit('addUser', token.id)
  }, [token.id])
  return (
    <Router>
      <Modal>
        <EditModal>
          <User>
            <Friend>
              <CommentModal>
                <Searchmodal>
                  <Followmodal>
                    <Routes>
                      <Route path="/" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgotpassword" element={<ForgotPassword />} />
                      <Route path="/changepassword" element={<ChangePssword />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/userprofile" element={<UserProfile />} />
                      <Route path="/friendprofile" element={<FriendProfile />} />
                      <Route path="/editProfile" element={<EditUserProfile />} />
                      <Route path="/chat" element={<Chat socket={socket}/>} />
                      <Route path="/admin" element={<Adminlogin />} />
                      <Route path="/admin/dashboard" element={<Dashboard />} />
                      <Route path="/admin/postmanage" element={<PostManage />} />
                      <Route path="*" exact element={<Notfound />} />
                      <Route path="/error" exact element={<ErrorPage />} />
                    </Routes>
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
