<template>
    <div class="main_container">
        <!-- 左侧导航栏区域 -->

        <div class="left_bar">
            <SideBar></SideBar>
        </div>

        <!-- 左侧导航栏区域 -->

        <!-- 右侧内容区域 -->
        <div class="right_bar">
            <router-view></router-view>
        </div>
        <!-- 右侧内容区域 -->
    </div>
</template>

<script setup>
import SideBar from './components/SideBar/index.vue'
import { user } from '../../store/user'
import { storeToRefs } from 'pinia'
const userStore = user()
let { userInfo } = storeToRefs(userStore)

const router = useRouter()

onMounted(() => {
    if (localStorage.getItem('user_info')) {
        userInfo.value = JSON.parse(localStorage.getItem('user_info'))
        console.log(userInfo.value);
    } else {
        router.push('/login')
    }
})

</script>

<style lang="less" scoped>
.main_container {
    width: 100%;
    height: 100vh;
    min-height: 643px;
    display: flex;
    justify-content: space-between;

    .left_bar {
        width: 240px;
        height: 100%;
        background-color: pink;
    }

    .right_bar {
        flex: 1;
        height: 100%;
        // background-color: skyblue;
    }
}
</style>