import { ElMessage } from "element-plus";
import { createRouter, createWebHistory } from "vue-router";


const routes = [
    {
        path: '/',
        name: 'layout',
        redirect: '/home',
        component: ()=>import('@/view/Layout/index.vue'),
        children:[
            {
                path:"/home",
                name:'home',
                component:()=>import('@/view/Home/index.vue')
            }
        ]
    },
    {
        path:"/login",
        name:'login',
        component:()=>import('@/view/Login/index.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// const routeNeedToken = ["/myLike","/suggestSong","/songList"]

router.beforeEach((to,from,next)=>{
    if(to.fullPath !== '/login'){
        // 未登录
        if(!localStorage.getItem('user_info')){
            ElMessage('请先登录')
            next('/login')
        } else {
            next()
        }
    }else {
        next()
    }
})


export default router;