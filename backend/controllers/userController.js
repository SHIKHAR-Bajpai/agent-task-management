const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Function for generating JWT token using user-Id and user-role
const generateToken = (id , role) => {
    return jwt.sign({ id , role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Function for registering new user(admin)
const registerUser = async (req, res) => {
    const { name , email, password, role , mobile } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        mobile,
        role,
    });

    if (user) {
        res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        token: generateToken(user.id , user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Function for logging in user(admin)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    const comparedPassword = await bcrypt.compare(password, user.password);

    if (user && comparedPassword ) {
        res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        token: generateToken(user.id , user.role),
        });
    } 
    else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerUser, loginUser };