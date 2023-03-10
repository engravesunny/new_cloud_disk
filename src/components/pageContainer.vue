<template>
    <el-scrollbar>
    <div class="container">
        <div class="top" :style="{zIndex:zIndex}">
            <div class="right">
                <el-select @change="getDoc(currnetID)" v-model="sortType" class="select_box" placeholder="Select" size="small">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
                <el-select @change="getDoc(currnetID)" v-model="sortSc" class="select_box" placeholder="Select" size="small">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </div>
        </div>
        <!-- 页面内容展示 -->
            <div v-loading="!doc_list.length&&!isEmpty" class="container_list">
                <div style="width:100%;height:100%;">
                    <ul>
                        <li
                        :style="{zIndex:zIndex}"
                        :element-loading-text="loadingText" 
                        v-loading="loading ===item.id||deleteList.indexOf(item.id)>-1"
                        v-for="(item,index) in doc_list"
                        :key="index"
                        @click="docFn(item)"
                        @contextmenu.prevent="$event =>showOptions($event,item)"   >
                            <div class="icon iconfont">{{item.type === 1? `&#xe6ea;` :getFileIcon(item.name)}}</div>
                            <div class="name shenglue2">{{item.filename||item.name}}</div>
                            <div class="time">{{ timeToDate(item.updated_at) }}</div>
                        </li> 
                    </ul>
                </div>
            </div>

            <!-- 拖拽上传 -->
            <dragUpload :currnetID="currnetID"></dragUpload>
        <!-- 页面内容展示 -->
        </div>
        <!-- 右键菜单 -->
        <el-card ref="option" v-if="isShowOption" :style="{position:'fixed',top:top+'px',left:left+'px'}" class="option animate" body-style="padding:0;">
            <div class="option_item" v-if="target[0].type===2" @click="download">下载</div>
            <div class="option_item" @click="share">分享</div>
            <div class="option_item" @click="like">收藏</div>
            <div class="option_item" @click="rename">重命名</div>
            <div class="option_item" @click="move">移动</div>
            <div class="option_item" @click="delDoc">删除</div>
        </el-card>
        <!-- 右键菜单 -->

        <!-- 重命名窗口 -->
        <el-card v-if="isShowRenameBox"  class="rename_box animate">
            <div class="title">重命名</div>
            <div class="input">
                <!-- <el-input :placeholder="target[0].filename||target[0].name||''"></el-input> -->
                <el-input v-model="newname" :placeholder="target[0]?.name?.split('.')[0]||target[0].name||''"></el-input><span v-if="target[0].type === 2">{{ '.'+getFileExtension(target[0].name) }}</span>
            </div>
            <div class="btn">
                <el-button @click="renameBtnOk" type="primary">确认</el-button>
                <el-button @click="renameBtnCancel">取消</el-button>
            </div>
        </el-card>
        <!-- 重命名窗口 -->

        <!-- 文件移动窗口 -->
        <el-card v-if="isShowMoveBox" class="move animate">
            <div class="title">移动至(直接确认移动至根目录)</div>
            <el-tree :data="treeDir[0]" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            <div class="btn">
                <el-button type="primary" @click="btnMoveOk">确认</el-button>
                <el-button @click="btnMoveCancel">取消</el-button>
            </div>
        </el-card>
        <!-- 文件移动窗口 -->
        <!-- 预览窗口 -->
        <previewPage v-if="isShowPreview" class="animate2" :previewFile="previewFile[0]"></previewPage>
        <!-- 预览窗口 -->


    </el-scrollbar>
</template>

<script setup>
import {timeToDate} from '../utils/timeToDate.js'
import previewPage from './previewPage.vue'
import dragUpload from './dragUpload.vue'
import 'animate.css'
import PubSub from 'pubsub-js'
import { transform } from '@/utils/transform.js'
import { getFileIcon } from '@/utils/icon.js'
import { delFile,download_doc,renameDoc,fileMove,getFileListPlus,allDir } from '@/api/document.js'
import axios from 'axios'
const router = useRouter()
const route = useRoute()
let doc_list = reactive([])
let isEmpty = ref(false)


// loading状态
let loading = ref(false)
let loadingText = ref('')
let deleteList = reactive([])
let zIndex = ref(1)

// 右键
let target = reactive([])
// 是否显示右键菜单
let isShowOption = ref(false)
let option = ref(null)
// 监听左键点击事件
const handleDocumentClick = (e) => {

    if(isShowOption.value && !option.value.$el.contains(e.target)){
        isShowOption.value = false
        zIndex.value = 1
    }
}
// 右键位置
let top = ref(0)
let left = ref(0)
const showOptions = (e,item) => {
    zIndex.value = 0
    if(target.length){
        target.pop()
    }
    target.push(item)
    isShowOption.value = false
    console.log(e,item);
    top.value = e.pageY
    left.value = e.pageX
    isShowOption.value = true
}



