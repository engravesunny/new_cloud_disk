import { defineStore } from 'pinia'
const user_info = JSON.parse(localStorage.getItem('user_info'))
console.log(user_info, 2222);
export const user = defineStore('user', {
    state: () => {
        return {
            userInfo: {
                username: user_info?.username || '',
                token: user_info?.token || '',
                avatar: user_info?.avatar || '',
                id: user_info?.id || '',
                email: user_info?.email || '',
                used: user_info?.used || '',
                capacity: user_info?.capacity || '',
            }
        }
    },
    getters: {},
    actions: {
        clearInfo() {
            this.userInfo.token = ''
            localStorage.removeItem('user_info')
        }
    }
})