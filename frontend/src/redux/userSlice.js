
import { createSlice } from "@reduxjs/toolkit";
const userSlice=createSlice({

    name:"user",
    initialState:{
        authUser:null,
        otherUsers:null,
        loading:false,
        error:null,
        selectedUser:null,
        onlineUsers:null,
    },
    reducers:{
        // //login
        // loginStart:(state)=>{
        //     state.loading=true;
        // },
        setAuthUser:(state,action)=>{
            state.loading=false;
            state.authUser=action.payload;
            state.error=null;
        },
        setOtherUsers:(state,action)=>{
            state.loading=false;
            state.otherUsers = action.payload;
            // state.otherUsers=action.payload;
            state.error=null;
        },
        setSelectedUser:(state,action)=>{
         state.selectedUser=action.payload;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        }   
    }
})
export const {setAuthUser,setOtherUsers,setSelectedUser,setOnlineUsers}=userSlice.actions;
export default userSlice.reducer;
//--- a/file:///c%3A/MERN%20Project/Chat_app/frontend/src/components
