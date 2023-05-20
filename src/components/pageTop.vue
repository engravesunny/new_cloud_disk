<template>
    <div class="page_top">
        <div v-if="isShowSearchBox" @click="showSearchBox" class="marked">
            <searchDoc @click.stop="" v-if="isShowSearchBox"></searchDoc>
        </div>
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
        <div class="search" @click="showSearchBox">
            <div class="icon iconfont">&#xe68c;</div>
        </div>
        <!-- 搜索框 -->
    </div>
</template>

<script setup>
import searchDoc from './searchDoc.vue';
import upload from './upload.vue';
import PubSub from 'pubsub-js';
let isShowSearchBox = ref(false)

let showSearchBox = () => {
    isShowSearchBox.value = !isShowSearchBox.value
    if (isShowSearchBox.value) {
        PubSub.publish('zIndexTo', 0)
    } else {
        PubSub.publish('zIndexTo', 1)
    }
}



onMounted(() => {
    PubSub.subscribe('closeSearch', () => {
        showSearchBox()
    })
    PubSub.subscribe('startSearch', (a, searchText) => {
        startSearch(searchText)
    })

})

let currnetID = ref(0)

const route = useRoute()
const router = useRouter()
let routeList = reactive([
    { name: '文件', id: 0 }
])
if (localStorage.getItem('ROUTE_LIST')) {
    let list = JSON.parse(localStorage.getItem('ROUTE_LIST'))
    list.shift()
    list.map(item => {
        routeList.push(item)
    })
}
localStorage.setItem('ROUTE_LIST', JSON.stringify(routeList))

// 导航
const routeFn = (item) => {
    if (!item?.id && item?.id !== 0) return
    if (item.id === 0) {
        router.push('/doc')
    } else {
        router.push({
            path: '/doc',
            query: {
                id: item.id,
                name: item.name
            }
        })
    }
}

// 监听路由执行函数
const watchRoute = (val) => {

    if (val?.query?.id) {
        routeList = routeList.filter(item => item.id || item.id === 0)
        currnetID.value = val.query.id
        if (routeList.some(item => item.id === val.query.id)) {
            let ind = 0
            routeList.map((item, index) => {
                if (item.id === val.query.id) {
                    ind = index
                }
            })
            routeList.splice(ind + 1, routeList.length)
        } else {
            routeList.push(val.query)
        }
    } else if (val?.query?.searchText) {
        currnetID.value = ''
    } else {
        currnetID.value = 0
        routeList.splice(1, routeList.length)
    }
    localStorage.setItem('ROUTE_LIST', JSON.stringify(routeList))

}

watch(() => route, (val) => {
    watchRoute(val)
}, {
    deep: true
})


// 开始搜索

let startSearch = (searchText) => {
    routeList.splice(1, routeList.length)
    routeList.push({
        name: '"' + searchText + '"' + '搜索结果'
    })
    router.push({
        path: '/home',
        query: {
            searchText
        }
    })
}

</script>

<style lang="less" scoped>
.page_top {
    width: 100%;
    padding: 0 45px;
    line-height: 68px;
    height: 68px;
    z-index: 1;

    .page_title {
        float: left;
        font-size: 18px;
        font-weight: 700;
    }

    .search {
        float: right;
        padding-top: 5px;

        .icon {
            font-size: 25px;
        }
    }

    .marked {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999999999999;
    }

}</style>