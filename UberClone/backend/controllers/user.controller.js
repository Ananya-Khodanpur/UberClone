const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullname, email, password } = req.body;
        console.log("Registration attempt for:", email); // ✅ Log for debugging

        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: 'User already exist' });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUsers({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        console.log("User created successfully:", user._id);

        const token = user.generateAuthToken();

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email
        };
        

        return res.status(201).json({
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Registration error:", error.message);
        return res.status(500).json({ error: error.message });
    }
};


module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token);

    // ✅ Clean user object for frontend
    const userResponse = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email
    };

    res.status(200).json({ user: userResponse, token });
};

module.exports.getUserProfile = async (req, res, next) => {
    // //console.log(req.user)
    res.status(200).json({ user: req.user });
}

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    const blackToken = await blacklistTokenModel.create({ token: token });
    blackToken.save();
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}