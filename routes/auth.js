const express = require('express');
const authController=require('../controllers/auth');
const {check, body} = require('express-validator/check');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', 
[check('email')
.isEmail()
.withMessage('Please enter a valid email')
.custom((value, {req})=>{//value is email field
    if(value==='test@test.com'){
        throw new Error('This email address is forbidden.');
    }

    return true;//custom validation succeeded
}),
body('password', 'Default error message for all validators').isLength({min: 5}).isAlphanumeric(),
body('confirmPassword').custom((value, { req}) => {
    if(value !== req.body.password){
        throw new Error('passwords have to match!');
    }
    return true;
})//if we do not use withmessage then shall use default invalid value message
],authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;