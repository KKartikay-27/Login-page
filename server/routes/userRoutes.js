const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');

const router = express.Router();

router.post("/register", async (req, res) => {
    try {

        const userExists = await User.findOne({ email: req.body.email });

        if (userExists) {
            res.send({
                "success": false,
                "message": "User already exists"
            })
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;


        const newUser = new User(req.body);
        await newUser.save();

        res.send({
            success: true,
            message: "You are successfully registered.",
          });

    } catch (error) {
        res.json(error);
    }

});

router.post("/login", async (req, res) => {
    const user = await User.findOne({email : req.body.email});
    if(!user){
        res.send({
            success : false,
            message : "User does not exist, please register"
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword){
        res.send({
            success : false,
            message : "Wrong Password"
        })
    }

    res.send({
        success : true,
        message : "User Logged in"
    })

});


module.exports = router;