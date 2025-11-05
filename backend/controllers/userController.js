import User from '../models/userModel.js';
import Conversation from '../models/conversationModel.js';
import bcrypt from 'bcryptjs';
import e from 'express';
import jwt from 'jsonwebtoken';  // If you plan to use JWT

export const registerUser = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        // Validate fields
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Password confirmation check
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password do not match" });
        }

        // Check if username already exists
        const user= await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate profile photo URL based on gender
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        //const otherProfilePhoto = `https://avatar.iran.liara.run/public/robot?username=${username}`; // Handle non-binary or other genders

        // let profilePhoto;
        // if (gender === "male") {
        //     profilePhoto = maleProfilePhoto;
        // } else if (gender === "female") {
        //     profilePhoto = femaleProfilePhoto;
        // } else {
        //     profilePhoto = otherProfilePhoto;  // Default to robot for non-binary or other genders
        // }

        // Create the user in the database
        await User.create({
            fullname,
            username,
            password: hashedPassword,
            profilePhoto:gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });

        // Optionally, you can issue a JWT token here for session management
        //const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response
        return res.status(201).json({
            message: "User registered successfully",
            success:true,
            // token,  // Send the JWT token back to the client
            // user: {
            //     username: newUser.username,
            //     fullname: newUser.fullname,
            //     gender: newUser.gender,
            //     profilePhoto: newUser.profilePhoto
            // }
        })

    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        return res.status(500).json({ message: "Server error" });
    }
};
//  export const loginUser = async (req, res) => {
//     try{
//         const{ username, password }= req.body;
//         if()
//     }
//  }
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate fields
        if (!username || !password ) {
            return res.status(400).json({ message: "Username and Password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password",
                success:false
             });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password",
                
             });
        }
        const tokenData={
            userId: user._id
           // username: user.username,
        };
        // const token= jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn:'1d'});
        // Optionally, you can issue a JWT token here for session management
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return success response
        return res.status(200).cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production' ? true : false,
            path: '/',
            maxAge: 1*24*60*60*1000
        }).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            profilePhoto: user.profilePhoto,
    });
} catch (error) {
        console.error(error);  // Log the error for debugging purposes
        return res.status(500).json({ message: "Server error" });
    }

}
export const logoutUser = (req, res) => {
    try{
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    
      });
      return res.status(200).json({message:"Logged out successfully"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getotherUserProfile= async(req,res)=>{
    try {
        const loggedInUserId=req.id;
        const search = (req.query.search || "").trim();

        // Base query: all users except the logged-in user
        const baseQuery = { _id: { $ne: loggedInUserId } };

        // If a search term is provided, filter by fullname or username (case-insensitive)
        const query = search
            ? {
                ...baseQuery,
                $or: [
                    { fullname: { $regex: search, $options: "i" } },
                    { username: { $regex: search, $options: "i" } }
                ]
              }
            : baseQuery;

        const otheruser= await User.find(query).select("-password -createdAt -updatedAt -__v");
        if(!otheruser){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({otheruser});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getChatUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const search = (req.query.search || "").trim();

        // Find conversations that include the logged-in user
        const conversations = await Conversation.find({ participants: loggedInUserId }).select('participants');

        // Build a unique list of other participant IDs
        const ids = new Set();
        conversations.forEach(conv => {
            conv.participants.forEach(pId => {
                if (String(pId) !== String(loggedInUserId)) ids.add(String(pId));
            });
        });

        const idList = Array.from(ids);
        if (idList.length === 0) {
            return res.status(200).json({ otheruser: [] });
        }

        // Base query restricted to contacts only
        const baseQuery = { _id: { $in: idList } };
        const query = search
            ? {
                ...baseQuery,
                $or: [
                    { fullname: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } }
                ]
              }
            : baseQuery;

        const otheruser = await User.find(query).select('-password -createdAt -updatedAt -__v');
        return res.status(200).json({ otheruser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}