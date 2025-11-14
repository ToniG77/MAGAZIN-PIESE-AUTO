const { User } = require('../database/models');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('[auth] POST /login body:', req.body);

    const existingUser = await User.findOne({ 
        where: {
             email: email,
        }
    });
    if (!existingUser) {
        console.log('[auth] user not found for email:', email);
        return res.status(400).json({ success: false, message: 'User not found', data: {} });
    }

    const isValidPassword = bcrypt.compareSync(password, existingUser.dataValues.password);

    if (!isValidPassword) {
        console.log('[auth] invalid password for user id:', existingUser.dataValues.id);
        return res.status(400).json({ success: false, message: 'Not the same password', data: {} });
    }

    const token = jwt.sign({id: existingUser.dataValues.id, role: existingUser.dataValues.role},
         process.env.TOKEN_SECRET,
         {expiresIn: '1h'});

         res.status(200).json({ success: true, message: 'Valid email and password', data: token });
});

// server/routes/auth.routes.js
const { isValidToken } = require('../utils/token.js');

router.post('/check', async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({success: false, message: 'Token not found', data: {}})
    }

    const validToken = isValidToken(token);

    if (!validToken) {
        return res.status(400).json({success: false, message: 'Token not valid', data: {}})
    }
    res.status(200).json({success: true, message: 'Token is valid', data:{} })

});

module.exports = router; 