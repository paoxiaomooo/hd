<template>
    <div class="app-container">
        <el-container>
            <el-header>
                <div class="header-content">
                    <h2>并夕夕购物平台</h2>
                    <div class="user-actions">
                        <span>欢迎, {{ username }}</span>
                    </div>
                </div>
                <div class="filter-bar">
                    <el-input v-model="tempSearchQuery" placeholder="搜索商品" style="width: 300px; margin-right: 20px;" />
                    <el-button type="primary" @click="applySearch" style="margin-right: 20px;">搜索</el-button>
                    <el-select v-model="selectedCategory" placeholder="选择分类" style="width: 150px;">
                        <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
                    </el-select>
                </div>
            </el-header>
            <el-main style="margin-top: 100px;">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <ProductList :searchQuery="searchQuery" :selectedCategory="selectedCategory"
                            @addToCart="addToCart" ref="ProductList" />
                    </el-col>
                    <el-col :span="8">
                        <Cart :cartItems="cartItems" @removeFromCart="removeFromCart" />
                    </el-col>
                </el-row>
            </el-main>
        </el-container>

        <!-- 固定按钮 -->
        <div class="fixed-bottom-buttons">
            <!-- <el-button type="primary" size="small" @click="openUploadDialog" class="button">上传商品</el-button> -->
            <el-button type="success" size="small" @click="goToUploadPage" class="button">我的商品</el-button>
            <el-button type="danger" size="small" @click="logout" class="button">退出登录</el-button>
        </div>

        <!-- 上传商品的弹窗 -->
        <el-dialog title="上传商品" v-model="DialogVisible" width="50%" @close="resetForm">
            <el-form :model="productForm" label-width="120px">
                <!-- 商品名称 -->
                <el-form-item label="商品名称">
                    <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>

                <!-- 商品价格 -->
                <el-form-item label="商品价格">
                    <el-input-number v-model="productForm.price" :min="0" label="价格"
                        placeholder="请输入商品价格"></el-input-number>
                </el-form-item>

                <!-- 商品描述 -->
                <el-form-item label="商品描述">
                    <el-input type="textarea" v-model="productForm.description" placeholder="请输入商品描述"></el-input>
                </el-form-item>

                <!-- 商品分类 -->
                <el-form-item label="商品分类">
                    <el-select v-model="productForm.category" placeholder="选择商品分类">
                        <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
                    </el-select>
                </el-form-item>

                <!-- 库存数量 -->
                <el-form-item label="库存数量">
                    <el-input-number v-model="productForm.stock" :min="0" label="库存"
                        placeholder="请输入库存数量"></el-input-number>
                </el-form-item>

                <!-- 商品图片上传 -->
                <el-form-item label="商品图片" :label-width="'120px'">
                    <el-upload class="upload-demo" action="http://localhost:8080/product/image/add"
                        :on-success="handleImageSuccess" :before-upload="beforeImageUpload" :show-file-list="false"
                        :on-change="handleChange">
                        <el-button type="primary">选择图片</el-button>
                    </el-upload>

                    <el-dialog v-model="upload.dialogVisible" title="上传进度">
                        <el-progress :percentage="upload.uploadProgress" />
                        <p v-if="uploadMessage">{{ upload.uploadMessage }}</p>
                    </el-dialog>
                    <div>
                        <div class="el-upload__tip" style="margin-left: 15px;">
                            {{ upload.tip }}
                        </div>
                    </div>


                </el-form-item>





            </el-form>

            <template v-slot:footer>
                <el-button type="danger" @click="handleReject">取消</el-button>
                <el-button type="primary" @click="submitProduct">上传</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import ProductList from '@/components/ProductList.vue';
