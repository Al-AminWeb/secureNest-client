import React from 'react';
import axios from "axios";


const axiosSecure = axios.create({
    baseURL: `https://secure-nest-server-side.vercel.app`,
    // baseURL: `http://localhost:3000/`,
})

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;
