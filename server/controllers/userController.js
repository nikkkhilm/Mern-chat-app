const asyncHandler=require('express-async-handler')
const User=require('../models/usermodel')
const generateToken=require('../config/genearateToken')

const registerUser=asyncHandler(async (req,res)=>{
    const {name,email,password,pic}=req.body;

    if(!name || !email || !password)
    {
        res.status(400);
        throw new Error("Please enter all the fields");
        console.log(Error);
    }

    const userExists =await User.findOne({email});

    if(userExists)
    {
        res.status(400);
        throw new Error("user already exists");
         console.log(Error);

    }
    const user=await User.create({
        name,email,password,pic
    });

    if(user)
    {
         console.log(user);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
        })    }
        else{
            res.status(400);
            throw new Error("Failed to create")
             console.log(Error);
        }
})


// authuser
const authUser=asyncHandler(async(req,res)=>{
        const {email,password} =req.body;

        const user=await User.findOne({email})

        if(user && (await user.matchPassword(password)))
        {
            res.status(201).json({
                _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
            })
        }
        else{
              res.status(400);
            throw new Error("Failed to create")
             console.log(Error);
        }

});

// we cna send the data to backend by body-in post but we will not use that here as we are using get so we are using query->api/user?search=piyush&lastname=agarwal  -> this is query
const allUsers=asyncHandler(async(req,res)=>{
    // console.log("inside")
    const keyword=req.query.search?{
        // or operation does or of expressions in an array
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{};
    const users=await User.find(keyword)
    .find({_id:{$ne:req.user._id}});
    res.send(users);
    // console.log(users);
})

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const { name, email, pic, password } = req.body;

    // Create an object to hold the fields being updated
    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (pic) updatedFields.pic = pic;

    // Handle password update separately to hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});





module.exports={registerUser,authUser,allUsers,updateProfile}
