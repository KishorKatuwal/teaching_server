const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

authRouter.post("/api/signup", async (req, res) => {
    try {
        //getting data from the client
        const { firstName, lastName, email, password, address, contact } = req.body;
        //checking whether the user already exits or not
        const existingUser = await User.findOne({ email });
        //400 is bad request
        if (existingUser) {
            return res.status(400).json({ msg: "Already signed up with this email address!" });
        }
        //has password with a salt of 8 rounds
        const hashedPassword = await bcryptjs.hash(password, 8);
        let user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            address,
            contact,
        });
        //post that data in the database
        user = await user.save();
        //return that data to the user
        res.json(user);
    } catch (e) {
        //500 means internal server error
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});


//api for singing in
authRouter.post('/api/signin', async (req, res) => {
    try {
        console.log(req.body);
        console.log("hit here");
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
                .json({ msg: "User with this email does not existss" });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400)
                .json({ msg: "Incorrect Password" });
        }
        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, ...user._doc })

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//checking token is valid
authRouter.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//get user data
authRouter.get("/", auth, async (req, res) => {
    //getting user details from the user
    const user = await User.findById(req.user);
    // Send a JSON response containing the user document and the authentication token
    res.json({ ...user._doc, token: req.token });
});




module.exports = authRouter;