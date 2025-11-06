import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { io ,getReceiverSocketId} from "../socket/socket.js";

export const sendMessage = async (req, res) => {
   //  console.log("req.body:", req.body);
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const{message}=req.body;

         if(!message || message.trim()===""){
            return res.status(400).json({message:"Message cannot be empty"});
         }

        let gotConversation= await Conversation.findOne({
            participants:{ $all: [senderId, receiverId] }
        });
        if(!gotConversation){
            gotConversation= await Conversation.create ({
                participants:[senderId, receiverId]
        
            })
           // await gotConversation.save();
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message 
        });
        //await newMessage.save();
        
// if (!gotConversation.messages) {
//     gotConversation.messages = [];
// }

// gotConversation.messages.push(newMessage._id)
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
            // return res.status(500).json({message:"Failed to send message"});
        
         // await gotConversation.save();
          await Promise.all([
            gotConversation.save(),
            newMessage.save()
          ]);
            //SOKET.IO PART   
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage",newMessage);
            }
            return res.status(200).json({message:"Message sent successfully", newMessage});
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const fetchMessages = async (req, res) => {
    try {
        const senderId = req.id; // Authenticated user's ID
        const receiverId = req.params.id; // ID of the other user from the route parameter

        // Find the conversation between the two users
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');
         //console.log(conversation); 
        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        // Fetch messages in the conversation
        const messages = await Message.find({
            _id: { $in: conversation.messages }
        }).sort({ createdAt: 1 }); // Sort messages by creation time
      
        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const deleteConversation = async (req, res) => {
    try {
        const userId = req.id; // Authenticated user's ID
        const otherUserId = req.params.id; // ID of the other user

        // Find the conversation between the two users
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        // Delete all messages in the conversation
        await Message.deleteMany({
            _id: { $in: conversation.messages }
        });

        // Delete the conversation itself
        await Conversation.findByIdAndDelete(conversation._id);

        return res.status(200).json({ 
            message: "Conversation deleted successfully",
            success: true 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}