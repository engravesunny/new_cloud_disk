import request from "../utils/request";


export const createFileList = data => request({
    url:'/directory/create',
    method:'post',
    data
})
export const getFileList = params => request({
    url:'/directory/list',
    params
})


// 删除文件夹

export const delDir = data => request({
    url:'/directory/delete',
    method:'post',
    data
})

// 文件夹重命名
export const dirRename = data => request({
    url:'/directory/rename',
    method:'post',
    data
})


// 所有文件夹

export const allDir = () => request({
    url:"/directory/list/all"
})

// 文件夹移动

export const dirMove = data => request({
    url:'/directory/move',
    method:'post',
    data
})
