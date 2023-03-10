<template>
    <div class="sidebar_container unselectable">
            <!-- logo部分 -->
        <div class="logo">
            <div class="logo_img">
                <img src="../../../../assets/img/clouddisk.png" alt="">
            </div>
            <div class="logo_name">XX云盘</div>
            <div class="type">桌面端</div>
        </div>
        <!-- logo部分 -->
        
        <!-- 功能按钮区域 -->
        <div class="option_btn">
            <ul>
                <li class="active">
                    <div class="icon iconfont">&#xe618;</div>
                    <div class="name">文件</div>
                </li>
                <li>
                    <div class="icon iconfont">&#xe65b;</div>
                    <div class="name">相册</div>
                </li>
                <li>
                    <div class="icon iconfont">&#xe761;</div>
                    <div class="name">收藏夹</div>
                </li>
                <li>
                    <div class="icon iconfont">&#xe6f8;</div>
                    <div class="name">密码箱</div>   
                </li>
                <li>
                    <div class="icon iconfont">&#xe66e;</div>
                    <div class="name">订阅</div>
                </li>
                <li>
                    <div class="icon iconfont">&#xe61a;</div>
                    <div class="name">回收站</div>
                </li>
            </ul>
        </div>
        <!-- 功能按钮区域 -->

        <!-- 用户区域 -->

        <div class="user_info">

            <!-- 用户详情 -->

            <div class="user_detail">
                <div v-if="avatar" class="user_avatar">
                    <el-upload
                        class="elUpload"
                        action="#"
                        :before-upload="uploadAvatar"
                    >
                        <img :src="avatar" alt="" title="更改头像">
                    </el-upload>
                </div>
                <div v-if="username" class="user_name shenglue">
                    {{ username }}
                </div>
                <div class="controles">
                    <div class="iconfont icon">&#xe60c;</div>
                </div>
            </div>

            <!-- 用户详情 -->


        </div>

        <!-- 用户区域 -->
    </div>
</template>

<script setup>
import  { setUserInfo } from "@/utils/setLocalStorage" 
import { updateAvatar,getUserInfo } from '@/api/user'
import { Capacity } from '../../../../utils/computed';
import { user } from '@/store/user'
import { storeToRefs } from 'pinia'
const userStore = user()
let { userInfo } = storeToRefs(userStore)

let username = ref('')
let avatar = ref('')
let percentage = ref(0)

let loadUserInfo = () => {
    if(userInfo.value.token){
        username.value = userInfo.value.username
        avatar.value = userInfo.value.avatar
    } else {
        if(localStorage.getItem('user_info')){
            userInfo.value = JSON.parse(localStorage.getItem('user_info'))
            username.value = userInfo.value.username
            avatar.value = userInfo.value.avatar
        } else {
            router.push('/login')
        }
    }
}

let updateUserInfo = async () => {
    const res = await getUserInfo()
    userInfo.value.id = res.data.data.token
    userInfo.value.username = res.data.data.username
    userInfo.value.avatar = res.data.data.avatar
    userInfo.value.used = res.data.data.used
    userInfo.value.capacity = res.data.data.capacity
    userInfo.value.email = res.data.data.email
    setUserInfo()
}

let uploadAvatar = async(file) => {
    try {
        const {data} = await updateAvatar({
            avatar,file
        })
        if(data.code === 0){
            await updateUserInfo()
            ElMessage({
                type:'success',
                message:'头像更新成功'
            })
        } else {
            ElMessage(data?.data?.msg)
        }
    } catch (error) {
        console.log(error);
    }
    
    return false
}

onMounted(()=>{
    loadUserInfo()
})

</script>

<style lang="less" scoped>

.sidebar_container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f6;
    .logo{
        width: 100%;
        height: 96px;
        padding: 36px 16px 36px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo_img{
            width: 25px;
            height: 25px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .logo_name{
            padding-left: 10px;
            flex: 1;
            font-weight: 700;
            font-size: 18px;
        }
        .type{
            background-color: #e3e3e5;
            padding: 2px 4px;
            border-radius: 5px;
            font-size: 14px;
        }
    }
    .user_info{
        width: 100%;
        height: 100px;
        .rest_capacity{
            box-sizing: border-box;
            width: 100%;
            height: 60px;
            padding-left: 15px;
            .num_display{
                margin-bottom: 10px;
                font-size: 10px;
            }
            .process_display{
                width: 90%;
            }
        }
        .user_detail{
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .user_avatar{
                width: 20%;
                height: 50%;
                text-align: center;
                line-height: 50px;
                .elUpload{
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        border-radius: 50%;
                        width: 35px;
                        height: 35px;
                    }
                }
                
            }
            .user_name{
                box-sizing: border-box;
                flex: 1;
                height: 50%;
                font-size: 14px;
                text-align: start;
                line-height: 50px;
                padding-left: 10px;
            }
            .controles{
                width: 20%;
                height: 50%;                
                text-align: center;
                line-height: 50px;
                .icon{
                    font-size: 23px;
                }
            }
        }
    }
    .option_btn{
        width: 100%;
        flex: 1;
        ul{
            width: 100%;
            li{
                box-sizing: border-box;
                margin: 10px;
                padding: 15px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 90%;
                border-radius: 10px;
                transition: all 0.5s;
                .icon{
                    font-size: 20px;
                    padding-right: 12px;
                }
                .name{
                    font-size: 14px;
                }
            }
            li:hover{
                background-color: #e3e3e5;
            }
            .active{
                background-color: #e3e3e5;
            }
        }
    }
}
    
</style>