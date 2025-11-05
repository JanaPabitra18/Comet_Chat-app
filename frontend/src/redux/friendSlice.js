import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../config.js';

export const fetchRelationshipStatus = createAsyncThunk(
  'friends/fetchStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/friends/status`, {
        params: { userId },
        withCredentials: true,
      });
      return { userId, ...res.data };
    } catch (e) {
      return rejectWithValue({ userId });
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friends/sendRequest',
  async (to, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/friends/request`, { to }, { withCredentials: true });
      return { to, request: res.data.request };
    } catch (e) {
      return rejectWithValue({ to });
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friends/accept',
  async (from, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/friends/accept`, { from }, { withCredentials: true });
      return { from, conversationId: res.data.conversationId };
    } catch (e) {
      return rejectWithValue({ from });
    }
  }
);

export const fetchIncomingRequests = createAsyncThunk(
  'friends/incoming',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/friends/requests`, { withCredentials: true });
      return res.data.requests || [];
    } catch (e) {
      return rejectWithValue();
    }
  }
);

const slice = createSlice({
  name: 'friends',
  initialState: {
    statusByUser: {},
    incoming: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelationshipStatus.fulfilled, (state, action) => {
        const { userId, status, direction } = action.payload;
        state.statusByUser[userId] = { status, direction };
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        const { to } = action.payload;
        state.statusByUser[to] = { status: 'pending', direction: 'outgoing' };
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const { from } = action.payload;
        state.statusByUser[from] = { status: 'accepted', direction: null };
        state.incoming = state.incoming.filter((r) => r.from?._id !== from);
      })
      .addCase(fetchIncomingRequests.fulfilled, (state, action) => {
        state.incoming = action.payload;
      });
  },
});

export default slice.reducer;
