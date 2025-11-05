import { ImSearch } from "react-icons/im";
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
      const url = term
        ? `${BASE_URL}/api/v1/user?search=${encodeURIComponent(term)}`
        : `${BASE_URL}/api/v1/user/chats`;
      const res = await axios.get(url, { withCredentials: true });
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
      <div className="sticky top-0 z-10 bg-neutral-900/70 backdrop-blur-md border-b border-slate-700/40 px-2 py-2 md:px-3 md:py-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm md:text-base font-semibold text-slate-200">Chats</h2>
          <button
            onClick={logoutHandler}
            className="btn btn-xs md:btn-sm btn-outline border-slate-600 text-slate-300 hover:border-orange-500 hover:text-orange-400"
          >
            Logout
          </button>
        </div>
        <form onSubmit={searchSubmitHandler} className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            type="text"
            placeholder="Search users..."
          />
          <button
            type="submit"
            className="btn btn-square bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0"
            aria-label="Search"
          >
            <ImSearch />
          </button>
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
