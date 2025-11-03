import mongoose from "mongoose";
const userModel = new mongoose.Schema({
  fullname: {  
     type: String,
     required: true,
  },
   username: {
        type: String,
        required: true,
        unique: true,
   },
   password: {
        type: String,
        required: true,
   },
   profilePhoto: {
        type: String,
        default: " ",
   },   
   gender: {
        type: String,   
        enum:["male","female"],
        required: true,
   },
  },{timestamps: true});

  export default mongoose.model("User", userModel);