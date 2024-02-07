const express = require('express');
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Notes = require('../models/notes');
const User = require('../models/user');
const bcryptjs = require("bcryptjs");

//adding events
userRouter.post("/api/add-note", auth, async (req, res) => {
    try {
        const { noteDescription } = req.body;
        let user = await User.findById(req.user);
        user.notes.push({ noteDescription });
        //saving to database
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//editing events
userRouter.put("/api/edit-note", auth, async (req, res) => {
    try {
        const { noteId, noteDescription } = req.body;
        let user = await User.findById(req.user);
        const note = user.notes.id(noteId);
        note.noteDescription = noteDescription;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



//fetching events
userRouter.get('/api/get-notes', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user);
        const userEvents = user.notes;
        res.json(userEvents);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//deleting events
userRouter.delete("/api/delete-note", auth, async (req, res) => {
    try {
        const { noteId } = req.body;
        let user = await User.findById(req.user);
        const existingNotes = await user.notes;
        for (let i = 0; i < existingNotes.length; i++) {
            if (existingNotes[i]._id == noteId) {
                // If a matching event is found, remove it from the events list using splice()
                user.notes.splice(i, 1);
            }
        }
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

});



//editing user information
userRouter.put("/api/update-user-details", auth, async (req, res) => {
    try {
        const { firstName, lastName, address, contact } = req.body;
        let user = await User.findById(req.user);
        user.firstName = firstName;
        user.lastName = lastName;
        user.address = address;
        user.contact = contact;
        user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});







//changing password
userRouter.put("/api/change-password", auth, async (req, res) => {
    try {
        const { previousPassword, newPassword } = req.body;
        let user = await User.findById(req.user);
        const hashedPassword = await bcryptjs.hash(newPassword, 8);
        const isMatchNew = await bcryptjs.compare(previousPassword, hashedPassword);
        if (isMatchNew) {
            return res.status(400)
                .json({ msg: "You are using the same password!" });
        }
        const isMatch = await bcryptjs.compare(previousPassword, user.password);
        if (!isMatch) {
            return res.status(400)
                .json({ msg: "Current Password didn't matched" });
        }
        user.password = hashedPassword;
        user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});




module.exports = userRouter;