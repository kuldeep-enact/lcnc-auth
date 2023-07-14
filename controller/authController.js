const models = require('../models');
const User = models.User;
const apiResponse = require('../utills/response');
const Utill = require('../utills/helper');
const Mailer = require('../utills/mailer');
const UploadImage = require('../utills/uploadImage');
const { token } = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');


const LinkExpiredModel = models.LinkExpired;
/**
 * @api {post} /api/v1/register
 * @apiName register user
 * @apiGroup User
 * @apiPermission UserAuthenticated
 * @apiDescription for authentication type=0[Email signup] first name, last name, email, password is mandatory
 *  for authentication type=1,2,3[google,fb,apple signup] only social id required
 * @apiParam {String} account_type  0-->Landlord , 1-->Teanant
 * @apiParam {String} authentication_type  0->Email, 1->Google, 2->Facebook, 3->Apple 
 * @apiParam {String} first_name 
 * @apiParam {String} last_name 
 * @apiParam {String} email 
 * @apiParam {String} password
 * @apiParam {String} social_id
 * @apiSuccess {Number} success Response Status Code 200.
 * @apiSuccess {String} message The response message.
 * @apiSuccessExample {json} Success-Response:
 * {
    "statusCode": 200,
    "message": "Singnup sucessfully",
    "user_details": {
        "image": "",
        "social_id": "",
        "phone_number": "",
        "id": 51,
        "first_name": "johne",
        "last_name": "doe",
        "email": "johndoe@gmail.com",
        "password": "$2a$10$A4CZTCHkgUg.OhOKygGZLO3UxRkXS5rLCufKXspRq7Iugqktqwz2u",
        "account_type": "0",
        "authentication_type": "0",
        "updatedAt": "2022-10-22T05:54:12.687Z",
        "createdAt": "2022-10-22T05:54:12.687Z",
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..scLVgdSOMezDQ0T_7APxoNqPHazC-AT3Uh-2bU-ru6o"
    },
   
}
 */


exports.register = async (req, res) => {
  try {
    const authentication_type = req.body.authentication_type;

   
    if (authentication_type == 0) {
      const { first_name, last_name, email, password, account_type, authentication_type,phone_number,address } = req.body;
      const useremail = await User.findOne({ where: { email: req.body.email } });
      
      if (useremail) {
        return apiResponse.DuplicateEmail(res);
      } else {
       
        const insertData = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: Utill.hashPassword(password),
          account_type: account_type,
          phone_number: phone_number ? phone_number : '',
          address:address ? address : '',
          authentication_type: authentication_type,
        
        };
        let user = await User.create(insertData);
        const id = user.id;
        console.log(id);
        user = user.toJSON();
       
        const token = Utill.generateToken(user);
        user.token = token;
        return apiResponse.SignUpSuccessFull(res, user);
      }
    }

    else if (authentication_type == 1 || authentication_type == 2 || authentication_type == 3) {
      const { account_type, authentication_type, social_id, first_name, last_name,image,email } = req.body;
      

      let getUser = await User.findOne({ where: { social_id: social_id } });
      
      //if already exist login user
      if (getUser) {
        const token = Utill.generateToken(getUser.toJSON());
        getUser = getUser.toJSON();
        getUser.token = token;
        return apiResponse.SignUpSuccessFull(res, getUser);
      }
      //for new user
      if (email) {
        const checkEmail = await User.findOne({where:{email:email}});
        if (checkEmail) {
          return apiResponse.FailedResponseWithData(res, res.__('USER_EXIST_WITH_EMAIL'));
        }
      }
      const insertData = {
        social_id: social_id,
        account_type: account_type,
        first_name: first_name ? first_name : '',
        last_name: last_name ? last_name : '',
        authentication_type: authentication_type,
        image:image ? image : '',
        email: email ? email : ''
      
      };
      let data = await User.create(insertData);
      data = data.toJSON();
      const token = Utill.generateToken(data);

      data.token = token;

      return apiResponse.SignUpSuccessFull(res, data);
    } else {
      return apiResponse.FailedResponseWithOutData(res, res.__('INVALID_AUTHENTICATION_TYPE'));
    }
  } catch (e) {

    return apiResponse.InternalServerError(res, e);

  }
};

