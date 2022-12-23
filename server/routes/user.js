const express = require('express');
const router = express.Router()
const userController = require('../controlers/usercontrol')
const {verifyJWT} = require('../controlers/Authenticate')
const upload = require('../config/multer')



router.get('/isUserAuth', verifyJWT, userController.jwt)

router.post('/signup',userController.Signup)

router.post('/',userController.Login)

router.post('/otpgenerate',userController.otpGenarate)

router.post('/changepassword',userController.changePassword)

router.post('/addpost',verifyJWT,upload.single('image'),userController.AddPost)

router.get('/getallpost',verifyJWT, userController.getAllPost)

router.get('/getsuggestion/:id',verifyJWT, userController.getSuggestion)

router.get('/getuserpost/:id',verifyJWT, userController.getUserPost)

router.get('/getNotification/:id',verifyJWT, userController.getNotification)

router.post('/notification',verifyJWT, userController.addNotification)

router.get('/getpost/:id', verifyJWT,userController.getPost)

router.get('/getComments/:id',verifyJWT, userController.getComments)

router.get('/getsearch/:id',verifyJWT, userController.getSearch)

router.post('/like', verifyJWT,userController.doLike)

router.post('/comment',verifyJWT, userController.doComment)

router.post('/editpost',verifyJWT, userController.editPost)

router.post('/report', verifyJWT,userController.reportPost)

router.post('/deletepost',verifyJWT, userController.deletePost)

router.get('/editProfile/:id',verifyJWT, userController.getUser)

router.post('/editProfile',verifyJWT,upload.single('profile'), userController.EditUser)

router.post('/follow', verifyJWT,userController.doFollow)

router.get('/checkfollow/:id',verifyJWT, userController.checkfollow)

module.exports = router;

