import { md5ForChunks } from '@/utils/md5ForChunks.js'
import { createChunks } from '@/utils/createChunks'
import { uploadDoczz,chunkUploadPrepare, chunkUpload, chunkUploadComplete } from '@/api/document.js'
import PubSub from 'pubsub-js';
import { ElMessage } from 'element-plus';

export const uploadDocs = async(file,props) => {
    if(!file.type){
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
    const hash = await md5ForChunks(file)
    console.log('整个文件的md5',hash);
    if(flag){
        // 是小文件
        const smallres = await uploadDoczz({
            md5:hash,
            file:file,
            directory_id:Number(props.currnetID)
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
    }, 3000);
    // 分片上传准备阶段
    console.log('分片上传准备阶段');

    const res1 = await chunkUploadPrepare({
        file,
        md5:hash,
        name:file.name,
        directory_id:props.currnetID
    }) 
    clearInterval(timer)
    timer = null
    PubSub.publish('updatePer',Number(40))
    console.log('分片准备阶段相应信息',res1);
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
        console.log('未找到md5值');
        upload_id = res1.data.data.upload_id  
        url_name = res1.data.data.url_name  
        const chunks = createChunks(file,chunkSize)
        console.log('分片',chunks);
        PubSub.publish('updatePer',Number(60))
        console.log('准备阶段结束，开始分片上传');
        console.log('存入信息',upload_id,url_name);
        console.log('开始进行分片上传');
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
                console.log('单个分片上传返回',res2);
            })
        }
        await chunks.map(async item=>{
            promises.unshift(doSomething(item))
        })
        await Promise.all(promises)
        PubSub.publish('updatePer',Number(80))
        console.log('分片上传完成');
        console.log('分片结束，开始整合');
        console.log(1);
        part_objects.sort((a,b)=>a.part_number-b.part_number)
        console.log(2);
        console.log(part_objects);
        console.log(3);
        console.log('文件分片整合最终上传');
        const res3 = await chunkUploadComplete({
            url_name,
            upload_id,
            part_objects,
            name:file.name,
            directory_id:Number(props.currnetID),
            md5:hash,
            size:file.size
        })
        PubSub.publish('updatePer',Number(90))
        console.log(res3);
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