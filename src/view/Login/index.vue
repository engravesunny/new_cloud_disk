<template>
    <div class="login_page unselectable" :style="{ backgroundImage: `url(http://kecat.top/img/${indexs[imgIndex]}.webp)` }">
        <div class="login_container">
            <div v-if="showLogin" class="login_box animate">
                <div class="title">欢迎登录</div>
                <input v-model="loginForm.username" type="text" placeholder="用户名" @blur="usernameCheck(loginForm.username)">
                <p class="error">{{ check_error.username_error }}</p>
                <input v-model="loginForm.password" type="password" placeholder="密码"
                    @blur="passwordCheck(loginForm.password)">
                <p class="error">{{ check_error.password_error }}</p>
                <el-button @click="login">登录</el-button>
                <div class="to">没有账号？<span class="ok" @click="toWhere(false)">去注册</span></div>
            </div>
            <div v-else class="sign_box animate">
                <div class="title">欢迎注册</div>

                <input v-model="signForm.username" type="text" placeholder="用户名"
                    @blur="sign_usernameCheck(signForm.username)">

                <p class="error">{{ check_error.sign_username_error }}</p>

                <input v-model="signForm.password" type="password" placeholder="密码"
                    @blur="sign_passwordCheck(signForm.password)">

                <p class="error">{{ check_error.sign_password_error }}</p>

                <input v-model="signForm.password2" type="password" placeholder="重复密码"
                    @blur="password2Check(signForm.password2)">

                <p class="error">{{ check_error.password2_error }}</p>

                <input v-model="signForm.email" type="text" placeholder="邮箱" @blur="emailCheck(signForm.email)">

                <p class="error">{{ check_error.email_error }}</p>

                <div class="code_box">
                    <input v-model="signForm.code" class="code" type="text" placeholder="验证码"
                        @blur="codeCheck(signForm.code)">
                    <el-button class="sendCode" @click="sendCode">发送验证码</el-button>
                    <p class="error_code">{{ check_error.code_error }}</p>
                </div>
                <el-button @click="sign">注册</el-button>
                <div class="to">已有账号？<span class="ok" @click="toWhere(true)">去登录</span></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import 'animate.css';
import { user } from '@/store/user.js'
import { storeToRefs } from 'pinia'
import { toLogin, sendTheCode, signIt } from '@/api/login'
import { getUserInfo } from '@/api/user'

const indexs = ['43', '44', '45', '46']
const imgIndex = Math.floor(Math.random() * 4)
// 用户状态管理
import { setUserInfo } from "@/utils/setLocalStorage"
const userStore = user()
const { userInfo } = storeToRefs(userStore)

const router = useRouter()

let showLogin = ref(true)

let loginForm = reactive({
    username: '',
    password: ''
})

let signForm = reactive({
    username: '',
    password: '',
    password2: '',
    email: '',
    code: ''
})

// 注册用户名校验
const sign_usernameCheck = (item) => {
    if (item === '') {
        check_error.sign_username_error = '用户名不能为空'
        return false
    } else if (item.length > 10) {
        check_error.sign_username_error = '用户名最多10位'
        return false
    } else {
        check_error.sign_username_error = ''
        return true
    }
}
// 注册密码校验
const sign_passwordCheck = (item) => {
    if (item === '') {
        check_error.sign_password_error = '请输入密码'
        return false
    } else if (item.length < 6 || item.length > 20) {
        check_error.sign_password_error = '密码需6-10位'
        return false
    } else {
        check_error.sign_password_error = ''
        return true
    }
}

// 用户名校验
const usernameCheck = (item) => {
    if (item === '') {
        check_error.username_error = '用户名不能为空'
        return false
    } else if (item.length > 10) {
        check_error.username_error = '用户名最多10位'
        return false
    } else {
        check_error.username_error = ''
        return true
    }
}

// 密码校验
const passwordCheck = (item) => {
    if (item === '') {
        check_error.password_error = '请输入密码'
        return false
    } else if (item.length < 6 || item.length > 20) {
        check_error.password_error = '密码需6-10位'
        return false
    } else {
        check_error.password_error = ''
        return true
    }
}

// 重复校验
const password2Check = (item) => {
    if (item === '') {
        check_error.password2_error = '请输入密码'
        return false
    } else if (item.length < 6 || item.length > 20) {
        check_error.password2_error = '密码需6-10位'
        return false
    } else if (item !== signForm.password) {
        check_error.password2_error = '两次输入密码不一致！'
        return false
    } else {
        check_error.password2_error = ''
        return true
    }
}

// 邮箱校验
const emailCheck = (item) => {
    if (item === '') {
        check_error.email_error = '邮箱不能为空'
        return false
    } else {
        check_error.email_error = ''
        return true
    }
}

