const asynchandler = require('express-async-handler');

const AdminModel = require('../../models/adminModel');
const UserModel = require('../../models/userModel');

const generateToken = require('../../utils/tokenGenerate');


const Registration = asynchandler( async(req, res) => {
    try{

        const{email, password } = req.body;


        const emailCheck = await AdminModel.find({email: email});
       
        if(emailCheck.length > 0){
            return res.status(422).json(
                {
                    status: false,
                    message: 'Email already registered',
                    data: {}
                }
            )
        }
       

         let admin = new AdminModel({
            email,
            password,
           
         });

         let save = await admin.save();

         let getAdmin = await AdminModel.find({_id: save._id});

          res.status(201).json({
            status: true,
            message: 'Admin Registered',
            data: getAdmin,
            token: generateToken(getAdmin[0]._id)
          });


    }catch(error){
        res.status(500).send(error.message)
    }
});

const Login = asynchandler ( async(req, res) => {
    try{

        const {email, password} = req.body;

        const admin = await AdminModel.findOne({ email});

        if (admin && (await admin.matchPassword(password))) {

            res.status(201).json(
                {
                    status: true,
                    message: 'logged in',
                    data: admin,
                    token: generateToken(admin._id)
                });
        } else {
            res.status(422).json({
                status: false, 
                message: 'invalid email or password'
            });
        }


    }catch(error){
        res.status(500).send(error.message)
    }
});

const updateStatus = asynchandler( async (req, res) => {
    try{
        const {status, user_id} = req.body;

        if(!user_id){
            return res.status(422).json(
                {
                    status: false,
                    message: 'user id required'
                }
            )
        }

        const updateUser = await UserModel.findOneAndUpdate({_id: user_id}, {status});

        res.status(201).json(
            {
                status: true,
                message: 'Status updated',
                data: updateUser
            }
        )


    }catch(error){
        res.status(500).send(error.message)
    }
});

module.exports = {
    Registration,
    Login,
    updateStatus,
}