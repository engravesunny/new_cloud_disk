<template>
    <div class="homeContainer">
        <div class="banner">
            <div class="logoInfo unselectable">
                <div class="logo"><img src="../../assets/img/clouddisk.png" alt=""></div>
                <div class="title">风萧云盘</div>
            </div>
            <div class="login unselectable iconfont" @click="toLogin">去登录 &#xe617;</div>
            <div class="des">
                <div class="fir">
                    <div style="margin-bottom: 15px;">沉淀心灵，分享世界；</div>
                    <div style="margin-bottom: 15px;">云端存储，尽享无限。</div>
                </div>
                <div class="sec">风萧云盘是一款高效、低干扰、安全可靠、便于共享的云存储服务，您可以在此存储、管理和发现各种内容，轻松打造您的数字世界。</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const router = useRouter()
let toLogin = () => {
    router.push('/login')
}

onMounted(()=>{
    const info = localStorage.getItem('user_info')
    if(info){
        // console.log(info);
        router.push('/doc')
    } else {

    }
})

</script>

<style lang="less" scoped>
    .homeContainer{
        width: 100vw;
        height: 100vh;
        .banner{
            position: relative;
            min-width: 1200px;
            width: 100%;
            height: 100%;
            padding: 0 50px 0 100px;
            background-image: url(../../assets/img/diskbanner.png);
            background-size: cover;
            background-repeat: no-repeat;
            .logoInfo{
                float: left;
                margin-top: 25px;
                display: flex;
                align-items: center;
                max-height: 80px;
                .logo{
                    margin-right: 18px;
                    img{
                        width: 4.706611570247935vw;
                    }
                }
                .title{
                    font-size:30px;
                    font-weight: 700;
                }
            }
            .login{
                float: right;
                padding: 20px;
                margin-top: 15px;
                font-size: 20px;
                color: #6f8eff;
                cursor: pointer;
            }
            .des{
                position: absolute;
                top: 200px;
                left: 100px;
                width: 520px;
                height: 50vh;
                // background-color: #fff;
                // background-color: #fff;
                .fir{
                    width: 100%;
                    font-size: 48px;
                    font-weight: 700;
                }
                .sec{
                    margin-top: 30px;
                    font-size: 18px;
                    color: #9292a6;
                }
            }
        }
    }
</style>