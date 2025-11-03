import React, {  } from "react";
import Otheruser from "./Otheruser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

function Otherusers() {
  // Trigger fetch via custom hook
  useGetOtherUsers();

  const { otherUsers } = useSelector((store) => store.user);
  
if(!otherUsers) return <div>Loading users...</div>;
  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
      {otherUsers.map((user) => (
        <Otheruser key={user._id || user.id} user={user} />
      ))}
    </div>
  );
}

export default Otherusers;
