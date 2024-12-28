<template>
    <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleLogin">登录</el-button>
            <el-button type="text" @click="$emit('switch')">切换到注册</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios'; // 导入 axios
import { useRouter } from 'vue-router'; // 确保引入 useRouter
import { useUserStore } from '@/stores/user';
export default {
    name: 'LoginForm',
    setup() {
        const loginForm = ref({
            username: '',
            password: ''
        });

        const loginRules = {
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        };
        const router = useRouter();
        const user = useUserStore();
        // 登录方法
        function handleLogin() {
            console.log(loginForm.value);

            axios.get('http://localhost:8080/user/login', {
                params: {
                    username: loginForm.value.username,
                    password: loginForm.value.password
                },
                withCredentials: true  // 这行确保发送和接收 cookies
            })
                .then(function (response) {
                    // 处理成功情况
                    console.log(response);
                    if (response.data.msg == "true") {
                        ElMessage.success('登录成功');
                        user.setUserInfo(loginForm.value.username);
                        console.log('User Store after login:', user);
                        // 跳转到首页或其他页面

                        router.push('/shopping').catch(err => {
                            console.error("跳转失败:", err);
                        });

                    } else {
                        ElMessage.success('登录失败，请重试');
                    }

                })
                .catch(function (error) {
                    // 处理错误情况
                    console.log(error);
                })
                .finally(function () {
                    console.log("成功发送请求");
                });
        }


        return {
            loginForm,
            loginRules,
            handleLogin
        };
    }
};
</script>