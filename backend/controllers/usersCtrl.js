const asyncHandler = require("express-async-handler")
const User = require("../model/User")
const bcrypt =require("bcryptjs")
const jwt = require("jsonwebtoken")

const usersController = {
    //!====== Registration ===================>
    register: asyncHandler(async (req, res)=>{

        const {username, email, password} = req.body
        // console.log(req.body);
        if(!username || !email || !password){
            throw new Error("Please all fields are required")
        }

        const userExists = await User.findOne({email})
        if(userExists){
            throw new Error("User already exists")
        }
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)
        const userCreated = await User.create({
            username,
            email,
            password:hashedpassword
        })
        res.json({
            username: userCreated.username,
            email:userCreated.email,
            id: userCreated._id
        })
        console.log(userCreated);

}),
    //!=== Login =========>
        login: asyncHandler(async(req, res)=>{
            const {email, password}= req.body

            const user = await User.findOne({email})
            if(!user){
                throw new Error(`Invalid Login Credentials`)
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                throw new Error(`Invalid Login Credentials`)
            }
            const token = jwt.sign({id: user._id}, "srishylamrk",{
                expiresIn: '30d'
            })
            res.json({
                message:"Login Success",
                token,
                id:user._id,
                username: user.username,
                email: user.email
            })
        }),
        //!==========profile========>

    profile: asyncHandler(async (req, res) =>{
        console.log(req.user);
        const user = await User.findById(req.user)
        if(!user){
            throw new Error('User Not Found')
        }
        res.json({
            username: user.username,
            email:user.email
        })
    }),

    //!========= change password=============>

    changeUserPassword: asyncHandler(async (req, res) =>{
        // console.log(req.user);
        const {newPassword} = req.body
        const user = await User.findById(req.user)
        if(!user){
            throw new Error('User Not Found')
        }
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(newPassword, salt)
        user.password = hashedpassword
        await user.save({
            validateBeforeSave: false
        })

        res.json({
            message: "Password Changed Successfully"
        })
    }),

    //!=================update password=================>

        updateUserProfile: asyncHandler(async (req, res) =>{
            // console.log(req.user);
            const {username, email} = req.body
            const updatedUser = await User.findByIdAndUpdate(
                req.user, 
                {
                    username,
                    email
                },{
                    new:true
                }
            )
            res.json({message: 'User Profile Updated Successfully', updatedUser})
            
        })
}

module.exports = usersController