import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { fetchRelationshipStatus, sendFriendRequest, acceptFriendRequest } from "../redux/friendSlice";

function Otheruser({ user }) {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const rel = useSelector((store) => store.friends.statusByUser[user?._id || user?.id]);
  const isOnline = onlineUsers?.includes(user?._id);
  const selectedUserHandler = (user) => {
    //  console.log(user);
    dispatch(setSelectedUser(user));
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchRelationshipStatus(user._id));
    }
  }, [dispatch, user?._id]);
  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={`${
          selectedUser?._id === user?._id
            ? "bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 text-white border-transparent"
            : isOnline
              ? "bg-neutral-800/60 hover:bg-neutral-800/80 text-slate-200 border-green-500/40"
              : "hover:bg-neutral-800/60 text-slate-200 border-slate-600/40"
        } flex items-center gap-3 md:gap-4 px-2 py-2 md:p-3 rounded-lg cursor-pointer border min-h-[56px] transition-colors`}
      >
        <div className={`avatar`}>
          <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-slate-700 ${isOnline ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900' : 'ring-1 ring-slate-700'}`}>
            <img
              className="w-full h-full object-cover"
              src={
                user?.profilePhoto ||
                user?.avatar ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    user?.fullname ||
                      user?.name ||
                      user?.username ||
                      user?.email ||
                      "User"
                  )
              }
              alt="userprofile"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-neutral-900"></span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex gap-2 justify-between items-center">
            <p className="font-medium text-sm md:text-base">
              {user?.fullname ||
                user?.name ||
                user?.username ||
                user?.email ||
                "Unknown User"}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/30 text-slate-300'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              {(!rel || rel.status === 'none') && (
                <button
                  className="btn btn-xs bg-gradient-to-r from-indigo-600 to-sky-600 text-white border-0"
                  onClick={(e) => { e.stopPropagation(); dispatch(sendFriendRequest(user._id)); }}
                >
                  Request
                </button>
              )}
              {rel && rel.status === 'pending' && rel.direction === 'outgoing' && (
                <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-slate-600/40 text-slate-200">Requested</span>
              )}
              {rel && rel.status === 'pending' && rel.direction === 'incoming' && (
                <button
                  className="btn btn-xs bg-gradient-to-r from-indigo-600 to-sky-600 text-white border-0"
                  onClick={(e) => { e.stopPropagation(); dispatch(acceptFriendRequest(user._id)); }}
                >
                  Accept
                </button>
              )}
              {rel && rel.status === 'accepted' && (
                <button
                  className="btn btn-xs btn-outline border-slate-500 text-slate-200 hover:border-indigo-400 hover:text-indigo-300"
                  onClick={(e) => { e.stopPropagation(); dispatch(setSelectedUser(user)); }}
                >
                  Message
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Otheruser;
