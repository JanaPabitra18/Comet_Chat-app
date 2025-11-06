import { ImSearch } from "react-icons/im";
import { BiLogOut, BiMessageSquareDetail } from "react-icons/bi";
import Otherusers from "./Otherusers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOtherUsers ,setAuthUser, setSelectedUser} from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import { BASE_URL } from "../config.js";
const Sidebar = () => {
  const [search, setSearch] = useState("");
  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/user/logout`, { withCredentials: true });
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
      dispatch(setSelectedUser(null));
      dispatch(setOtherUsers(null));
      dispatch(setMessages([]));
      try { localStorage.removeItem('auth_token'); } catch {}
    } catch (error) {
      console.log(error);
    }
  };
  const searchSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const term = search.trim();
      // Search all users when term provided, otherwise show chat users
      const url = term
        ? `${BASE_URL}/api/v1/user?search=${encodeURIComponent(term)}`
        : `${BASE_URL}/api/v1/user/chats`;
      const token = (() => { try { return localStorage.getItem('auth_token'); } catch { return null; } })();
      if (!token) { navigate('/login'); return; }
      const res = await axios.get(url, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const list = res?.data?.otheruser || [];
      if (term && list.length === 0) {
        toast.error("User not found");
      }
      dispatch(setOtherUsers(list));
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        try { localStorage.removeItem('auth_token'); } catch {}
        navigate('/login');
        return;
      }
      toast.error("Search failed");
    }
  };
  //console.log(<Otherusers />);
  return (
    <div className={`h-full border-r border-slate-700/40 flex flex-col bg-transparent relative overflow-hidden`}>
      <div className="sidebar-galaxy" />
      <div className="panel-soft-shadow" />
      <div className="panel-light-blader" />
      <div className="relative z-10">
      {/* Sticky search/header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-neutral-900/90 via-neutral-900/85 to-neutral-800/90 backdrop-blur-xl border-b border-slate-700/50 shadow-lg px-3 py-3 md:px-4 md:py-4">
        {/* Header with title and logout */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BiMessageSquareDetail className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            <h2 className="text-base md:text-lg font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Messages
            </h2>
          </div>
          <button
            onClick={logoutHandler}
            className="btn btn-xs md:btn-sm gap-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 text-red-400 hover:from-red-500/20 hover:to-orange-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <BiLogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        
        {/* Enhanced search form */}
        <form onSubmit={searchSubmitHandler} className="relative group">
          <div className="relative flex items-center gap-2">
            {/* Search input with icon */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                <ImSearch className="w-4 h-4" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gradient-to-br from-white/95 to-slate-50/95 text-slate-900 placeholder-slate-500 rounded-xl border-2 border-slate-300/50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 font-medium text-sm md:text-base"
                type="text"
                placeholder="Search users..."
              />
            </div>
            
            {/* Search button */}
            <button
              type="submit"
              className="btn btn-square h-[42px] w-[42px] md:h-[48px] md:w-[48px] bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600 hover:from-orange-600 hover:via-pink-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Search"
            >
              <ImSearch className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          
          {/* Search hint */}
          {search.trim() && (
            <div className="absolute -bottom-6 left-0 text-xs text-slate-400 animate-fadeIn">
              Press Enter or click to search
            </div>
          )}
        </form>
      </div>

      {/* Users list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 md:px-3 py-2 space-y-2">
        <Otherusers />
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