exports.login = async (req, res) => {
  try {
    const {email,password} = req.body;
  
   
    let getUsers = await User.findOne({ where: { email: email } });

    if (!getUsers) {
      return apiResponse.FailedResponseWithOutData(res, res.__('WRONG_EMAIL_PASSWORD'));
    }
    const isMatch = Utill.compareHashPassword(password, getUsers.password);
    if (!isMatch) {
      return apiResponse.FailedResponseWithOutData(res, res.__('WRONG_EMAIL_PASSWORD'));
    }
    getUsers = getUsers.toJSON();
    // const getId = {
    //   id: user.id
    // };
    const token = Utill.generateToken({id:getUsers.id});
   
    getUsers.token = token;

  
    console.log(getUsers.token);
    
    return apiResponse.LoginSuccessFull(res,getUsers);


  } catch (e) {
    return apiResponse.InternalServerError(res, e);
  }
};


// exports.mail = async (req, res) => {
//   //console.log('yhn')
//   try {
//     const email = req.body.email
//     let html =
//       `Account Activation Link. <a href='https://api.rentsolute.com/activateAccount/${Utill.generateToken}'>
//             Click To Activate Account</a>`
//     await Mailer.sendMail(
//       process.env.EMAIL,
//       req.body.email,
//       "Activation Link.",
//       html
//     )


//     res.status(200).json({ sucess: true, message: "Mail has been sent and register successful" });


//   } catch (error) {
//     console.log(error)
//     res.status(400).send(error)
//   }
// }


exports.upload = async (req, res) => {
  console.log(req.file, req.file.location);
  res.json({ message: 'Successfully uploaded ', imageUrl: req.file.location });
};

exports.test = async (req, res) => {
  try {
    //return res.status(200).json({status:"200",message:res.__('SIGNUP_SUCESSFULL')})
   
    return apiResponse.SuccessResponseWithOutData(res, res.__('SIGNUP_SUCESSFULL'));
    // res.__('Hello')
  }
  catch (e) {
    console.log(e);
  }
};


exports.forgotPassword = async (req, res) => {
  //console.log('yhn')
  try {
    
    const tokenLink = makeid(20);
    console.log(tokenLink);
    const email = req.body.email;
    const getUsers = await User.findOne({where:{email:email}});
    if (!getUsers) {
      return apiResponse.FailedResponseWithOutData(res, res.__('EMAIL_DOES_NOT_EXIST'));
    }
    const user_id = getUsers.id;
    console.log(user_id);
    const findId = await LinkExpiredModel.findOne({where:{user_id:getUsers.id}});
    //const id = findId.user_id;
    // console.log(findId);
    // console.log(findId.user_id);
    if (findId) {
      console.log('sgdfhh');
      const destroyPreviousData = await LinkExpiredModel.destroy({
        where: {
          user_id:findId.user_id
        }
      });
    }
    //const user = await LinkExpiredModel.findOne({ userId: getUsers.id });
    
    // if (!user) {
    const insertData = {
      user_id: user_id,
      tokenLink :tokenLink

    };
    
    const data = await LinkExpiredModel.create(insertData);
    //}
      
    
    const html =
              '<p> Hii ' + ` , Please click the link and <a href="https://www.rentsolute.enactstage.com//stage/api/v1/update-password/${ tokenLink }">Set password</a>`; //-->http://43.205.51.243
    await Mailer.sendMail(
      process.env.EMAIL,
      req.body.email,
      'Reset Password Link.',
      html
    );
        
        
    return apiResponse.SuccessResponseWithOutData(res, res.__('LINK_SEND_TO_EMAIL'));
    
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }
};


exports.updatePassword = async (req, res) => {
  try {
    console.log(req.params);
    console.log('params', req.params.tokenLink);
    const tokenLink = req.params.tokenLink;
    // const ID = token.id;
    // console.log('ID ______',token.id);
    //    const id = req.params.id
   
    // const verify = jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
    //   if (err) {
    //     console.log(err);
    //     return apiResponse.UnAuthorized(res,'UnAuthorised user');
    //   }
    //   else {

    
    const userId = await LinkExpiredModel.findOne({ where: {tokenLink:tokenLink} });
    //console.log(userToken);
    if (!userId) {
      return res.render('linkExpires', {tokenLink:tokenLink });
    }
    res.render('setPassword', { tokenLink:tokenLink });
        
    //   }
     
     
    //   //console.log(decoded)

    // });
      
    
  } catch (error) {
    console.log(error);
  
    return apiResponse.InternalServerError(res,error);
    
  }
        
};

