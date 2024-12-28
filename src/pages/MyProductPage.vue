<template>
    <div class="my-products-container">
        <!-- 商品管理部分 -->
        <div class="product-list-header">
            <h2>我的商品</h2>

        </div>

        <!-- 商品列表部分 -->
        <div class="product-list">
            <el-row :gutter="10">
                <el-col :span="4" v-for="product in products" :key="product.id">
                    <el-card :body-style="{ padding: '8px' }" shadow="hover">
                        <!-- 这里改成动态获取图片 -->
                        <img :src="`http://localhost:8080/product/image/${product.id}`" class="product-image"
                            alt="Product Image" />

                        <div class="product-info">
                            <h4>{{ product.name }}</h4>
                            <p class="price">价格: ￥{{ product.price }}</p>
                            <div>描述：{{ product.description }}</div>
                        </div>
                        <div class="product-buttons">
                            <el-button type="danger" size="mini" @click="handleDeleteProduct(product)"
                                class="btn">删除</el-button>
                            <el-button type="warning" size="mini" @click="openEditDialog(product)"
                                class="btn">编辑</el-button>
                        </div>

                    </el-card>
                </el-col>
            </el-row>

            <!-- 分页部分 -->
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalProducts"
                layout="prev, pager, next, jumper" @current-change="handlePageChange" @size-change="handleSizeChange" />
        </div>
        <div class="fixed-botton-upload">

        </div>
        <div class="fixed-botton-buttons">
            <el-button type="primary" size="small" @click="openUploadDialog" class="uploadButton">上传商品</el-button>
            <el-button type="success" size="small" @click="goToShoppingdPage" class="button">全部商品</el-button>
            <el-button type="danger" size="small" @click="logout" class="button">退出登录</el-button>
        </div>
        <!-- 上传商品弹窗 -->
        <UploadProduct :DialogVisible="showUploadDialog" @update:DialogVisible="updateDialogVisible" />
        <!-- 更改窗口 -->

        <EditProduct :DialogVisible="showEditDialog" :productData="editProduct"
            @update:DialogVisible="updateEditDialogVisible" @product-updated="fetchs" />


    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import UploadProduct from '@/components/UploadProduct.vue';
import EditProduct from '@/components/EditProduct.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
export default {
    name: 'MyProductsPage',
    components: {
        UploadProduct,
        EditProduct,
    },
    setup() {
        const currentPage = ref(1);
        const pageSize = ref(12);
        const totalProducts = ref(0);
        const products = ref([]);
        const showUploadDialog = ref(false);
        const showEditDialog = ref(false);
        const router = useRouter();
        const userStore = useUserStore();
        const editProduct = ref({
            id: null,
            name: '',
            price: '',
            description: '',
        });
        const openEditDialog = (product) => {
            editProduct.value = { ...product }; // 填充编辑表单
            // console.log('_+_', product, '_+_', editProduct.value);
            

            showEditDialog.value = true;
        };
        // const reloadImage = () => {
        //     const img = document.querySelector('.product-image');
        //     img.src = `http://localhost:8080/product/image/${product.id}t=${Date.now()}`;
        // }

        // 获取商品数据
        const fetchProducts = async () => {
            try {
                const response = await axios.post('http://localhost:8080/product/page/myProduct', {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    searchQuery: "",
                    category: "",
                }, {
                    withCredentials: true,
                });
                // reloadImage();
                products.value = response.data.data.records; // 更新当前页商品列表
                totalProducts.value = response.data.data.total; // 更新商品总数

            } catch (error) {
                console.error('Failed to fetch products:', error);
                console.error('Error details:', error.response?.data || error.message);
            }
        };
        const fetchs = () => {
            fetchProducts();
        }

        const logout = () => {
            userStore.clearUserInfo();
            localStorage.clear();
            router.push('/');
        };
        const goToShoppingdPage = () => {
            router.push('/shopping');
        }
        // 获取产品图片的 URL
        const getProductImageUrl = (productId) => {
            return `http://localhost:8080/product/image/${productId}`;
        };
        const updateDialogVisible = (value) => {
            showUploadDialog.value = value;
            fetchProducts();
        };
        // 监听分页的变化
        const handlePageChange = (page) => {
            currentPage.value = page;
            fetchProducts();
        };
        const updateEditDialogVisible = (value) => {

            showEditDialog.value = value;
            fetchProducts();
            console.log(111111);
        };
        // 监听页面大小变化
        const handleSizeChange = (size) => {
            pageSize.value = size;
            fetchProducts();
        };
        watch(
            () => products.value,
            (newVal) => {
                console.log(newVal);

            }
        );
        // 处理加入购物车操作
        const handleAddToCart = (product) => {
            console.log('添加到购物车:', product);
            // 可以在这里调用父组件或其他逻辑来处理加入购物车的操作
        };

        // 打开上传商品对话框
        const openUploadDialog = () => {
            showUploadDialog.value = true;
            console.log(666);
        };

        // 关闭上传商品对话框
        const closeUploadDialog = () => {
            showUploadDialog.value = false;
            fetchProducts();
        };

        // 删除商品
        const handleDeleteProduct = async (product) => {
            try {
                const response = await axios.delete(`http://localhost:8080/product/delete/${product.id}`);
                if (response.status === 200) {
                    fetchProducts(); // 删除成功后重新获取商品数据
                }
            } catch (error) {
                console.error('删除商品失败:', error);
            }
        };



        // 页面加载时获取商品数据
        onMounted(fetchProducts);

        return {
            currentPage,
            pageSize,
            totalProducts,
            products,
            showUploadDialog,
            editProduct,
            showEditDialog,
            // reloadImage,
            goToShoppingdPage,
            logout,
            fetchs,
            updateEditDialogVisible,
            openEditDialog,
            updateDialogVisible,
            fetchProducts,
            handlePageChange,
            handleSizeChange,
            handleAddToCart,
            openUploadDialog,
            closeUploadDialog,
            handleDeleteProduct,
            // handleEditProduct,
            getProductImageUrl,
        };
    },
};
</script>

<style scoped>
.my-products-container {
    padding: 20px;
}

.product-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.btn {
    font-size: 16px;
    padding: 20px 40px;
}

.product-list {
    padding: 10px;
}

.button {
    font-size: 16px;
    padding: 20px 40px;
}

.uploadButton {
    font-size: 16px;
    padding: 20px 40px;
}

.product-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
}

.product-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
}

.product-buttons {
    display: flex;
    justify-content: space-around;
    /* 使按钮均匀分布 */
    gap: 10px;
    /* 增加按钮之间的间距 */
    margin-top: 10px;
    width: 100%;
}

h4 {
    font-size: 1em;
    margin: 0;
    line-height: 1.2em;
}

.price {
    font-weight: bold;
    color: #333;
    margin: 5px 0;
}

.el-button {
    margin-top: 5px;
    width: 100%;
}


.fixed-botton-buttons {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
}
</style>