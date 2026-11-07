export const BASE_URL = 'http://localhost:3000'

import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

axiosInstance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem("token")

    if(accessToken)
        config.headers.Authorization = `Bearer ${accessToken}`

    return config
}, err => Promise.reject(err))

axiosInstance.interceptors.response.use(res => res, err => {
    if(err.response) {
        if(err.response.status === 401)
            console.log("Your are not authenticated")
        else if(err.response.status === 500) {
            console.error("Server error. Please try again later.")
        }
    }
    else if(err.code === "ECONNABORTED") {
        console.error("Request timeout. Please try again.")
    }

    return Promise.reject(err)
})

export default axiosInstance