import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ sucess: false, message: "Missing details" });
    }
    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res
        .status(400)
        .json({ message: "User with this email is already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token);
    res.status(201).json({
      message: "User Registration successfull",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("error in user registration", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      message: "User login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
     console.error("Error in user login:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const userCredits = async(req,res)=>{
  try{
    
    const userId = req.userId || req.body.userId;
    if(!userId){
      return res.status(400).json({success:false,message:"Missing user id"});
    }
    const user= await userModel.findById(userId);
    if(!user){
      return res.status(404).json({success:false,message:"User not found"});
    }
    res.status(200).json({success:true,credits:user.creditBalance,user:{name:user.name}})
  }
  catch(error)
  {
    console.log("error in userCredits",error.message);
    res.status(500).json({message:"internal server error"})

  }
}
