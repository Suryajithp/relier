const userModel = require('../models/usermodel')
const postModel = require('../models/post_model')
const nodemailer = require("nodemailer");
const commentModel = require('../models/comment_model')
const friendsModel = require('../models/friends_model')
const notificationModel = require('../models/notification_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


const otpGenarater = () => {
    let a = Math.floor(100000 + Math.random() * 900000);
    a = String(a);
    a = a.substring(0, 4);
    return a
}

let emailOtp
let enterEmail

module.exports = {

    jwt: (req, res) => {
        res.status(200).json({ auth: true })
    },

    Signup: async (req, res) => {
        try {
            console.log(req.body);
            const { username, email, password } = req.body;
            const userExist = await userModel.findOne({ email: email })
            if (userExist) {
                res.status(401).json({ msg: "exist" })
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashedpassword = await bcrypt.hash(password, salt)
    
                const user = new userModel({
                    username: username,
                    email: email,
                    password: hashedpassword
                })
    
                if (user) {
                    user.save()
                    res.status(201).json({
                        _id: user.id,
                        name: user.name,
                        email: user.email
                    })
                } else {
                    res.status(400)
                    throw new Error('Invalid user data')
                }
            }
        } catch (error) {
            console.log(error);
        }
       



    },

    Login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log(req.body);
            const userExist = await userModel.findOne({ email: email })
            if (userExist && (await bcrypt.compare(password, userExist.password))) {
                const id = userExist._id
                if (userExist.status === "true") {
                    const token = jwt.sign({ id }, "jwtSecret", { expiresIn: 300000 })
                    res.status(200).json({ msg: "login", token })
                } else {
                    res.status(401).json({ msg: "Your Accont is blocked" })
                }

            } else {
                res.status(401).json({ msg: "Email or password incorrect" })
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json(error)
        }


    },

    otpGenarate: async (req, res) => {
        const email = req.body.email
        try {
            const userExist = await userModel.findOne({ email: email })
            if (userExist) {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'heraclepubg333@gmail.com',
                        pass: 'samexqzhzdsuvznz',
                    },
                });

                let info = {
                    from: 'heraclepubg333@gmail.com',
                    to: userExist.email,
                    subject: "Your OTP",
                    text: otpGenarater(),
                }
                transporter.sendMail(info, (err) => {
                    if (err) {
                    } else {
                        emailOtp = info.text
                        enterEmail = info.to
                    }
                })
                res.status(200).json({ msg: 'otp send' })

            } else {
                res.status(401).json({ msg: 'user not exsist' })
            }
        } catch (error) {
            res.status(500).json(error)
        }


    },

    changePassword: async (req, res) => {
        const { otp, password } = req.body;
        try {
            if (otp === emailOtp) {
                const salt = await bcrypt.genSalt(10)
                const hashedpassword = await bcrypt.hash(password, salt)
                userModel.findOneAndUpdate({ email: enterEmail }, {
                    $set: { password: hashedpassword }
                }).then(() => {
                    res.status(200).json({ msg: 'password updated' })
                }).catch(() => {
                    res.status(401).json({ msg: 'incorrect otp' })
                })
            } else {
                res.status(401).json({ msg: 'incorrect otp' })

            }

        } catch (error) {
            res.status(401).json(error)
        }

    },

    AddPost: (req, res) => {
        req.body.file = req.file.filename
            if(req.body.file.match(/\.(jpg|jpeg|png)$/i)) {
                const userId = ObjectId(req.body.user)
                const posts = new postModel({
                    post: req.body.file,
                    user: userId,
                    discription: req.body.discription
                })
                posts.save()
                    .then((data) => {
                        res.status(200).json(data)
                    }).catch((error) => {
                        res.status(401).json(error)
                    })
            }
            else {
                res.status(401).json(error)
            }

       
    },

    getNotification: async(req,res)=>{
            try {
                const userId = req.params.id
                const data = await notificationModel.findOne({ user: ObjectId(userId) })
                if (data) {
                    res.status(200).json(data)
                } else {
                    res.status(200).json(userId)
                }
            } catch (error) {
                res.status(401).json(error)
            }

    },

    addNotification: async (req,res)=>{

        const {postId,receiverId,userId,type} = req.body
        const notificationExsist = await notificationModel.findOne({ user: ObjectId(receiverId) })
        if (notificationExsist) {
            let exsist=true

            const newObjArr = await notificationExsist.notification.map(obj => {    
                if (obj.userId == userId && obj.postId == postId && obj.type == type) {
                    return exsist=false
                }else{
                    return exsist=true
                }
            })

            if(exsist){
                notificationModel.findOneAndUpdate({ user: ObjectId(receiverId) }, {
                    $push: {
                        notification: {
                            userId: userId,
                            postId: postId,
                            type: type,
                        }
                    }
                }).then(() => {
                    res.status(200).json({ msg: "notification added" })
                }).catch((error) => {
                    res.status(401).json({ msg: "notification added" })
                })
            }else{
                res.status(200).json({ msg: "notification added" })
            }

            
        } else {
            const notification = new notificationModel({
                notification: [{
                    userId: userId,
                        postId: postId,
                        type: type,
                }],
                user: receiverId
            })

            notification.save().then(() => {
                res.status(200).json({ msg: "notification added" })
            }).catch(() => {
                res.status(401).json({ msg: "notification added" })
            })
        }
    },

    getAllPost: async (req, res) => {
        postModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            { $unwind: '$userData' },
            {
                $project: {
                    post: 1,
                    discription: 1,
                    like: 1,
                    report: 1,
                    date: 1,
                    status: 1,
                    username: '$userData.username',
                    id: '$userData._id',
                    profile: '$userData.profile'
                }
            }, {
                $match: { status: true }
            }
        ]).sort({ date: -1 }).then((data) => {
            res.status(200).json(data)
        }).catch((error) => {
            res.status(401).json({ msg: 'error' })
        })
    },

    getSuggestion: (req, res) => {

        const userId = req.params.id

        friendsModel.aggregate([
            {
                $match:{followers : {$nin: [ObjectId(userId)]}}
            },{
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userData'
                }
            },
            {$unwind:'$userData'},
            {
                $project:{
                    _id:0,
                    userData:1
                }
            }
        ]).then((response) => {
            res.status(200).json(response)
        }).catch(()=>{
            res.status(401).json(response)
        })

    },

    reportPost: async (req, res) => {

        try {
            const { userId, postId, message } = req.body
            const post = await postModel.findOne({ _id: ObjectId(postId) })

            if (post) {

                await postModel.findByIdAndUpdate({ _id: ObjectId(postId) },
                    {
                        $push: {
                            report: {
                                userId: ObjectId(userId),
                                message: message,
                            }
                        }
                    }).then((response) => {
                        res.status(200).json({ msg: "drtfyuhi" })
                    })
            } else {
                res.status(401).json({ msg: "drtfyuhi" })
            }
        } catch (error) {
            res.status(401).json({ msg: "drtfyuhi" })
        }
    },

    getUserPost: async (req, res) => {
        const userId = ObjectId(req.params.id)

        postModel.aggregate([
            {
                $match: { user: userId }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $project: {
                    post: 1,
                    discription: 1,
                    date: 1,
                    like: 1,
                    username: '$userData.username',
                    bio: '$userData.bio',
                    place: '$userData.place',
                    id: '$userData._id',
                    profile: '$userData.profile'
                }
            }
        ]).sort({ date: -1 }).then((data) => {
            res.status(200).json(data)
        }).catch(() => {
            res.status(401).json({ msg: 'error' })
        })

    },

    getPost: async (req, res) => {
        try {
            const userId = req.params.id
            const data = await postModel.findOne({ _id: ObjectId(userId) })
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(401).json({ msg: 'error' })
            }
        } catch (error) {
            res.status(401).json(error)
        }

    },

    getComments: async (req, res) => {
        const post = ObjectId(req.params.id)
        postModel.aggregate([
            {
                $match: { _id: post }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments'
                }
            },
            { $unwind: "$comments" },
            {
                $project: {
                    post: 1,
                    _id: 1,
                    discription: 1,
                    comment: '$comments.comments',
                }
            },
            { $unwind: "$comment" },
            {
                $project: {
                    message: '$comment.message',
                    post: 1,
                    _id: 1,
                    commentId:'$comment._id',
                    discription: 1,
                    time: '$comment.time',
                    userID: '$comment.userId'

                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userID',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    message: 1,
                    post: 1,
                    _id: 1,
                    commentId:1,
                    discription: 1,
                    time: 1,
                    userID: 1,
                    userName: '$userDetails.username',
                    profile: '$userDetails.profile'
                }
            },

        ]).sort({ time: -1 }).then((response) => {
            res.status(200).json(response)
        }).catch((error) => res.status(401).json(error))
    },

    deleteComments:(req,res) =>{
        const {commentId,postId} = req.body
        commentModel.findOneAndUpdate({postId:postId},{
            $pull:{comments:{_id:commentId}}
        }).then((response)=>{
            res.status(200).json(response)
        }).catch((error) => res.status(401).json(error))
    },

    getSearch: (req, res) => {
        const user = req.params.id
        userModel.find({ username: { $regex: '^' + user, $options: '<i>' } }).then((response) => {
            res.status(200).json(response)
        }).catch((error) => {
            res.status(401).json(error);
        })

    },
    doLike: async (req, res) => {
        try {
            const { userId, postId } = req.body

            const post = await postModel.findOne({ _id: ObjectId(postId) })

            if (post) {

                const userExist = await post.like.includes(ObjectId(userId))
                if (userExist) {
                    await postModel.findByIdAndUpdate({ _id: ObjectId(postId) },
                        { $pull: { like: ObjectId(userId) } })
                    res.status(200).json({ msg: "drtfyuhi" })
                } else {
                    await postModel.findByIdAndUpdate({ _id: ObjectId(postId) },
                        { $push: { like: ObjectId(userId) } }).then((response) => {
                            res.status(200).json({ msg: "drtfyuhi" })
                        })
                }
            } else {
                console.log('error');
            }
        } catch (error) {
            res.status(401).json(error)
        }



    },

    doComment: async (req, res) => {
        const message = req.body.comment
        const {userId,postId} = req.body
        const commentExsist = await commentModel.findOne({ postId: ObjectId(postId) })
        if (commentExsist) {
            commentModel.findOneAndUpdate({ postId: ObjectId(postId) }, {
                $push: {
                    comments: {
                        userId: userId,
                        message: message,
                    }
                }
            }).then(() => {
                res.status(200).json({ msg: "comment added" })
            }).catch((error) => {
                res.status(401).json({ msg: "comment added" })
            })
        } else {
            const comments = new commentModel({
                comments: [{
                    userId: userId,
                    message: message,
                }],
                postId: postId
            })

            comments.save().then(() => {
                res.status(200).json({ msg: "comment added" })
            }).catch(() => {
                res.status(401).json({ msg: "comment added" })
            })
        }

    },

    deletePost: (req, res) => {
        postModel.findOneAndDelete({ _id: ObjectId(req.body.postId) }).then(() => {
            res.status(200).json({ msg: 'post deleted' })
        }).catch((err) => {
            res.status(401).json(err)
        })
    },

    editPost: (req, res) => {
        postModel.findByIdAndUpdate({ _id: ObjectId(req.body._id) }, {
            $set: { discription: req.body.discription }
        }).then(() => {
            res.status(200).json({ msg: 'post updated' })
        }).catch((err) => {
            res.status(401).json(err)
        })
    },

    getUser: (req, res) => {
        const userId = ObjectId(req.params.id)
        userModel.findOne({ _id: userId }).then((response) => {
            res.status(200).json(response)
        }).catch((error) => {
            res.status(401).json({ msg: 'error' })
        })
    },

    EditUser: async (req, res) => {
        if (req.file) {
            req.body.file = req.file.filename
        } else {
            req.body.file = req.body.profile
        }
        const { username, email, userId, bio, place } = req.body

        const userExist = await userModel.findOne({ _id: ObjectId(userId) })

        if (userExist.email === email) {
            userModel.findOneAndUpdate({ _id: ObjectId(userId) }, {
                $set: {
                    profile: req.body.file,
                    username: username,
                    email: email,
                    bio: bio,
                    place: place
                }
            }).then((response) => {
                res.status(200).json({ msg: 'udate user data' })
            }).catch((error) => {
                res.status(401).json({ msg: 'error' })
            })
        } else {
            const mailExist = await userModel.findOne({ email: email })

            if (!mailExist) {
                userModel.findOneAndUpdate({ _id: ObjectId(userId) }, {
                    $set: {
                        profile: req.body.file,
                        username: username,
                        email: email,
                        bio: bio,
                        place: place
                    }
                }).then((response) => {
                    res.status(200).json({ msg: 'udate user data' })
                }).catch((error) => {
                    res.status(401).json({ msg: 'error' })
                })
            } else {
                res.status(401).json({ msg: 'email already exist' })
            }

        }

    },

    doFollow: async (req, res) => {
        const {userId,friendId} = req.body
        const userFrends = await friendsModel.findOne({ userId: ObjectId(userId) })
        if (userFrends) {
            const friendExsist = await userFrends.following.includes(ObjectId(friendId))

            if (friendExsist) {
                await userFrends.updateOne({
                    $pull: {
                        following: ObjectId(friendId)
                    }
                })

                friendsModel.findOneAndUpdate({ userId: ObjectId(friendId) }, {
                    $pull: {
                        followers: ObjectId(userId)
                    }
                }).then(() => {
                    res.status(200).json({ msg: 'user unfollow' })
                }).catch((error) => {
                    res.status(401).json({ msg: "error" })
                })

            } else {
                const friendFrends = await friendsModel.findOne({ userId: ObjectId(friendId) })

                if (friendFrends) {
                    await userFrends.updateOne({
                        $push: {
                            following: ObjectId(friendId)
                        }
                    })

                    friendFrends.updateOne({
                        $push: {
                            followers: ObjectId(userId)
                        }
                    }).then(() => {
                        res.status(200).json({ msg: 'user added to follow' })
                    }).catch((error) => {
                        res.status(401).json({ msg: 'error' })
                    })


                } else {
                    await userFrends.updateOne({
                        $push: {
                            following: ObjectId(friendId)
                        }
                    })

                    const friendfriends = new friendsModel({
                        userId: friendId,
                        followers: ObjectId(userId)
                    })

                    friendfriends.save().then(() => {
                        res.status(200).json({ msg: "user added to follow" })
                    }).catch((error) => {
                        res.status(401).json({ msg: "error" })
                    })
                }

            }
        } else {
            const friendFrends = await friendsModel.findOne({ userId: ObjectId(friendId) })
            if (friendFrends) {
                const userfriends = new friendsModel({
                    userId: userId,
                    following: ObjectId(friendId)
                })
                userfriends.save()

                friendFrends.updateOne({
                    $push: { followers: ObjectId(userId) }
                }).then(() => {
                    res.status(200).json({ msg: 'user added to follow' })
                }).catch((error) => {
                    res.status(401).json({ msg: "error" })
                })


            } else {
                const userfriends = new friendsModel({
                    userId: userId,
                    following: ObjectId(friendId)
                })

                userfriends.save()

                const friendfriends = new friendsModel({
                    userId: friendId,
                    followers: ObjectId(userId)
                })

                friendfriends.save().then(() => {
                    res.status(200).json({ msg: "user added to follow" })
                }).catch((error) => {
                    res.status(401).json({ msg: "error" })
                })
            }
        }
    },

    checkfollow: async (req, res) => {
        const friendId = req.params.id
        friendsModel.aggregate([
            { $match: { userId: ObjectId(friendId) } },
            {
                $project: {
                    _id: 0,
                    followers: 1,
                    following: 1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'followers',
                    foreignField: '_id',
                    as: 'followers'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'following',
                    foreignField: '_id',
                    as: 'following'
                }
            },
            {
                $project: {
                    followers: 1,
                    following: 1
                }
            },
        ]).then((response) => {
            res.status(200).json(response);
        }).catch((error) => {
            res.status(401).json(error)
        })
    },


}