// 验证码校验
const codeCheck = (item) => {
    if (item === '') {
        check_error.code_error = '验证码不能为空'
        return false
    } else {
        check_error.code_error = ''
        return true
    }
}

// 校验错误显示文字
const check_error = reactive({
    username_error: '',
    sign_username_error: '',
    password_error: '',
    sign_password_error: '',
    password2_error: '',
    email_error: '',
    code_error: ''
})

// 登录 or 注册
const toWhere = (isShowLogin) => {
    showLogin.value = isShowLogin
    check_error.username_error = ''
    check_error.sign_username_error = ''
    check_error.password_error = ''
    check_error.sign_password_error = ''
    check_error.password2_error = ''
    check_error.email_error = ''
    check_error.code_error = ''
    loginForm.username = ''
    loginForm.password = ''
    signForm.username = ''
    signForm.password = ''
    signForm.password2 = ''
    signForm.email = ''
    signForm.code = ''
}


// 登录
const login = async () => {
    if (!usernameCheck(loginForm.username)) return false
    if (!passwordCheck(loginForm.password)) return false
    try {
        const { data } = await toLogin({
            username: loginForm.username,
            password: loginForm.password
        })
        userInfo.value.token = data.data.token
        ElMessage({
            type: 'success',
            message: '登陆成功'
        })
        const res = await getUserInfo()
        userInfo.value.id = res.data.data.token
        userInfo.value.username = res.data.data.username
        userInfo.value.avatar = res.data.data.avatar
        userInfo.value.used = res.data.data.used
        userInfo.value.capacity = res.data.data.capacity
        userInfo.value.email = res.data.data.email
        setUserInfo()
        router.push('/doc')
    } catch (error) {
        ElMessage('登陆失败')
        console.log(error);
    }
}

// 发送验证码
const sendCode = async () => {
    if (!emailCheck(signForm.email)) return false
    try {
        const res = await sendTheCode({
            email: signForm.email
        })
        if (res.data.code === 0) {
            ElMessage({
                type: 'success',
                message: '发送成功'
            })
        } else {
            ElMessage(res?.data?.data?.message || res?.data?.msg)
        }
    } catch (error) {
        console.log(error);
    }
}

// 注册
const sign = async () => {
    if (!sign_usernameCheck(signForm.username)) return false
    if (!sign_passwordCheck(signForm.password)) return false
    if (!password2Check(signForm.password2)) return false
    if (!emailCheck(signForm.email)) return false
    if (!codeCheck(signForm.code)) return false
    try {
        const res = await signIt({
            username: signForm.username,
            password: signForm.password,
            code: signForm.code,
            email: signForm.email
        })
        if (res.data.code === 0) {
            ElMessage({
                type: 'success',
                message: '注册成功'
            })
            toWhere(true)
        } else {
            ElMessage(res?.data?.data?.message || res?.data?.msg)
        }
    } catch (error) {
        console.log(error);
        ElMessage('注册失败')
    }
}

</script>

<style lang="less" scoped>
// 动画
.animate {
    animation: fadeIn;
    animation-duration: 1s;
}

.login_page {
    width: 100vw;
    height: 100vh;
    background-size: cover;

    .login_container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .login_box,
        .sign_box {
            padding-bottom: 100px;
            position: relative;
            width: 500px;
            border-radius: 25px;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;

            .title {
                padding: 50px;
                font-size: 40px;
                font-weight: 700;
                color: #fff;
            }

            input {
                padding: 5px 5px;
                margin: 20px;
                margin-bottom: 10px;
                width: 310px;
                height: 30px;
                background: rgba(0, 0, 0, 0);
                border-bottom: 2px solid #fff;
                color: #fff;
                font-size: 20px;
            }

            .error {
                box-sizing: border-box;
                width: 180px;
                font-size: 16px;
                color: rgb(250, 99, 99);
                margin-right: 120px;
            }

            .code {
                width: 150px;
            }

            .error_code {
                color: rgb(250, 99, 99);
                margin-left: 30px;
            }

            .el-button {
                font-size: 20px;
                font-weight: 700;
                margin-top: 60px;
                width: 250px;
                height: 50px;
                color: #fff;
                background: rgba(255, 255, 255, 0);
            }

            .sendCode {
                margin-top: 0;
                margin-bottom: 10px;
                margin-right: 20px;
                width: 140px;
                height: 40px;
                font-size: 16px;
            }

            .el-button:hover {
                background: rgba(255, 255, 255, 0.5);
            }

            .to {
                position: absolute;
                bottom: 20px;
                left: 40px;
                color: #fff;
                font-size: 18px;

                .ok {
                    cursor: pointer;
                }

                .ok:hover {
                    color: rgba(255, 255, 255, 0.5);
                }
            }
        }
    }
}
</style>