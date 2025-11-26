
import React, {  } from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector } from "react-redux";
//import { setSelectedUser } from '../redux/userSlice';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
   

    const isOnline = onlineUsers?.includes(selectedUser?._id);
    const authOnline = onlineUsers?.includes(authUser?._id);
   
    return (
        <div className='w-full md:min-w-[550px] flex flex-col relative overflow-hidden'>
            <div className="sidebar-galaxy" />
            <div className="panel-soft-shadow" />
            <div className="panel-light-blader" />
            <div className='relative z-10'>
            {
                selectedUser !== null ? (
                    <div className='flex flex-col'>
                        <div className='flex gap-2 items-center bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 text-white px-2 py-2 mb-2 md:px-4 md:py-2 rounded-md'>
                            <div className={`avatar avatar-${isOnline ? 'online' : ''}`}>
                                <div className='relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden'>
                                    <img className='w-full h-full object-cover' src={selectedUser?.profilePhoto} alt="user-profile" />
                                </div>
                            </div>
                            <div className='flex flex-col flex-1'>
                                <div className='flex justify-between items-center gap-2'>
                                    <p className='text-sm md:text-base font-medium'>{selectedUser?.fullname}</p>
                                    <div className='flex items-center gap-2'>
                                        <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full ${isOnline ? 'bg-green-500/20 text-white' : 'bg-black/20 text-white/80'}`}>
                                            {isOnline ? 'Online' : 'Offline'}
                                        </span>
                                        <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full ${authOnline ? 'bg-green-500/20 text-white' : 'bg-black/20 text-white/80'}`}>
                                            You: {authOnline ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Messages />
                        <SendInput />
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='text-4xl text-indigo-600 font-bold'>Hi,{authUser?.fullname} </h1>
                        <h1 className='text-2xl text-indigo-600'>Let's start conversation</h1>

                    </div>
                )
            }
            </div>
        </div>

    )
}

export default MessageContainer