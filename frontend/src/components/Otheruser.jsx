import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setOtherUsers } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import { fetchRelationshipStatus, sendFriendRequest, acceptFriendRequest } from "../redux/friendSlice";
import axios from "axios";
import { BASE_URL } from "../config.js";
import toast from "react-hot-toast";
import { BiTrash } from "react-icons/bi";

function Otheruser({ user }) {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers, otherUsers } = useSelector((store) => store.user);
  const rel = useSelector((store) => store.friends.statusByUser[user?._id || user?.id]);
  const isOnline = onlineUsers?.includes(user?._id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
  };

  const handleDeleteChat = async (e) => {
    e.stopPropagation();
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${BASE_URL}/api/v1/message/delete/${user._id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      
      // Remove user from the list
      const updatedUsers = otherUsers.filter(u => u._id !== user._id);
      dispatch(setOtherUsers(updatedUsers));
      
      // Clear selected user and messages if this was the active chat
      if (selectedUser?._id === user._id) {
        dispatch(setSelectedUser(null));
        dispatch(setMessages([]));
      }
      
      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete chat');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
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
            ? "bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600 text-white border-transparent shadow-lg shadow-orange-500/30 scale-[1.02]"
            : isOnline
              ? "bg-gradient-to-br from-neutral-800/80 to-neutral-800/60 hover:from-neutral-800 hover:to-neutral-800/80 text-slate-200 border-green-500/40 hover:border-green-500/60 hover:shadow-md hover:shadow-green-500/20"
              : "bg-gradient-to-br from-neutral-800/50 to-neutral-800/30 hover:from-neutral-800/70 hover:to-neutral-800/50 text-slate-200 border-slate-600/30 hover:border-slate-500/50 hover:shadow-md"
        } flex items-center gap-3 md:gap-4 px-3 py-3 md:p-4 rounded-xl cursor-pointer border min-h-[64px] transition-all duration-300 ease-out backdrop-blur-sm group`}
      >
        <div className={`avatar flex-shrink-0`}>
          <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 transition-all duration-300 ${isOnline ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900 group-hover:ring-green-400 group-hover:ring-offset-4' : 'ring-1 ring-slate-600/50 group-hover:ring-slate-500'}`}>
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
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-neutral-900 animate-pulse"></span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm md:text-base truncate group-hover:text-white transition-colors">
                {user?.fullname ||
                  user?.name ||
                  user?.username ||
                  user?.email ||
                  "Unknown User"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium transition-all ${isOnline ? 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30' : 'bg-slate-600/30 text-slate-400'}`}>
                  {isOnline ? '● Online' : '○ Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Delete chat button - only show for users with conversation history */}
              {rel && rel.status === 'accepted' && (
                <div className="relative">
                  {showDeleteConfirm ? (
                    <div className="flex gap-1 animate-fadeIn">
                      <button
                        className="btn btn-xs bg-red-500 hover:bg-red-600 text-white border-0 shadow-md transition-all"
                        onClick={handleDeleteChat}
                        disabled={isDeleting}
                      >
                        {isDeleting ? '...' : 'Yes'}
                      </button>
                      <button
                        className="btn btn-xs bg-slate-600 hover:bg-slate-700 text-white border-0 shadow-md transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-xs btn-square bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all"
                      onClick={handleDeleteChat}
                      title="Delete chat"
                    >
                      <BiTrash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
              
              {(!rel || rel.status === 'none') && (
                <button
                  className="btn btn-xs bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0 hover:from-orange-600 hover:to-pink-700 shadow-md hover:shadow-lg transition-all"
                  onClick={(e) => { e.stopPropagation(); dispatch(sendFriendRequest(user._id)); }}
                >
                  Add
                </button>
              )}
              {rel && rel.status === 'pending' && rel.direction === 'outgoing' && (
                <span className="text-[10px] md:text-xs px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium">Pending</span>
              )}
              {rel && rel.status === 'pending' && rel.direction === 'incoming' && (
                <button
                  className="btn btn-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all animate-pulse"
                  onClick={(e) => { e.stopPropagation(); dispatch(acceptFriendRequest(user._id)); }}
                >
                  Accept
                </button>
              )}
              {rel && rel.status === 'accepted' && (
                <button
                  className="btn btn-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                  onClick={(e) => { e.stopPropagation(); dispatch(setSelectedUser(user)); }}
                >
                  Chat
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