// 右键菜单点击事件

// 下载
const download = async() => {
    zIndex.value = 1
    const data = target[0]
    loading.value = data.id
    loadingText.value = '正在下载'

    ElMessage('正在下载')
    isShowOption.value = false
    try {
        const res = await download_doc({
            file_id:data.id,
            type:2
        })
        console.log(res);
        ElMessage({
                type:'success',
                message:'下载成功'
        })
        loading.value = false
        loadingText.value = '下载成功'
    } catch (error) {
        ElMessage('下载失败')
        loading.value = false
    }
}
// 分享
const share = () => {

}
// 收藏
const like = () => {

}

// 重命名
// 取后缀
function getFileExtension(filename) {
  // 如果传入的不是字符串，返回空字符串
  if (typeof filename !== "string") {
    return "";
  }

  // 获取最后一个点号的位置
  const lastDotIndex = filename.lastIndexOf(".");

  // 如果文件名不包含点号，或者最后一个点号在文件名的开头，返回空字符串
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return "";
  }

  // 获取文件后缀并返回
  return filename.slice(lastDotIndex + 1);
}

// 确认重命名
const renameBtnOk = async() => {
    if(newname.value === ''){
        ElMessage('文件名不能为空')
    }
    let data = target[0]
    loading.value = data.id
    loadingText.value = '重命名中'

    console.log(data);
    try {
        const res = await renameDoc({
            file_id:data.id,
            new_name:data.type===1?newname.value:newname.value+'.'+getFileExtension(data.name),
            type:data.type,
            parent_id:data.parent_id
        })
        if(res.data.code === 0){
            ElMessage({
                type:'success',
                message:'重命名成功'
            })
        } else {
            ElMessage({
                message:res?.data?.msg
            })
        }
    } catch (error) {
        ElMessage('操作失败')
    }
    PubSub.publish('updateDoc')
    loading.value = false
    loadingText.value = ''
    renameBtnCancel()
}

// 取消重命名
const renameBtnCancel = () => {
    PubSub.publish('zIndexTo',0)
    isShowRenameBox.value = false
    newname.value = ''
}

// 是否展示newnamebox
let isShowRenameBox = ref(false)

// 新名字
let newname = ref('')
const rename = () => {
    PubSub.publish('zIndexTo',0)
    isShowOption.value = false 
    isShowRenameBox.value = true
}

