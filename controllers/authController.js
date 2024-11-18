const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { session } = require('../config/neo4j');
const User = require('../models/userModel');

const register = async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.createUser(username, hashedPassword, role);
    res.status(201).json({ message: 'User created', user: newUser });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username: user.username, id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
        req.session.token = token;
        res.json({ message: 'Logged in', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Could not log out' });
        res.json({ message: 'Logged out' });
    });
};

module.exports = { register, login, logout };
