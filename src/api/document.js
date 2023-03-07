import request from "../utils/request";

export const uploadDoczz = data => request({
    url:"/file/upload",
    method:'post',
    data
})

export const getFile = params => request({
    url:'/file/list',
    params
})

export const downloadFile = params => request({
    url:'/file/download',
    params
})


// 文件分片上传准备
export const chunkUploadPrepare = data => request({
    url:'/file/chunk/upload/prepare',
    method:'post',
    data
})

// 文件分片上传
export const chunkUpload = data => request({
    url:'/file/chunk/upload',
    method:'post',
    data
})

// 文件上传完成
export const chunkUploadComplete = data => request({
    url:'/file/chunk/upload/complete',
    method:'post',
    data
})

// 文件删除
export const delDocument = data => request({
    url:'/file/delete',
    method:'post',
    data
})

// 文件下载

export const download_doc = params => request({
    url:'/file/download',
    params
}) 

// 文件重命名

export const renameDoc = data => request({
    url:'/file/rename',
    method:'post',
    data
})

// 文件移动

export const docMove = data => request({
    url:'/file/move',
    method:'post',
    data
})