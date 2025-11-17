
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const { authUser, selectedUser } = useSelector(store => store.user);

  if (!authUser) {
    return (
      <div className='w-full'>
        {/* Brand Header */}
        <header className='w-full mb-3 md:mb-4'>
          <div className='max-w-6xl mx-auto px-3 flex items-center gap-3'>
            <span className='inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-600 shadow-2xl'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className='h-5 w-5 md:h-6 md:w-6'>
                <path d="M2 12c4-1 7-3 10-6 0 4 2 7 6 10-3 1-6 2-9 2s-6-1-7-6z"/>
                <circle cx="18" cy="6" r="2" />
              </svg>
            </span>
            <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500'>
              Comet Chat
            </h1>
          </div>
        </header>
        <div className='w-full max-w-4xl mx-auto text-center'>
          <div className='rounded-2xl shadow-xl bg-neutral-900/60 backdrop-blur-md border border-slate-700/60 p-8 md:p-12'>
            <h2 className='text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500'>
              WELCOME TO COMET CHAT
            </h2>
            <div className='flex justify-center gap-4'>
              <Link to="/login" className='inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors'>
                Login
              </Link>
              <Link to="/signup" className='inline-flex items-center justify-center px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-100 font-medium border border-slate-600/60 transition-colors'>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      {/* Brand Header */}
      <header className='w-full mb-3 md:mb-4'>
        <div className='max-w-6xl mx-auto px-3 flex items-center gap-3'>
          <span className='inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-600 shadow-2xl'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className='h-5 w-5 md:h-6 md:w-6'>
              <path d="M2 12c4-1 7-3 10-6 0 4 2 7 6 10-3 1-6 2-9 2s-6-1-7-6z"/>
              <circle cx="18" cy="6" r="2" />
            </svg>
          </span>
          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500'>
            Comet Chat
          </h1>
        </div>
      </header>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='rounded-2xl shadow-xl bg-neutral-900/60 backdrop-blur-md border border-slate-700/60 overflow-hidden relative'>
          <div className="panel-soft-shadow" />
          <div className="panel-light-blader" />
          <div className='relative z-10 flex flex-col md:flex-row h-[calc(100vh-9rem)] md:h-[560px]'>
            <div className='w-full md:w-1/3 md:min-w-[260px] shrink-0 h-1/2 md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-slate-700/40 p-2 md:p-3'>
              <Sidebar />
            </div>
            <div className={`w-full md:w-2/3 h-1/2 md:h-full overflow-y-auto p-2 md:p-3 ${!selectedUser ? 'hidden md:block' : ''}`}>
              <MessageContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