exports.setPassword =  async (req, res) => {

  try {
   
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
   
    console.log(req.body);
    const tokenLink = req.body.tokenLink;
    console.log('----------------------------',tokenLink);
    

    //const isMatch = await bcrypt.compare(password, useremail.password)
    const hashPassword = Utill.hashPassword(newPassword,10);
 
    const getUserId = await LinkExpiredModel.findOne({where:{tokenLink:tokenLink}});
    console.log('---------',getUserId);
    console.log('----------------------',getUserId.user_id);
    const user_id = getUserId.user_id;
    
    await User.update({
      password:hashPassword,
     
    },
    { 
      where:{
        id : user_id
       
      },
      individualHooks: true,
     
     
    }
    );
    
    await LinkExpiredModel.destroy({
      where: {
        tokenLink:req.body.tokenLink
      }
    });
  
    //return apiResponse.PasswordUpdatedSucessfully(res, 'Updated Sucessfully');
    return res.render('passwordUpdatedSucessfully', {tokenLink:req.body.tokenLink},);

  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }
};

exports.changePassword = async (req,res) => {
  try {
    const new_password = req.body.new_password;
    const old_password = req.body.old_password;

    const id = req.userData.id;
    const getUser = await User.findOne({where:{id:id}});
    console.log(getUser.password);
    const isMatch = Utill.compareHashPassword(old_password,getUser.password);
    if (!isMatch) {
      return apiResponse.FailedResponseWithOutData(res, res.__('PASSWORD_DOES_NOT_MATCH_WITH_OLD_PASSWORD'));
    }
    if (old_password == new_password) {
      return apiResponse.FailedResponseWithOutData(res,res.__('SAME_PASSWORD'));
    }
    const hashPassword = Utill.hashPassword(new_password);
    const changePassword =   await User.update({
      password:hashPassword,
    },
    {
      where:{
        id:req.userData.id
      },
      individualHooks: true,
    }
   
    );
    return apiResponse.SuccessResponseWithOutData(res, 'Password updated sucessfully');
    
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }
};


function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.profile = async(req,res) => {
  try {
  
    const findId = await User.findOne({where:{id:req.userData.id}});
  
    if (!findId) {
      return apiResponse.FailedResponseWithOutData(res, res.__('EMAIL_DOES_NOT_EXIST'));
    }
    const fields = ['first_name','last_name','phone_number','address', 'image','file_name'];
    const fetchData = {};
    for (const field of fields) {

      if (req.body[field]) {
        fetchData[field] = req.body[field];
      }
      console.log(req.body[field]);

      if (req.file) {
        fetchData['image'] = req.file.location;
     
      }
     
    }
    console.log(req.file);
    await User.update(
      fetchData,
      {where:{
        id:req.userData.id
      },
      individualHooks:true
      });

    // if (req.file) {
    //   insertData['image'] = req.file.location;
    //   insertData['file_name'] = req.file.originalname;


    // }
   

    // const update =   await User.update({
    //   first_name:req.body.first_name,
    //   last_name:req.body.last_name,
    //   phone_number:req.body.phone_number,
    //   address:req.body.address,
    //   image:req.file.location,
    //   file_name : req.file.originalname,

    // },
    // {
    //   where:{
    //     id:req.userData.id
    //   },
    //   individualHooks: true,
    // }
   
    // );
    const findUser = await User.findOne({where:{id:req.userData.id}});
    return apiResponse.SuccessResponseWithData(res,res.__('UPDATED_SUCESSFULLY'),findUser);
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }

};

exports.getProfile = async(req,res) => {
  try {
    const findUser = await User.findOne({where:{id:req.userData.id}});
    if (!findUser) {
      return apiResponse.FailedResponseWithOutData(res,res.__('EMAIL_DOES_NOT_EXIST'));
    }

    return apiResponse.SuccessResponseWithData(res,findUser);
  } catch (error) {
    return apiResponse.InternalServerError(res, error);
  }
};