<template>
    <div class="upload">
        <el-button ref="uploadBtn" style="z-index:2;" class="btn iconfont" @click="showMenu(1)">+</el-button>
        <el-card v-if="isShowMenu" ref="menu" class="upload_menu"
            :style="{ height: `${element_height}px`, top: `${element_top}px`, right: `${element_right}px` }"
            body-style="padding:10px">
            <div @click.stop="">
                <el-upload class="upload_doc iconfont" :limit="1" :before-upload="uploadDoc" :show-file-list="false">
                    &#xe876; 点击上传
                </el-upload>

            </div>
            <div class="new_dir iconfont" @click.stop="ShowNewDirBox">&#xe636; 新建文件夹</div>
        </el-card>
        <!-- 功能弹窗 -->
        <el-card v-if="isShowNewDirBox" class="dialog">
            <div class="title">
                新建文件夹
            </div>
            <div class="name">
                <el-input ref="input" autofocus v-model="dir_name" placeholder="新建文件夹"></el-input>
                <div class="btns">
                    <el-button type="primary" @click="btnOk">确定</el-button>
                    <el-button @click="btnCancel">取消</el-button>
                </div>
            </div>
        </el-card>
        <!-- 功能弹窗 -->

        <!-- 进度弹窗 -->
        <div class="process animate">
            <el-progress v-if="showPer" :text-inside="true" :stroke-width="20" :percentage="percentage" />
        </div>
        <!-- 进度弹窗 -->
    </div>
</template>

<script setup>
import 'animate.css'
import PubSub from 'pubsub-js';
import { uploadDocs } from '@/utils/upload.js'
import { newDirOrUploadSmall } from '@/api/document.js'
const props = defineProps(['currnetID'])

let percentage = ref(0)
let showPer = ref(false)
let isShowNewDirBox = ref(false)
// 新建文件夹名称
let dir_name = ref('')

// 新建窗口
let input = ref(null)

let uploadBtn = ref(null)

const uploadDoc = async (file) => {
    if (showPer.value) {
        ElMessage('只能同时上传一个文件')
        return false
    } else {
        ElMessage({
            type: 'success',
            message: '正在上传'
        })
        isShowMenu.value = false
        showPer.value = true
        PubSub.publish('zIndexTo', 1)
        return uploadDocs(file, props)
    }


}

// 确认新建
const btnOk = async () => {
    const res = await newDirOrUploadSmall({
        parent_id: Number(props.currnetID),
        name: dir_name.value || '新建文件夹',
        type: 1
    })
    if (res.data.code === 0) {
        ElMessage({
            type: 'success',
            message: `成功创建${dir_name.value}`
        })
        PubSub.publish('updateDoc')
    } else {
        ElMessage(res.data.msg)
        PubSub.publish('updateDoc')
    }
    btnCancel()
}
// 取消新建
const btnCancel = () => {
    dir_name.value = ''
    isShowNewDirBox.value = false
    PubSub.publish('zIndexTo', 1)
}

// 打开新建窗口
let ShowNewDirBox = async () => {
    PubSub.publish('zIndexTo', 0)
    isShowNewDirBox.value = true
    isShowMenu.value = false
    let timer = setTimeout(() => {
        if (input?.value) {
            input.value.focus()
        }
    }, 10)
}

let menu = ref(null)

let isShowMenu = ref(0)

let element_height = ref(0)
let element_right = ref(70)
let element_top = ref(50)


const showMenu = (item, top = 50, right = 70) => {
    isShowMenu.value = item
    let timer = setTimeout(() => {
        if (item) {
            element_height.value = 100
        } else {
            element_height.value = 0
        }
        element_right.value = right
        element_top.value = top
        clearTimeout(timer)
        timer = null
    }, 10)
    if (item) {
        PubSub.publish('zIndexTo', 0)
    } else {
        PubSub.publish('zIndexTo', 1)
    }
}


// 右键唤醒
let aliveControls = (e) => {
    element_top.value = e.pageY
    element_right.value = window.innerWidth - e.pageX - 148
    element_height.value = 0
    isShowMenu.value = 0
    showMenu(1, element_top.value, element_right.value)
    PubSub.publish('zIndexTo', 0)
}

// 点击右键box其他区域
const handleDocumentClick = (e) => {
    if (e.target === uploadBtn?.value?.$el || e.target === uploadBtn?.value?.$el?.children[0]) return
    if (isShowMenu.value && !menu.value.$el.contains(e.target)) {
        console.log(menu.value.$el.contains(e.target));
        isShowMenu.value = 0
        PubSub.publish('zIndexTo', 1)
    }
}

onMounted(() => {
    PubSub.subscribe('updatePer', (a, per) => {
        if (per) {
            percentage.value = per
        } else {
            showPer.value = false
        }

    })
    PubSub.subscribe('aliveControls', (a, e) => {
        aliveControls(e)
    })
    PubSub.subscribe('closeMenu', () => {
        showMenu(0)
        PubSub.publish('zIndexTo', 0)
    })
    document.addEventListener('click', e => handleDocumentClick(e))
    document.addEventListener('contextmenu', e => handleDocumentClick(e))
})

</script>

<style lang="less" scoped>
.animate {
    animation: fadeIn;
    /* referring directly to the animation's @keyframe declaration */
    animation-duration: 1s;
    /* don't forget to set a duration! */
}

.upload {
    padding-top: 7px;
    float: right;
    margin-left: 20px;

    .btn {
        width: 35px;
        height: 35px;
        font-size: 25px;
        padding-bottom: 12px;
        color: #fff;
        background-color: #567aff;
        border-radius: 60%;
    }

    .upload_menu {
        position: fixed;
        top: 50px;
        right: 70px;
        width: 150px;
        background-color: #fff;
        z-index: 99999999;
        border-radius: 10px;
        transition: height 0.3s;

        .new_dir,
        .upload_dir {
            width: 90%;
            padding: 20px 0;
            padding-left: 6px;
            height: 30px;
            line-height: 0;
            border-radius: 10px;
            transition: all 0.5s;
            cursor: pointer;
        }

        .upload_doc {
            width: 90%;
            padding: 20px 0;
            padding-left: 6px;
            height: 30px;
            line-height: 0;
            border-radius: 10px;
            transition: all 0.5s;
            cursor: pointer;
            font-size: 16px;
        }

        .new_dir:hover,
        .upload_dir:hover,
        .upload_doc:hover {
            background-color: rgb(233, 219, 221);
        }
    }

    .dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 250px;
        z-index: 999999;
        border-radius: 10px;

        .title {
            font-size: 20px;
            font-weight: 700;
        }

        .btns {
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }

    .process {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%);
        width: 300px;
        height: 30px;
        // background-color: pink;
        z-index: 9999;
    }
}
</style>