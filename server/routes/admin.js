const express = require ('express')
const router = express.Router()
const adminController = require("../controlers/admin_controller")


router.post('/', adminController.Adminlogin)

router.get('/userlist', adminController.Userlist)

router.get('/postlist', adminController.postlist)

router.post('/changestatus/:id', adminController.ChangeStatus)

router.post('/changepoststatus/:id', adminController.ChangePostStatus)


 
module.exports = router