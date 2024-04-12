const asynchandler = require('express-async-handler');

const UserModel = require('../../models/userModel');

const generateToken = require('../../utils/tokenGenerate');

const fs = require('fs');
const path = require('path');

const Registration = asynchandler( async(req, res) => {
    try{

        const{email, password } = req.body;


        const emailCheck = await UserModel.find({email: email});
        
        if(emailCheck.length > 0){
            return res.status(422).json(
                {
                    status: false,
                    message: 'Email already registered',
                    data: {}
                }
            )
        }

        let getData = await UserModel.find({}).sort({createdAt : -1});

        let UserId = "" ;
        let Id = 1;

        if(getData.length > 0){
             Id = getData[0]['increment_id'] + 1;
             UserId = 'U-00' + Id;

        } else{
            UserId = 'U-001'
        }

         let user = new UserModel({
            email,
            password,
            unique_id: UserId,
            increment_id: Id,
         });

         let save = await user.save();

         let getUser = await UserModel.find({_id: save._id});

          res.status(201).json({
            status: true,
            message: 'User Registered',
            data: getUser,
            token: generateToken(getUser[0]._id)
          });


    }catch(error){
        res.status(500).send(error.message)
    }
});

const Login = asynchandler ( async(req, res) => {
    try{

        const {email, password} = req.body;

        const user = await UserModel.findOne({ email});

        if (user && (await user.matchPassword(password))) {

            res.status(201).json(
                {
                    status: true,
                    message: 'logged in',
                    data: user,
                    token: generateToken(user._id)
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

const uploadImage = asynchandler(async (req, res) => {
    let sampleFile;
    let uploadPath;
    console.log(req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    let epoch = Moment().unix()
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.photo;
  
    const multiple = async (sampleFile) => {
      let paths = path.join(__dirname, `../uploads/user/image/${req.user._id}`)
    
    let uploadPaths =  sampleFile.map((sampleFile) => {
    return `${process.env.URL}user/image/${req.user._id}/${epoch}${sampleFile.name}`
   })
   
    if (!fs.existsSync(paths)) {
  
      fs.mkdir(paths, { recursive: true }, async function (err) {
        if (err) {
          return res.status(400).json({
            status: false,
            message: 'unable to create folder'
          });
        } else {
          sampleFile.map((sampleFile) => {
            
              uploadPath = path.join(__dirname, `../uploads/user/image/${req.user._id}/${epoch}${sampleFile.name}`)
             
              sampleFile.mv(uploadPath, async function (err) {
              if (err) {
                return res.status(500).send(err);
              } 
        
            });
          })
      
          const UserData = await UserModel.findById(req.user._id);
      
              if (UserData) {
      
    
                const asdsad = await UserModel.updateOne({ _id: req.user._id }, { image: uploadPaths });
      
                const updateUser = await UserModel.findOne({ _id: req.user._id });
      
                res.json({
                  status: true,
                  message: 'user image saved',
                  data: {
                    "_id": updateUser._id,
                    "email": updateUser.email,
                    "password": updateUser.password,
                    "unique_id": updateUser.unique_id,
                    "status": updateUser.status,
                    "image": updateUser.image,
                  
                  }
                });
              } else {
                res.status(404).json({
                  status: false,
                  message: 'User not found'
                })
      
              }
          
        }
      })
    } else {
      sampleFile.map((sampleFile) => {
        
          uploadPath = path.join(__dirname, `../uploads/user/image/${req.user._id}/${epoch}${sampleFile.name}`)
          
          sampleFile.mv(uploadPath, async function (err) {
          if (err) {
            return res.status(500).send(err);
          } 
    
        });
      })
  
      const UserData = await UserModel.findById(req.user._id);
  
          if (UserData) {
  
  
            const asdsad = await UserModel.updateOne({ _id: req.user._id }, { image: uploadPaths });
  
            const updateUser = await UserModel.findOne({ _id: req.user._id });
  
            res.json({
              status: true,
              message: 'user image saved',
              data: {
                "_id": updateUser._id,
                "email": updateUser.email,
                "password": updateUser.password,
                "unique_id": updateUser.unique_id,
                "status": updateUser.status,
                "image": updateUser.image,
              
              }
            });
          } else {
            res.status(404).json({
              status: false,
              message: 'User not found'
            })
  
          }
      
    }
    }
  
    const single = async (sampleFile) => {
      uploadPath = path.join(__dirname, `../uploads/user/image/${req.user._id}/${epoch}${sampleFile.name}`);
    let paths = path.join(__dirname, `../uploads/user/image/${req.user._id}`)
    let uploadPaths = `${process.env.URL}user/image/${req.user._id}/${epoch}${sampleFile.name}`
  
    if (!fs.existsSync(paths)) {
  
      fs.mkdir(paths, { recursive: true }, function (err) {
        if (err) {
          return res.status(400).json({
            status: false,
            message: 'unable to create folder'
          });
        } else {
          sampleFile.mv(uploadPath, async function (err) {
            if (err) {
              return res.status(500).send(err);
            } else {
              const User = await User.findById(req.user._id);
  
              if (User) {
  
  
                const asdsad = await UserModel.updateOne({ _id: req.user._id }, { image: uploadPaths });
  
                const updateUser = await UserModel.findOne({ _id: req.user._id });
  
                res.json({
                  status: true,
                  message: 'user image saved',
                  data: {
                    "_id": updateUser._id,
                    "email": updateUser.email,
                    "password": updateUser.password,
                    "unique_id": updateUser.unique_id,
                    "status": updateUser.status,
                    "image": updateUser.image,
                  
                  }
                });
              } else {
                res.status(404).json({
                  status: false,
                  message: 'User not found'
                })
  
              }
            }
  
          });
        }
      })
    } else {
      sampleFile.mv(uploadPath, async function (err) {
        if (err) {
          return res.status(500).send(err);
        } else {
          const UserData = await UserModel.findById(req.user._id);
  
          if (UserData) {
  
  
            const asdsad = await UserModel.updateOne({ _id: req.user._id }, { image: uploadPaths });
  
            const updateUser = await UserModel.findOne({ _id: req.user._id });
  
            res.json({
              status: true,
              message: 'user image saved',
              data: {
                "_id": updateUser._id,
                "email": updateUser.email,
                "password": updateUser.password,
                "unique_id": updateUser.unique_id,
                "status": updateUser.status,
                "image": updateUser.image,
              
              }
            });
          } else {
            res.status(404).json({
              status: false,
              message: 'User not found'
            })
  
          }
        }
  
      });
    }
    }
  
    // Use the mv() method to place the file somewhere on your server
  
   Array.isArray(sampleFile) ? multiple(sampleFile) : single(sampleFile)
  
  });

module.exports = {
    Registration,
    Login,
    uploadImage,
}