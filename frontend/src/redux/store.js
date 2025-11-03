import{} from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
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


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'socket/setSocket'],
        ignoredPaths: ['socket.socket'], // ignore non-serializable socket path if present
      },
    }),
});
export default store;