
import React ,{useState}from 'react'
import {  Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
function Login() {
     const [ user,setUser]=useState({
           
            username:"",    
            password:"",
           
    
        })
        const dispatch = useDispatch();
        const navigate=useNavigate();
        const onSubmitHandler= async(e)=>{
            e.preventDefault();
            // console.log(user);
             try{
            const res=await axios.post("http://localhost:8080/api/v1/user/login",user,{
            headers:{
                "Content-Type":"application/json"
            },
            withCredentials:true,

        });
        // Normalize and store auth user in Redux
            const d = res?.data;
            const auth = d?.user ?? d?.data ?? d;
            if (auth) {
              dispatch(setAuthUser(auth));
            }
            navigate("/");
            // console.log(res);
        
    }catch(err){
            console.log(err);
            toast.error(err.response.data.message);
        }
        // Reset form after attempt
            setUser({
                 
                username:"",
                password:"",    
              
            })
        }
  return (
    <div className='w-full'>
      {/* Brand Header */}
      <header className='w-full mb-6'>
        <div className='max-w-6xl mx-auto px-3 flex items-center gap-3'>
          <span className='inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg'>
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
      <div className='min-w-96 max-w-md mx-auto w-full p-6 md:p-7 rounded-2xl shadow-xl bg-neutral-900/70 border border-slate-700'>
       <h2 className='text-2xl font-bold text-center text-slate-100'>Welcome back</h2>
       <p className='text-center text-slate-400 mt-1'>Log in to continue the conversation</p>
         <form  onSubmit={onSubmitHandler} action="" className='mt-6 space-y-4'>
            <div>
              <label className='label p-0 mb-1 text-slate-300'>
                <span className='text-sm'>Username</span>
              </label>
              <input
                value={user.username}
                onChange={(e)=>setUser({...user,username:e.target.value})}
                type="text" placeholder='Enter your username'
                className='input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500'
                required
              />
            </div>
            <div>
              <label className='label p-0 mb-1 text-slate-300'>
                <span className='text-sm'>Password</span>
              </label>
              <input
                value={user.password}
                onChange={(e)=>setUser({...user,password:e.target.value})}
                type="password" placeholder='Enter your password'
                className='input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500'
                required
              />
            </div>
            <div className='pt-2'>
              <button type ="submit" className='w-full rounded-lg px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium hover:opacity-95 active:opacity-90 transition'>
                Login
              </button>
            </div>
            <div className='pt-1'>
              <Link to="/signup">
                <p className='text-sm text-center text-slate-300'>Don't have an account? <span className='text-orange-400 underline'>Signup</span></p>
              </Link>
            </div>
       </form>
      </div>
    </div>
  )
}


export default Login
