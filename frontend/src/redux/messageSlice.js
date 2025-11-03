import { createSlice } from "@reduxjs/toolkit";
const messageSlice=createSlice({
    name:"message",
    initialState:{
        messages:null,
        loading:false,
        error:null,
    },
    reducers:{
        setMessages:(state,action)=>{
            state.loading=false;    
            state.messages=action.payload;
            state.error=null;
        },
    } 
        
});
export const {setMessages}=messageSlice.actions;
export default messageSlice.reducer;