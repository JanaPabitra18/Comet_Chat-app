import{} from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setAutoFreeze } from 'immer';
import userReducer from "./userSlice";  
import messageReducer from "./messageSlice";  
import socketReducer from "./socketSlice";
import friendReducer from "./friendSlice";
//import messageModel from "../../../backend/models/messageModel";

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
  import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['socket'], // do not persist socket slice
  }

  const rootReducer = combineReducers({
    user:userReducer,
    message:messageReducer,
    socket:socketReducer,
    friends: friendReducer
 })

const persistedReducer = persistReducer(persistConfig, rootReducer)


// Disable Immer's auto-freeze so we can store live Socket.io instances in state
setAutoFreeze(false);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable dev checks because we intentionally store a live Socket.io instance
      // Consider moving socket out of Redux to re-enable these safely.
      serializableCheck: false,
      immutableCheck: false,
    }),
});
export default store;