import Cart from '@/components/Cart.vue';
// import { uploadProps } from 'element-plus/lib/components/index.js';
// 修改为这样
import { ElButton, ElMessage } from 'element-plus';
import axios from 'axios';
export default {
    name: 'ShoppingPage',
    components: {
        ProductList,
        Cart,
    },
    setup() {
        const cartItems = ref([]);
        const tempSearchQuery = ref('');
        const searchQuery = ref('');
        const selectedCategory = ref('');
        const categories = ref([
            '全部',
            '手机',
            '电脑',
            '家电',
            '服饰',
            '食品',
            '日用品',
            '图书',
            '汽车用品',
            '运动健康',
            '玩具',
            '办公用品',
            '化妆品',
            '母婴',
            '数码产品',
            '家居装修',
            '珠宝饰品',
            '宠物用品',
            '艺术品',
            '户外运动',
        ]);

        const productForm = reactive({
            name: '',
            price: 0,
            image_id: 0,
            description: '',
            category: '',
            stock: 0,
        });
        const upload = reactive({
            dialogVisible: false,
            uploadProgress: 0,
            uploadMessage: '',
            tip: ''
        });



        const DialogVisible = ref(false);
        const userStore = useUserStore();
        const router = useRouter();
        const username = ref('');

        onMounted(() => {
            userStore.loadUserInfo();
            username.value = userStore.username;
        });

        const addToCart = (product) => {
            const item = cartItems.value.find((item) => item.id === product.id);
            if (item) {
                item.quantity += 1;
            } else {
                cartItems.value.push({ ...product, quantity: 1 });
            }
        };
        const deleteImage = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/product/image/delete/${productForm.image_id}`,
                    { withCredentials: true }  // 确保跨域请求中发送 cookies 和认证信息
                );



            } catch (error) {
                console.error('Error delete product:', error);
                ElMessage.error('删除商品失败');
            }

        }
        const handleReject = () => {

            deleteImage();
            resetForm();
            DialogVisible.value = false;
        }

        const removeFromCart = (productId) => {
            const item = cartItems.value.find((item) => item.id === productId);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cartItems.value = cartItems.value.filter((item) => item.id !== productId);
                }
            }
        };
        const handleChange = (file, fileList) => {
            // 文件上传的状态变化
            if (file.status === 'uploading') {
                upload.uploadMessage = '正在上传...';
            } else if (file.status === 'success') {
                upload.uploadMessage = '上传成功！';
                upload.uploadProgress = 100; // 完成上传
            } else if (file.status === 'error') {
                upload.uploadMessage = '上传失败，请重试！';
            }
        };
        const applySearch = () => {
            searchQuery.value = tempSearchQuery.value;
        };

        const goToUploadPage = () => {
            router.push('/myproduct');
        };

        const logout = () => {
            userStore.clearUserInfo();
            localStorage.clear();
            router.push('/');
        };

        // 打开上传商品的弹窗
        const openUploadDialog = () => {
            console.log('111');
            upload.tip = "未上传图片 请上传"

            DialogVisible.value = true;
        };

        // 重置表单
        const resetForm = () => {
            // 清空 productForm 对象的属性
            productForm.name = '';
            productForm.price = 0;
            productForm.image_id = 0;
            productForm.description = '';
            productForm.category = '';
            productForm.stock = 0;

            // 清空 upload 对象的属性
            upload.dialogVisible = false;
            upload.uploadProgress = 0;
            upload.uploadMessage = '';
            upload.tip = '';
        };


        // 上传图片成功后的回调
        const handleImageSuccess = (response, file) => {
            // 假设后端返回的响应包含图片的 URL
            console.log(response.data);
            productForm.image_id = response.data;
            upload.uploadProgress = 100;
            upload.dialogVisible = false;
            upload.tip = "已上传 点击按钮重新上传"
        };

        // 限制上传文件类型（例如：仅允许图片上传）
        const beforeImageUpload = (file) => {

            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                +
                    ElMessage.error('图片格式必须为 JPG 或 PNG');
                return false;
            }
            if (!isLt2M) {
                ElMessage.error('图片大小不能超过 2MB');
                return false;
            }
            upload.dialogVisible = true;  // 显示上传提示框
            upload.uploadMessage = '正在上传...';
            upload.uploadProgress = 0;    // 重置进度条
            return (isJPG || isPNG) && isLt2M;
        };


        const submitProduct = async () => {
            // 创建 FormData 对象，收集表单数据
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('price', productForm.price);
            formData.append('description', productForm.description);
            formData.append('category', productForm.category);
            formData.append('stock', productForm.stock);
            formData.append('username', username.value);
            // 添加图片文件
            formData.append('image_id', productForm.image_id);
            console.log(formData);
            // 使用 axios 发送 POST 请求，将数据发送到后端
            try {
                const response = await axios.post('http://localhost:8080/product/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true  // 确保跨域请求中发送 cookies 和认证信息
                });


                // 请求成功后进行的操作
                console.log('Product uploaded successfully:', response.data);
                ElMessage.success("上传成功，请手动刷新");
                // 清空表单并关闭弹窗
                resetForm();
                DialogVisible.value = false;
            } catch (error) {
                console.error('Error uploading product:', error);
                ElMessage.error('上传商品失败');
            }

        };


        return {
            username,
            cartItems,
            tempSearchQuery,
            searchQuery,
            selectedCategory,
            categories,
            productForm,
            DialogVisible,
            upload,
            deleteImage,
            handleChange,
            addToCart,
            removeFromCart,
            applySearch,
            goToUploadPage,
            logout,
            handleReject,
            openUploadDialog,
            resetForm,
            submitProduct,
            handleImageSuccess,
            beforeImageUpload,
        };
    },
};
</script>

<style scoped>
.app-container {
    padding: 10px;
    position: relative;
    min-height: 100vh;
}

.button {
    font-size: 16px;
    padding: 20px 40px;
}

.fixed-bottom-buttons {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filter-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
</style>
