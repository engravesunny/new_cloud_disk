import { defineStore } from 'pinia'

export const user = defineStore('user', {
    state: () => {
        return {
            userInfo: {
                username: '',
                token: localStorage.getItem('token') || '',
                avatar: '',
                id: '',
                email: '',
                used: '',
                capacity: ''
            }
        }
    },
    getters: {},
    actions: {
        clearInfo() {
            this.userInfo.token = ''
            localStorage.removeItem('user_info')
            localStorage.removeItem('token')
        }
    }
})