// 移动
let currentMoveId = ref(0)
let isShowMoveBox = ref(false)
let dirList = reactive([])
const treeDir = reactive([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
const btnMoveOk = async() => {
    let data = target[0]
    console.log('data',data);
    loading.value = data.id
    loadingText.value = '文件移动中'

    console.log(data);
    try {
        const res = await fileMove({
            file_id:data.id,
            type:data.type,
            to_parent_id:currentMoveId.value,
            name:data.name
        })
        console.log(res);
        if(res.data.code === 0){
            ElMessage({
                type:'success',
                message:'文件移动成功'
            })
            PubSub.publish('updateDoc')
        } else {
            ElMessage(res?.data?.msg)
        }        
        loading.value = false
        loadingText.value = ''
    } catch (error) {
        console.log('操作失败');
        loading.value = false
        loadingText.value = ''
    }
    btnMoveCancel()
}
const btnMoveCancel = () => {
    zIndex.value = 1
    treeDir.pop()
    isShowMoveBox.value = false
}

// 点击某一结点
const handleNodeClick = (node) =>{
    currentMoveId.value = node.id
}
const move = async() => {
    dirList = reactive([])
    isShowOption.value = false
    isShowMoveBox.value = true
    if(treeDir.length){
        treeDir.pop()
    }
    const res = await allDir()
    console.log('所有文件夹',res);
    res.data.data.folders.map(item=>{
        dirList.push(item)
    })
    console.log(dirList);
    const tree = transform(dirList,0)
    console.log(tree);
    treeDir.push(tree)
    console.log(treeDir[0]);
}

// 删除
const delDoc = async() => {
    isShowOption.value = false
    zIndex.value = 1
    let data = target[0]
    let id = target[0].id
    if(deleteList.length){
        ElMessage('上个文件还未删除成功')
        return false
    }
    deleteList.push(target[0].id)
    loadingText.value = '删除中'

    console.log(data);
    try {
        const res = await delFile({
            file_id:data.id
        })
        isShowOption.value = false
        if(res.data.code === 0){
            ElMessage({
                type:'success',
                message:'删除成功'
            })
            PubSub.publish('updateDoc')
            const index = deleteList.indexOf(id)
            deleteList.splice(index, 1)
            loadingText.value = ''
        } else {
            ElMessage({
                message:res.data.msg
            })
            PubSub.publish('updateDoc')
            const index = deleteList.indexOf(id)
            deleteList.splice(index, 1)
            loadingText.value = ''
        }
    } catch (error) {
        ElMessage('操作失败')
        const index = deleteList.indexOf(id)
        deleteList.splice(index, 1)
        loadingText.value = ''
    }
}   

// 是否展示预览
let isShowPreview = ref(false)

// 展示文件
let previewFile = reactive([])
// 文件点击事件
const docFn = (item) => {
    if(item.type === 1){
        // 为文件夹
        router.push({
            path:'home',
            query:{
                id:item.id,
                name:item.name
            }
        })
    } else {
        // 为文件
        isShowPreview.value = true
        previewFile.push(item)
        PubSub.subscribe('preview',()=>{
            isShowPreview.value = false
            previewFile.pop()
        })
    }
}

const id = route.query.id || 0

// 更新文件列表
// 排序类型
let sortType = ref('name')
let sortSc = ref('ASC')
// name
// size
// udpated_at
// created_at

// ASC
// DESC
// 排序类型表格
const options1 = reactive([
  {
    value: 'name',
    label: '按名称排序',
  },
  {
    value: 'size',
    label: '按文件大小排序',
  },
  {
    value: 'updated_at',
    label: '按更新时间排序',
  },
  {
    value: 'created_at',
    label: '按创建时间排序',
  }
])
const options2 = reactive([
    {
        value:'ASC',
        label:'升序'
    },
    {
        value:'DESC',
        label:'降序'
    }
])

const getDoc = async(parant_id=0) => {
    doc_list.splice(0,doc_list.length)
    const {data} =await getFileListPlus({
        parent_id:parant_id,
        order_id:sortType.value,
        order_direction:sortSc.value
    })
    if(!data?.data?.files?.length){
        isEmpty.value = true
    }
    console.log(data);
    data?.data?.files?.map(item=>{
        doc_list.push(item)
    })
}

onMounted(async()=>{
    await getDoc(id)
    PubSub.subscribe('zIndexTo',(a,num)=>{
        zIndex.value = num
    })
    PubSub.subscribe('updateDoc',async()=>{
        await getDoc(route.query.id)
    })
    PubSub.subscribe('option',async(a,item)=>{
        if(target.length){
            target.pop()
        }
        target.push(item[1])
        console.log(target[0]);
        if(item[0] === 1){
            // download
            await download()
            target.pop()
        } else if(item[0] === 2){
            // delete
            await delDoc()
            target.pop()
        } else if(item[0] === 3){
            // move
            await move()
        } else if(item[0] === 4){
            // rename
            await rename()
        } else {
            // like
            return
        }
    })
    document.addEventListener('click',e=>handleDocumentClick(e))
})

let currnetID = ref(0)

watch(()=>route,(val)=>{
    currnetID.value = val.query.id
    getDoc(val.query.id)
},{
    deep:true
})

</script>


<style lang="less" scoped>
.move{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    .title{
        font-size: 16px;
        font-weight: 700;
        margin: 10px 0;
    }
    .btn{
        width: 100%;
        text-align: center;
        .el-button{
            margin: 30px;
        }
    }
}
.animate{
    animation: fadeIn;
    animation-duration: 1s;
}
.animate2{
    animation: fadeIn;
    animation-duration: 0.5s;
}
.rename_box{
    border-radius: 15px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    height: 200px;
    .input{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .el-input{
            width: 200px;
            margin-right: 10px;
        }
    }
    .title{
        font-size: 16px;
        font-weight: 700;
        margin: 10px 0;
    }
    .btn{
        width: 100%;
        text-align: center;
        .el-button{
            margin: 30px;
        }
    }
}
.option{
    width: 150px;
    border-radius: 10px;
    transition: all 0s;
    .option_item{
        border-radius: 10px;
        box-sizing: border-box;
        padding-left: 20px;
        line-height: 40px;
        font-size: 16px;
        width: 90%;
        height: 40px;
        margin: 5px;
    }
    .option_item:hover{
        background-color: #ece4e4;
    }
}
    .container{
            flex: 1;
            display: flex;
            flex-direction: column;
            .top{
                width: 100%;
                height: 30px;
                // background-color: pink;
                line-height: 30px;
                .right{
                    margin-right: 30px;
                    float: right;
                    .select_box{
                        width: 120px;
                    }
                }
            }
            .container_list{
                width: 100%;
                flex: 1;
                padding: 10px;
                ul{
                    width: 100%;
                    display: flex;
                    flex: 1;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-wrap: wrap;
                }
                li{
                    width: 120px;
                    display:flex ;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin: 20px;
                    padding: 5px 10px;
                    border-radius: 10px;
                    .icon{
                        font-size: 80px;
                        color: #567aff;
                    }
                    .name{
                        text-align: center;
                        width: 100%;
                        margin: 5px;
                    }
                    .time{
                        font-weight: 100;
                        color: gray;
                        font-size: 10px;
                    }
                }
                li:hover{
                    background-color: rgb(233, 224, 224);
                }
            }
        }
</style>