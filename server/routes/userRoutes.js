const express=require('express')
const {registerUser,authUser,allUsers, updateProfile}=require('../controllers/userController')
const {protect}=require('../middlewares/authMiddleware')

const router=express.Router()

router.route('/').post(registerUser)//type 1 of routing

router.post('/login',authUser)//type 2 of routing

router.route('/').get(protect,allUsers);

router.put('/profile/update',protect,updateProfile);

module.exports=router