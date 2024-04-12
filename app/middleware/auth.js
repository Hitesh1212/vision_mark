const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AdminModel = require('../models/adminModel');
const UserModel = require('../models/userModel');

const adminProtect = asyncHandler (async (req, res, next) => {
    
    try{
        let token;
        token = req.headers.authorization;

        const decoded = jwt.verify(token, 'vision@mark2024');

        if(Date.now() <= decoded.exp) {
            return res.status(401).json({ status: false, message: 'Token Expired', data: {} });
        };
        req.admin = await AdminModel.findById(decoded._id).select('-password');


        if(req.admin){
            next();
        } else {
            res.status(401).json({
                status: false,
                message: 'Not authorized, token failed',
                data: {},
              });
        }

    }catch(error){
        res.status(500).send(error.message)
    }
});

const userProtect = asyncHandler (async (req, res, next) => {
    try{
        let token;
        token = req.headers.authorization;

        const decoded = jwt.verify(token, 'vision@mark2024');

        if(Date.now() <= decoded.exp) {
            return res.status(401).json({ status: false, message: 'Token Expired', data: {} });
        };
        req.user = await UserModel.findById(decoded._id).select('-password');


        if(req.user){
            next();
        } else {
            res.status(401).json({
                status: false,
                message: 'Not authorized, token failed',
                data: {},
              });
        }

    }catch(error){
        res.status(500).send(error.message)
    }
});



module.exports = {adminProtect, userProtect}