import { md5ForChunks } from '@/utils/md5ForChunks.js'
import { createChunks } from '@/utils/createChunks'
import { uploadDoczz,chunkUploadPrepare, chunkUpload, chunkUploadComplete, newDirOrUploadSmall } from '@/api/document.js'
import PubSub from 'pubsub-js';
import { ElMessage } from 'element-plus';

export const uploadDocs = async(file,props) => {
    console.log(file);
    if(!file.type&&!file.size&&!(file.name.indexOf('.')>-1)){
        ElMessage('请上传有效文件')
        return false
    }
    const mb = 1024*1024
    let chunkSize = 0
    // 文件分片
    // 小文件标志
    let flag = false
    if(file.size<=50*mb){
        flag = true
    } else if(file.size>mb*50&&file.size<mb*100){
        chunkSize = (file.size)*0.2
    } else if(file.size>mb*100&&file.size<mb*512){
        chunkSize = (file.size)*0.1
    } else {
        ElMessage('文件过大，不能超过0.5GB')
        PubSub.publish('updatePer',false)
        return false
    }
    PubSub.publish('updatePer',Number(10))
    let hash = ''
    try {
        hash = await md5ForChunks(file)
    } catch (error) {
        ElMessage('请上传有效文件')
        return false
    }
    if(flag){
        // 是小文件
        const smallres = await newDirOrUploadSmall({
            hash:hash,
            file:file,
            name:file.name,
            parent_id:Number(props.currnetID),
            type:2
        })
        PubSub.publish('updatePer',Number(50))
        if(smallres.data.code === 0){
            ElMessage({
                type:'success',
                message:'上传小文件成功'
            })
        } else {
            ElMessage(smallres?.data?.msg||smallres?.data?.message||'上传失败')
        }
        PubSub.publish('updatePer',false)
        PubSub.publish('updateDoc')
        return false
    }
    PubSub.publish('updatePer',Number(20))
    let cur = 20
    let index = 0
    let timer = null
    timer = setInterval(() => {
        PubSub.publish('updatePer',Number(cur))
        index = index + 0.5
        cur = cur+index
        if(cur>=50){
            index = 0
        }
        if(cur>=55){
            index = 0
        }
    }, 3000);

    const res1 = await chunkUploadPrepare({
        file,
        hash,
        name:file.name,
        parent_id:props.currnetID
    }) 
    clearInterval(timer)
    timer = null
    PubSub.publish('updatePer',Number(40))
    if(res1?.data?.msg){
        ElMessage(res1?.data?.msg)
        PubSub.publish('updatePer',false)
        PubSub.publish('updateDoc')
        return false
    }
    // 分片信息
    let part_objects = []

    // 返回信息接收
    let upload_id = ''
    let url_name = ''

    if(!res1.data.data.is_success){
        upload_id = res1.data.data.upload_id  
        url_name = res1.data.data.url_name  
        const chunks = createChunks(file,chunkSize)
        PubSub.publish('updatePer',Number(60))
        let process = 60
        const promises = []
        let doSomething = (item) => {
            return chunkUpload({
                file:item.data,
                upload_id,
                url_name,
                part_num:item.index+1
            }).then(res2=>{
                if(res2.data.code === -1){
                    ElMessage('上传失败，请重试')
                    PubSub.publish('updatePer',false)
                    return  Promise.reject(res2)
                }
                let chunk = {
                    part_number:item.index+1,
                    etag:res2.data.data.etag
                }
                part_objects.push(chunk)
                PubSub.publish('updatePer',process+3)
                process+=3
            })
        }
        await chunks.map(async item=>{
            promises.unshift(doSomething(item))
        })
        await Promise.all(promises)
        PubSub.publish('updatePer',Number(80))
        part_objects.sort((a,b)=>a.part_number-b.part_number)
        const res3 = await chunkUploadComplete({
            url_name,
            upload_id,
            part_objects,
            name:file.name,
            parent_id:Number(props.currnetID),
            hash,
            size:file.size
        })
        PubSub.publish('updatePer',Number(90))
        if(res3.data.code === 0){
            PubSub.publish('updatePer',Number(99))
            PubSub.publish('updatePer',false)
            ElMessage({
                type:'success',
                message:'上传成功'
            })
        PubSub.publish('updateDoc')
        } else {
            PubSub.publish('updatePer',false)
            ElMessage({
                message:res3?.data?.msg||res3.data.message||'上传失败'
            })
            PubSub.publish('updateDoc')
        }
        return false
    } else {
        PubSub.publish('updatePer',Number(50))
        PubSub.publish('updatePer',false)

        ElMessage({
            type:'success',
            message:'上传成功'
        })
        PubSub.publish('updateDoc')
    }
    return false
}