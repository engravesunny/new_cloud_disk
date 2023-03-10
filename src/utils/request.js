import axios from 'axios'

import router from '../router'


import { user } from '@/store/user.js'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
const userStore = user()
const { userInfo } = storeToRefs(userStore)

const request = axios.create({
    baseURL:'/api',   // 跨域
    // baseURL:'http://localhost:3000/',   // 本地api
    // baseURL:'http://47.93.87.206:3000/',    // 服务器api
    withCredentials: true
})

// 表单请求api列表
const formDataAPI = ['/file/createWithFolders','/file/upload','/file/chunk/upload/prepare','/file/chunk/upload','/user/avatar']

// 请求拦截
request.interceptors.request.use(config => {
    if(userInfo.value.token){
        config.headers['Authorization'] = userInfo.value.token
        if(formDataAPI.indexOf(config.url)>-1){
            config.headers['Content-Type'] = 'multipart/form-data'
        } else if(config.url==='/file/download') {
            console.log('下载');
            config.headers['Content-Type'] = 'application/octet-stream'
            config.responseType= 'arraybuffer'
        }
    }
    return config;
}, error => {
    Promise.reject(error);
})

// 响应拦截
request.interceptors.response.use(response=>{
    if(response.headers['content-type'] === 'application/octet-stream'){
        const name = response.headers['content-disposition']
        const arr = name.split('"')
        console.log(arr);
        console.log(name);
        const file_name1 = arr[1]
        const file_name = decodeURIComponent(file_name1);
        console.log('data???',response.data);
        const url = window.URL.createObjectURL(new Blob([response.data],{ type: "application/vnd.ms-excel" }));
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download',file_name)
        document.body.appendChild(link)
        link.click()
    }
    return response;
}, error => {
    if(error?.response?.status === 401){
        ElMessage('登录已过期')
        router.push('/login')
    }
    console.error(error);
    return Promise.reject(error);
})

export default request;
