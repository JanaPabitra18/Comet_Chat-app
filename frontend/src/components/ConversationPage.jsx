import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import MessageContainer from './MessageContainer';

const ConversationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, otherUsers } = useSelector((s) => s.user);

  // Ensure selectedUser is set when arriving via deep link
  React.useEffect(() => {
    if (!selectedUser && otherUsers && id) {
      const u = otherUsers.find((x) => (x._id || x.id) === id);
      if (u) dispatch(setSelectedUser(u));
    }
  }, [id, otherUsers, selectedUser, dispatch]);

  return (
    <div className="w-full">
      <header className='w-full mb-3 md:mb-4'>
        <div className='max-w-6xl mx-auto px-3 flex items-center gap-3'>
          <button
            type="button"
            className="btn btn-sm bg-neutral-800 border border-slate-700/60 text-slate-200 hover:bg-neutral-700"
            onClick={() => { dispatch(setSelectedUser(null)); navigate('/', { replace: true }); }}
          >
            Back
          </button>
          <h1 className='text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500'>
            Conversation
          </h1>
        </div>
      </header>

      <div className='w-full max-w-6xl mx-auto'>
        <div className='rounded-2xl shadow-xl bg-neutral-900/60 backdrop-blur-md border border-slate-700/60 overflow-hidden relative'>
          <div className="panel-soft-shadow" />
          <div className="panel-light-blader" />
          <div className='relative z-10 p-2 md:p-3'>
            <MessageContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
