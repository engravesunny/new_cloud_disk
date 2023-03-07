<template>
    <div class="preview_container">
        <el-card class="preview" body-style="padding:0">
                <div class="top">
                <div class="close iconfont" @click="close">&#xe646;</div>
                <div class="title">{{ filename }}</div>
            </div>
            <div class="main">
                <!-- 图片 -->
                <div v-loading="isLoading" v-if="previewMode === 3" class="img">
                    <img loading="eager" :src="previewUrl" alt="" @load="loadFinish">
                </div>
                <!-- 图片 -->

                <!-- 视频 -->
                <div v-loading="isLoading" v-if="previewMode === 2" class="video">
                    <video controls @loadeddata="loadFinish">
                        <source :src="previewUrl">
                    </video>
                </div>
                <!-- 视频 -->


                <!-- 音乐 -->
                <div v-loading="isLoading" v-if="previewMode === 1" class="audio">
                    <audio controls @loadeddata="loadFinish">
                        <source :src="previewUrl">
                    </audio>
                </div>
                <!-- 音乐 -->


                <!-- 不支持预览 -->
                <div v-if="previewMode === 0" class="unPreview">
                    <div class="text">该文件类型不支持预览</div>
                </div>
                <!-- 不支持预览 -->
            </div>
            <div class="bottom">
                <!-- 操作列表 -->
                <div class="option">
                    <div @click="option(1)" @mouseenter="show(1)" @mouseleave="show(0)" class="download">
                        <div class="icon iconfont" >&#xe600;</div>
                        <div v-if="showTitle === 1" class="title">下载</div>
                    </div>    
                    <div @click="option(2)" @mouseenter="show(2)" @mouseleave="show(0)" class="delete">
                        <div class="icon iconfont" >&#xe61a;</div>
                        <div v-if="showTitle === 2" class="title">删除</div>
                    </div>
                    <div @click="option(3)" @mouseenter="show(3)" @mouseleave="show(0)" class="move">
                        <div class="icon iconfont" >&#xe7d9;</div>
                        <div v-if="showTitle === 3" class="title">移动</div>
                    </div>
                    <div @click="option(4)" @mouseenter="show(4)" @mouseleave="show(0)" class="rename">
                        <div class="icon iconfont" >&#xec17;</div>
                        <div v-if="showTitle === 4" class="title">重命名</div>
                    </div>
                    <div @click="option(5)"  @mouseenter="show(5)" @mouseleave="show(0)" class="like">
                        <div class="icon iconfont" >&#xe761;</div>
                        <div v-if="showTitle === 5" class="title">收藏</div>
                    </div>
                </div>
                <!-- 操作列表 -->
            </div>
        </el-card>
    </div>
</template>

<script setup>
import isToPreview from '@/utils/isToPreview.js'
import PubSub from 'pubsub-js';
const props = defineProps({
    previewFile:{
        type:Object,
        default:{}
    }
})

let showTitle = ref(0)
let show = (type) => {
    showTitle.value = type
}

let isLoading = ref(true)

let close = () => {
    PubSub.publish('preview')
}

// 判断是否加载完成

let loadFinish = () => {
    console.log(12111111);
    isLoading.value = false
}


let previewUrl = ref('')
let previewMode = ref(0)
let filename = ref('')
onMounted(()=>{
    previewMode.value = isToPreview(props.previewFile.filename)
    console.log(previewMode.value);
    if(previewMode.value){
        previewUrl.value = props.previewFile.url
    }
    filename.value = props.previewFile.filename
})

let option = (type) => {
    PubSub.publish('option',[type,props.previewFile])
    PubSub.publish('preview')
}


</script>

<style lang="less" scoped>
    .preview_container{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        .preview{
            width: 70vw;
            display: flex;
            flex-direction: column;
            .top{
                padding: 8px;
                width: 100%;
                height: 40px;
                background-color: #fff8f8;
                display: flex;
                .close{
                    text-align: center;
                    line-height: 24px;
                    width: 24px;
                    height: 24px;
                    font-size: 22px;
                    color: #000;
                    cursor: pointer;
                }
                .title{
                    flex: 1;
                    text-align: center;
                    font-size: 16px;
                }
                .close:hover{
                    background: #f1eded;
                }
            }
            .main{
                flex: 1;
                width: 100%;
                .img{
                    width: 70vw;
                    text-align: center;
                    img{
                        width: 70%;
                    }
                }
                .video{
                    width: 70vw;
                    text-align: center;
                    video{
                        width: 70%;
                    }
                }
                .audio{
                    width: 70vw;
                    text-align: center;
                    audio{
                        width: 70%;
                    }
                }
                .unPreview{
                    width: 70vw;
                    text-align: center;
                    .text{
                        width: 100%;
                        height: 400px;
                        line-height: 400px;
                    }
                }
            }
            .bottom{
                width: 100%;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                .option{
                    display: flex;
                    .delete,.rename,.like,.download{
                        text-align: center;
                        width: 50px;
                        height: 40px;
                        border-radius: 5px;
                        padding: 3px;
                        font-size: 22px;
                        margin: 10px;
                        cursor: pointer;
                        .title{
                            font-size: 12px;
                        }
                    }
                    .move{
                        text-align: center;
                        width: 50px;
                        height: 40px;
                        border-radius:5px;
                        padding: 3px;
                        font-size: 20px;
                        margin: 10px;
                        cursor: pointer;
                        .title{
                            font-size: 12px;
                        }
                    }
                    .delete:hover,.rename:hover,.like:hover,.download:hover,.move:hover{
                        background-color: #f0e9e9;
                    }
                }
            }
        }
    }
</style>