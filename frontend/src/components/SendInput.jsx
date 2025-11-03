import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { setMessages } from "../redux/messageSlice";
function SendInput() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Do not send empty messages
      if (!message.trim()) return;
      // send message to backend using socket io
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
    
      dispatch(setMessages([...messages, res.data.newMessage]));
     
      // dispatch an action to add the message to the redux store
      //dispatch(addMessage({message,fromSelf:true}));
    } catch (err) {
      console.log(err);
    }
     setMessage("");
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-500">
      <div className="flex gap-2 w-full relative">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message...."
          className="border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="absolute flex inset-y-0 end-0 items-center pr-4 text-blue-500 disabled:text-gray-500 hover:text-blue-600 transition-colors duration-200 ">
          <IoSendSharp className="text-xl" />
        </button>
      </div>
    </form>
  );
}

export default SendInput;
