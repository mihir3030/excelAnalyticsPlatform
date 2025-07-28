import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import {generateToken} from '../configs/utils.js'

// Signup controller
export const signup = async (req, res) => {
  // signup logic
  try {
    // first we need to get signup data from body
    const { fullName, email, password } = req.body;

    //validate fields are empty
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // validate if password length is < 6
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be in 6 digit" });

    // check if user already exist or not
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email already registered" });
    
    //hash password
    const salt = await bcrypt.genSalt(10)  /// generate 10 number string
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const newUser = new User({
        fullName: fullName,
        email: email,
        password: hashedPassword
    })

    // if user save so generate jwt token
    if(newUser){
        // generate jwt token
        generateToken(newUser._id, res)  // create jwt token
        await newUser.save()

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullName,
            email: newUser.email,
            profilPic: newUser.profilePic,
            role: newUser.role
        })
    } else {
        res.status(400).json({message: "Invalid User Data"})
    }

  } catch (error) {
    res.status(500).json({error: `Internal Server Error - ${error}`})
  }
};


// Login Controller
export const login = async (req, res) => {
  const {email, password} = req.body
  try {
    // check if email is in DB or not
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message: "User Not found"})
    
    // if User is there So check password if correct or not
    const isPassworsCorrect = await bcrypt.compare(password, user.password)
    
    // if password does not match return - false
    if(!isPassworsCorrect) return res.status(400).json({message: "Wrong Email or Password"})

    // if everything is right generate new token if signup token override it
    generateToken(user._id, res)

    res.status(201).json({
      _id: user._id,
      fullname: user.fullName,
      email: user.email,
      profilPic: user.profilePic,
      role: user.role
    })

  } catch (error) {
    res.status(500).json({error: `Internal Server Error ${error.message}`})
    
  }
}



// LOGOUT
export const logout = async (req, res) => {
  try {
    // clear cookies so user logout
    res.cookie("jwt", {maxAge:0})
    res.status(200).json({message: "You have been logged out"})
  } catch (error) {
    res.status(500).json({error: `Internal Server Error ${error.message}`})
  }
}


/// check current user
export const checkUser = (req, res) => {
  try {
    const user = res.status(200).json(req.user)
  } catch (error) {
    res.status(500).json({error: `Internal error ${error}`})
  }
}

/// get All USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({error: `Internal error ${error}`})
    
  }
}