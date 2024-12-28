<template>
    <div class="auth-container">
        <el-card class="auth-card" shadow="hover">
            <h2 class="title">{{ isLogin ? '用户登录' : '用户注册' }}</h2>
            <component :is="currentComponent" @switch="toggleAuth"></component>
        </el-card>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import LoginForm from '@/components/LoginForm.vue';  // 使用正斜杠，并确保路径正确
import RegisterForm from '@/components/RegisterForm.vue';  // 使用正斜杠，并确保路径正确


export default {
    name: 'AuthPage',
    components: {
        LoginForm,
        RegisterForm
    },
    setup() {
        const isLogin = ref(true);

        const currentComponent = computed(() => (isLogin.value ? 'LoginForm' : 'RegisterForm'));

        const toggleAuth = () => {
            isLogin.value = !isLogin.value;
        };

        return {
            isLogin,
            currentComponent,
            toggleAuth
        };
    }
};
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.auth-card {
    width: 400px;
    padding: 20px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
    color: #409eff;
}
</style>