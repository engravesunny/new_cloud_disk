<template>
    <div class="search_box">
        <div class="input_box">
            <el-input ref="input" autofocus type="text" v-model="searchText" placeholder="搜索文件"></el-input>
            <!-- <input autofocus type="text" v-model="searchText" placeholder="搜索文件"> -->
            <div class="close iconfont" @click="closeSearch">&#xe646;</div>
        </div>
        <div v-if="searchText" class="to_search shenglue" @click="startSearch">开始搜索所有"{{ searchText }}"</div>
    </div>
</template>


<script setup>
import PubSub from 'pubsub-js';

let input = ref(null)

let startSearch = () => {
    PubSub.publish('startSearch',searchText.value)
    PubSub.publish('closeSearch')
}

let closeSearch = () => {
    PubSub.publish('closeSearch')
}

let searchText = ref('')

onMounted(()=>{
    let timer = setTimeout(()=>{
        if(input?.value){
            input.value.focus()
        }
    },10)
})

</script>

<style lang="less" scoped>
.search_box{
    position: fixed;
    top: 30%;
    left: 50%;
    display: flex;
    flex-direction: column;
    transform: translate(-50%,-50%);
    width: 600px;
    background-color: #fff;
    border-radius:10px;
    box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    padding: 10px;
    .input_box{
        width: 100%;
        height: 50px;
        // background-color: red;
        line-height: 50px;
        padding-left: 10px;
        .el-input{
            width: 80%;
            height: 100%;
            font-size: 20px;
            border: 0;
            outline: none;
        }
        .close{
            width: 10%;
            text-align: center;
            float: right;
            font-size: 20px;
            cursor: pointer;
        }
    }
    .to_search{
        border-radius: 10px;
        padding-left: 10px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.7);
        cursor: pointer;
    }
    .to_search:hover{
        background-color: #f7f2f2;
    }
}
    
</style>