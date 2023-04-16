<template>
    <div ref="dragBox" :class="{drag_upload_container:true,is_dragging:isShowDragTip}" draggable @dragleave="leave" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop">
        <div v-if="isShowDragTip" class="iconfont drag_tip">
            &#xe876;
        </div>
    </div>
  </template>
  
  <script setup>
  import {uploadDocs} from '@/utils/upload.js'
  import { ref } from 'vue'
  
  const props = defineProps(['currnetID'])

  let isShowDragTip = ref(false)

  let dragBox = ref(null)
  
  let debounce = (fn, delay) => {
    let timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, arguments);
          timer = null;
        }, delay);
      }
    }
  }

  let leave = (e) => {
    e.preventDefault();
    let timer2 = null
    timer2 = setTimeout(()=>{
        isShowDragTip.value = false
        timer2 = null
    },300)
  }

  let handleDragOver = debounce((e) => {
    isShowDragTip.value = true
    e.preventDefault();
  }, 200)
  
  let handleDrop = (e) => {
    let timer2 = null
    timer2 = setTimeout(()=>{
        isShowDragTip.value = false
        timer2 = null
    },300)
    e.preventDefault();
    const files = e.dataTransfer.files;
    uploadDocs(files[0],props)
    // do something with the files, such as uploading to a server
  }
  
  
  
  </script>
  
  <style lang="less" scoped>
    .is_dragging{
        z-index: 99999;
        background: rgba(255, 255, 255, 0.8);
    }
  .drag_upload_container {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    .drag_tip{
        width: 100px;
        height: 100px;
        text-align:center;
        line-height: 100px;
        color: #fff;
        font-size: 50px;
        border-radius: 50%;
        position: absolute;
        bottom:10%;
        left: 40%;
        transform: translate(-50%,-50%);
        background-color: rgb(127, 127, 245);
    }
  }
  </style>
  