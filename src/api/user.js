import request from "../utils/request";

export const getUserInfo = () => request({
    url:'/user/info'
})

export const updateAvatar = data => request({
    url:"/user/avatar",
    method:'post',
    data
})