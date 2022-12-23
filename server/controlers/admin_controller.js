const Admincollection = require('../models/adminmodel')
const userModel = require('../models/usermodel')
const postModel = require('../models/post_model')
const bcrypt = require('bcrypt')

module.exports = {

    Adminlogin: async (req, res) => {
        try {
           
            const { email, password } = req.body;
            const admin = await Admincollection.findOne({ email: email })
            if (admin) {
                res.status(200).json({ message: "login successs" })
            } else {
                res.status(401).json({ message: "login failed" })
            }
        } catch (error) {
            res.status(500).json(error)
        }


    },
    Userlist: async (req, res) => {
        try {
            const userData = await userModel.find()
            if (userData) { res.status(200).json({ userData }) }
        } catch (error) {
            res.status(500).json(error)
        }
    },
    ChangeStatus: async (req, res) => {
        try {
            const id = req.params.id
           
            const userData = await userModel.findOne({ _id: id })
           
            if (userData.status == "true") {
                userModel.findByIdAndUpdate(id, { status: false }).then(() => {
                    res.status(200).json({ msg: "user status updated" })
                }).catch((error) => {
                    res.status(401).json(error)
                })
            } else {
                userModel.findByIdAndUpdate(id, { status: true }).then(() => {
                    res.status(200).json({ msg: "user status updated" })
                }).catch((error) => {
                    res.status(401).json(error)
                })
            }

        } catch (error) {
            res.status(500).json(error)
        }
    },

    postlist: (req, res) => {
        postModel.aggregate([
            {
                $project:
                {
                    post: 1,
                    discription: 1,
                    status: 1,
                    report: 1,
                    numberOfReports: { $cond: { if: { $isArray: "$report" }, then: { $size: "$report" }, else: "NA" } }
                }
            },
            {
                $match: {numberOfReports:{ $gte: 1}}
            },
        ]).then((rep) => {
            res.status(200).json(rep)
        })
    },

    ChangePostStatus: async (req, res) => {
        try {
            const id = req.params.id
            const userData = await postModel.findOne({ _id: id })
            if (userData.status === true) {
                postModel.findByIdAndUpdate(id, { status: false }).then(() => {
                    res.status(200).json({ msg: "user status updated" })
                }).catch((error) => {
                    res.status(401).json(error)
                })
            } else {
                postModel.findByIdAndUpdate(id, { status: true }).then(() => {
                    res.status(200).json({ msg: "user status updated" })
                }).catch((error) => {
                    res.status(401).json(error)
                })
            }

        } catch (error) {
            res.status(500).json(error)
        }
    },
}
