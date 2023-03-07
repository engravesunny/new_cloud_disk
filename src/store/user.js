import { defineStore } from 'pinia'

export const user = defineStore('user',{
    state: () => {
        return {
            userInfo:{
                username:'',
                token:'',
                avatar:'',
                id:'',
                email:'',
                used:'',
                capacity:''
            }
        }
    },
    getters:{},
    actions:{}
})