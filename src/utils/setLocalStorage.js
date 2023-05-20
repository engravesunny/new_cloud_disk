import { user } from '@/store/user.js'
import { storeToRefs } from 'pinia'

const userStore = user()

const { userInfo } = storeToRefs(userStore)

export const setUserInfo = () => {
    localStorage.setItem('user_info', JSON.stringify(userInfo.value))
}