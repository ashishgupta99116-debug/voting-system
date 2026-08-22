const express = require("express") ;
const User = require("../model/user") ;

const router = express.Router() ;


router.post("/", async (req, res) => {

    try {

        const user = new User(req.body);

        const savedUser = await user.save();

        res.status(201).json(savedUser);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


router.get("/", async (req, res) => {

    try {

        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router ;
