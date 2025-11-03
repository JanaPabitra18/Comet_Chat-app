import React ,{useState}from 'react'
import {  Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../main.jsx';
 function Signup() {
    const [ user,setUser]=useState({
        fullname:"",
        username:"",    
        password:"",
        confirmPassword:"",
        gender:""

    });
    const navigate=useNavigate();
     const handleCheckbox=(gender)=>{
        setUser({...user,gender})
     }

    const onSubmitHandler= async (e)=>{
        e.preventDefault();
        // Basic client-side validation
        if (!user.fullname || !user.username || !user.password || !user.confirmPassword || !user.gender) {
          toast.error('Please fill in all required fields.');
          return;
        }
        if (user.password !== user.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        try{
            const res=await axios.post(`${BASE_URL}/api/v1/user/register`,user,{
            headers:{
                "Content-Type":"application/json"
            },
            withCredentials:true,

        });
        // console.log(res);
        if(res.data.success){
            navigate("/login");
            toast.success("Registered Successfully" ,res.data.message);}
    }catch(err){
            console.log(err);
            toast.error(err?.response?.data?.message || 'Registration failed');
        }
        //setUser({...user,[e.target.name]:e.target.value})
        console.log(user);

        setUser({
            fullname:"",    
            username:"",
            password:"",    
            confirmPassword:"",
            gender:""
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
       <h2 className='text-2xl font-bold text-center text-slate-100'>Create account</h2>
       <p className='text-center text-slate-400 mt-1'>Join Comet Chat to start messaging</p>
         <form onSubmit={onSubmitHandler} action="" className='mt-6 space-y-4'>
            <div>
                  <label className='label p-0 mb-1 text-slate-300'>
                      <span className='text-sm'>Full Name</span>
                  </label>
                    <input
                    value={user.fullname}
                    onChange={(e)=>setUser({...user,fullname:e.target.value})}
                     type="text" placeholder='Enter your full name' className='input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
                
            </div>
            <div className='mt-4'>
                  <label className='label p-0 mb-1 text-slate-300'>
                      <span className='text-sm'>Username</span>
                  </label>
                    <input
                    value={user.username}
                    onChange={(e)=>setUser({...user,username:e.target.value})}
                     type="text" placeholder='Choose a unique username' className='input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
             </div>       
                <div className='mt-4'>
                    <label className='label p-0 mb-1 text-slate-300'>

                        <span className='text-sm'>Password</span>
                    </label>
                        <input 
                        value={user.password}
                        onChange={(e)=>setUser({...user,password:e.target.value})}
                        type="password" placeholder='Create a strong password' className='input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
                </div>
                <div>
                    <label className='label p-0 mb-1 text-slate-300'>
                        <span className='text-sm'>Confirm password</span>

                    </label>
                        <input
                        value={user.confirmPassword}
                        onChange={(e)=>setUser({...user,confirmPassword:e.target.value})}
                         type="password" placeholder='Re-enter your password' className='input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
                </div>
                <div className='flex items-center my-4 gap-6'>
                  <div className='flex items-center gap-2'>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={user.gender === 'male'}
                      onChange={()=>handleCheckbox('male')}
                      className='radio radio-warning'
                      required
                    />
                    <label>Male</label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={user.gender === 'female'}
                      onChange={()=>handleCheckbox('female')}
                      className='radio radio-warning'
                    />
                    <label>Female</label>
                  </div>
                </div>
                <div className='pt-2'>
                    <button  type="submit" className='w-full rounded-lg px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium hover:opacity-95 active:opacity-90 transition'>Signup</button>
                    {/* <button className="btn btn-outline btn-success w-full">Success</button> */}
                </div>
                <Link to="/Login">
                    <p className='mt-6 text-sm text-center text-slate-300'>Already have an account? <span className='text-orange-400 underline'>Login</span></p>
                </Link>
        </form>
      </div>
    </div>
  )
}


export default Signup
