import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../config.js';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((s) => s.user.authUser);

    useEffect(() => {
        if (!authUser) return; // not authenticated yet
        const fetchOtherUsers = async () => {
            try {
                const token = (() => { try { return localStorage.getItem('auth_token'); } catch { return null; } })();
                const res = await axios.get(`${BASE_URL}/api/v1/user`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                // store
                console.log("other users -> ",res);
                dispatch(setOtherUsers(res.data.otheruser));
            } catch (error) {
                // Ignore unauthorized during initial load; user may not be logged in yet
                if (error?.response?.status !== 401) {
                  console.log(error);
                }
            }
        }
        fetchOtherUsers();
    }, [dispatch, authUser])

}

export default useGetOtherUsers
