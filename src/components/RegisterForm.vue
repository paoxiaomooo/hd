<template>
    <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleRegister">注册</el-button>
            <el-button type="text" @click="$emit('switch')">切换到登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
    name: 'RegisterForm',
    setup() {
        const registerForm = ref({
            username: '',
            password: '',
            email: '',
            phone: ''
        });

        const registerRules = {
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
            ],
            phone: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
            ]
        };

        function handleRegister() {
            console.log(registerForm.value);
            axios.post('http://localhost:8080/user/register',
                {
                    username: registerForm.value.username,
                    password: registerForm.value.password,
                    email: registerForm.value.email,  // 假设UserDto包含email字段
                    phone: registerForm.value.phone
                },
                {
                    withCredentials: true  // 这行确保发送和接收 cookies
                })
                .then(function (response) {
                    // 处理成功情况
                    if(response.data.msg=="true"){
                        ElMessage.success('注册成功，请前去登录');
                    }else{
                        ElMessage.success('注册失败，请重新注册');
                    }
                    console.log(response);
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
            registerForm,
            registerRules,
            handleRegister
        };
    }
};
</script>