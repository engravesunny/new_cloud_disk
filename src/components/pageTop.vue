<template>
    <div class="page_top">
        <!-- 页面标题 -->
        <div class="page_title">
            <span v-for="item in routeList" :key="item.id" @click="routeFn(item)">
                <span v-if="item.id" class="iconfont">&#xe617; </span>{{ item.name + ' ' }}
            </span>
        </div>
        <!-- 页面标题 -->

        <!-- 上传按钮 -->
        <upload :currnetID="currnetID"></upload>
        <!-- 上传按钮 -->

        <!-- 搜索框 -->
        <div class="search">
            <div class="icon iconfont">&#xe68c;</div>
        </div>
        <!-- 搜索框 -->
        
    </div>
</template>

<script setup>

import upload from './upload.vue';

let currnetID = ref(0)

const route = useRoute()
const router = useRouter()
let routeList = reactive([
    {name:'文件',id:0}
])
if(localStorage.getItem('ROUTE_LIST')){
    let list = JSON.parse(localStorage.getItem('ROUTE_LIST'))
    list.shift()
    list.map(item=>{
        routeList.push(item)
    })
}
localStorage.setItem('ROUTE_LIST',JSON.stringify(routeList))

// 导航
const routeFn = (item) => {
    if(item.id === 0){
        router.push('/home')
    } else {
        router.push({
            path:'/home',
            query:{
                id:item.id,
                name:item.name
            }
        })
    }
}


// 监听路由执行函数
const watchRoute = (val) =>{
    currnetID.value = val.query.id || 0
    if(val.query.id){
        if(routeList.some(item=>item.id ===val.query.id)){
            let ind = 0
            routeList.map((item,index)=>{
                if(item.id === val.query.id){
                    ind = index
                }
            })
            routeList.splice(ind+1,routeList.length)
        } else {
            routeList.push(val.query)
        }
    } else {
        routeList.splice(1,routeList.length)
    }
    localStorage.setItem('ROUTE_LIST',JSON.stringify(routeList))
    
}

watch(()=>route,(val)=>{
    watchRoute(val)
},{
    deep:true
})

</script>

<style lang="less" scoped>
    .page_top{
            width: 100%;
            padding: 0 45px;
            line-height: 68px;
            height: 68px;
            z-index: 1;
            .page_title{
                float: left;
                font-size: 18px;
                font-weight: 700;
            }
            .search{
                float: right;
                padding-top: 5px;
                .icon{
                    font-size: 25px;
                }
            }
            
        }
</style>