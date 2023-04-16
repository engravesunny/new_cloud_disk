import { ElMessage } from "element-plus";
import { createRouter, createWebHashHistory } from "vue-router";


const routes = [
    {
        path: '/drive',
        name: 'layout',
        redirect: '/doc',
        component: ()=>import('@/view/Layout/index.vue'),
        children:[
            {
                path:"/doc",
                name:"doc",
                component:()=>import('@/view/Doc/index.vue')
            }
        ]
    },
    {
        path:"/login",
        name:'login',
        component:()=>import('@/view/Login/index.vue')
    },
    {
        path:"/",
        name:'home',
        component:()=>import('@/view/Home/index.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// const routeNeedToken = ["/myLike","/suggestSong","/songList"]

router.beforeEach((to,from,next)=>{
    if(to.fullPath !== '/login'){
        // 未登录
        if(to.fullPath === '/'){
            next();
        } else {
            if(!localStorage.getItem('user_info')){
                ElMessage('请先登录')
                next('/login')
            } else {
                next()
            }
        }
        
    }else {
        next()
    }
})


export default router;