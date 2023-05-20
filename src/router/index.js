import { ElMessage } from "element-plus";
import { createRouter, createWebHashHistory } from "vue-router";
import { user } from "../store/user";
import pinia from "../store";
const useStore = user(pinia)

const routes = [
    {
        path: '/drive',
        name: 'layout',
        redirect: '/doc',
        component: () => import('@/view/Layout/index.vue'),
        children: [
            {
                path: "/doc",
                name: "doc",
                component: () => import('@/view/Doc/index.vue')
            }
        ]
    },
    {
        path: "/login",
        name: 'login',
        component: () => import('@/view/Login/index.vue')
    },
    {
        path: "/",
        name: 'home',
        component: () => import('@/view/Home/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/view/NotFound/index.vue')
    },
    {
        path: '/500',
        name: 'NotServer',
        component: () => import('@/view/NotServer/index.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// const routeNeedToken = ["/myLike","/suggestSong","/songList"]

router.beforeEach((to, from, next) => {
    if (to.fullPath !== '/login') {
        // 未登录
        if (to.fullPath === '/') {
            next();
        } else {
            if (!useStore.userInfo.token) {
                ElMessage('请先登录')
                next('/login')
            } else {
                next()
            }
        }

    } else {
        if (useStore.userInfo.token) {
            console.log(useStore.userInfo.token);
            next('/doc')
        } else {

            next()
        }

    }
})


export default router;