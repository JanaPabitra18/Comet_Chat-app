import axios from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { BASE_URL } from "../main.jsx";
const useGetMessages = () => {
const{ selectedUser}=useSelector(store=>store.user);
const dispatch =useDispatch();
  useEffect(() => {
    // Do not attempt fetch until a user is selected
    if (!selectedUser?._id) return;
    const fetchMessages = async () => {
        try {
            axios.defaults.withCredentials=true;
         const res = await axios.get(`${BASE_URL}/api/v1/message/${selectedUser?._id}`);
         // Normalize response to an array
         const d = res?.data;
         const list = Array.isArray(d?.messages)
           ? d.messages
           : Array.isArray(d?.data)
           ? d.data
           : Array.isArray(d)
           ? d
           : [];
         dispatch(setMessages(list));
        }
        catch(error) {
      // Gracefully handle 404 (no conversation yet) by setting empty list
      if (error?.response?.status === 404) {
        console.warn("No messages yet for this conversation (404)");
        dispatch(setMessages([]));
        return;
      }
      console.error(error);
        }
    }
    fetchMessages();
  }, [selectedUser?._id, dispatch]);
};

export default useGetMessages;
