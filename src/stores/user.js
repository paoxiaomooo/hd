import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: ''
    }),
    actions: {
        loadUserInfo() {
            // 从 localStorage 加载用户名
            const savedUsername = localStorage.getItem('username');
            if (savedUsername) {
                this.username = savedUsername;
            }
        },
        setUserInfo(username) {
            this.username = username;
            localStorage.setItem('username', username); // 仅保存用户名
        },
        clearUserInfo() {
            this.username = '';
            localStorage.removeItem('username'); // 清除用户名
        },
    },
});
