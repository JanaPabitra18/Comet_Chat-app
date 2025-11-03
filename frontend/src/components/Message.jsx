
import { useEffect, useRef } from 'react'
import {useSelector} from "react-redux";

const Message = ({message}) => {
    const scroll = useRef();
    const {authUser,selectedUser} = useSelector(store=>store.user);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);
    
    return (
      
      <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
        <img alt="Tailwind CSS chat bubble component" src={message?.senderId === authUser?._id ? authUser?.profilePhoto  : selectedUser?.profilePhoto } />
    </div>
  </div>
  <div className="chat-header">
    {message?.senderId === authUser?._id ? authUser?.fullname || authUser?.username : selectedUser?.fullname || selectedUser?.username}
    <time className="text-xs opacity-50"> 
      {new Date(message?.createdAt).toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
    </time>
  </div>
    <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' :''} `}>{message?.message}</div>
  <div className="chat-footer opacity-50">
    Sent at {new Date(message?.createdAt).toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
  </div>
</div>
        
    )
}

export default Message