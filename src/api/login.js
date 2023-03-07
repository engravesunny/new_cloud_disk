import request from "../utils/request";


// 登录
export const toLogin = data => request({
    url:'/user/login',
    method:'post',
    data
})

// 发送验证码
export const sendTheCode = data => request({
    url:'/user/code',
    method:'post',
    data
})


// 注册

export const signIt = data => request({
    url:'/user/register',
    method:'post',
    data
})