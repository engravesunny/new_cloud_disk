import axios from 'axios'

import router from '../router'


import { user } from '../store/user'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
const userStore = user()
const { userInfo } = storeToRefs(userStore)

const request = axios.create({
    // baseURL:'/api',   // 跨域
    baseURL: "http://106.15.58.0:8888/api",  // 不跨域
    // baseURL:"http://10.4.24.12:8888/api",  // 不跨域
    // withCredentials: true
})

// 表单请求api列表
const formDataAPI = ['/file/createWithFolders', '/file/upload', '/file/chunk/upload/prepare', '/file/chunk/upload', '/user/avatar']

// 请求拦截
request.interceptors.request.use(config => {
    if (userInfo.value.token) {
        config.headers['Authorization'] = userInfo.value.token
        if (formDataAPI.indexOf(config.url) > -1) {
            config.headers['Content-Type'] = 'multipart/form-data'
        } else if (config.url === '/file/download') {
            config.headers['Content-Type'] = 'application/octet-stream'
            config.responseType = 'arraybuffer'
        }
    }
    return config;
}, error => {
    Promise.reject(error);
})

// 响应拦截
request.interceptors.response.use(response => {

    return response;
}, error => {
    if (error?.response?.status === 401) {
        ElMessage.error('登录已过期')
        userStore.clearInfo()
        router.push('/login')
    }
    return Promise.reject(error);
})

export default request;
