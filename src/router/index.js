// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../pages/AuthPage.vue';
import ShoppingPage from '../pages/ShoppingPage.vue';
import { useUserStore } from '@/stores/user'; // 导入用户 Store
import MyProductPage from '../pages/MyProductPage.vue'

const routes = [
    {
        path: '/shopping',
        name: 'Shopping',
        component: ShoppingPage,
        meta: { requiresAuth: true } // 设置需要登录
    },
    {
        path: '/',
        name: 'Auth',
        component: AuthPage
    }, {
        path: '/myproduct',
        name: 'MyProduct',
        component: MyProductPage,
        meta: { requiresAuth: true } // 设置需要登录
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    // 在应用启动时加载用户信息，避免每次路由跳转都加载
    if (!userStore.username) {
        userStore.loadUserInfo();
    }

    // 如果需要登录验证，且未登录，则跳转到登录页面
    if (to.meta.requiresAuth && !userStore.username) {
        next('/'); // 跳转到登录页面
    } else if (to.path === '/' && userStore.username) {
        // 如果已登录，尝试访问登录页面，则跳转到购物页面
        next('/shopping');
    } else {
        next(); // 放行
    }
});

export default router;
