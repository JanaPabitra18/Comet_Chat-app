import React, {  } from "react";
import Otheruser from "./Otheruser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";
import { BiMessageSquareDetail } from "react-icons/bi";

function Otherusers() {
  // Trigger fetch via custom hook
  useGetOtherUsers();

  const { otherUsers } = useSelector((store) => store.user);
  
  if (!otherUsers) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="loading loading-spinner loading-lg text-orange-500"></div>
          <p className="text-slate-400 text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  if (otherUsers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3 px-4">
          <BiMessageSquareDetail className="w-16 h-16 mx-auto text-slate-600" />
          <div>
            <p className="text-slate-400 text-sm font-medium">No conversations yet</p>
            <p className="text-slate-500 text-xs mt-1">Search for users to start chatting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-2 animate-fadeIn">
      {otherUsers.map((user, index) => (
        <div 
          key={user._id || user.id} 
          className="animate-slideIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Otheruser user={user} />
        </div>
      ))}
    </div>
  );
}

export default Otherusers;
