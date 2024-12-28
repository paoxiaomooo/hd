<template>
    <div class="product-list">
        <el-row :gutter="10">
            <el-col :span="4" v-for="product in products" :key="product.id">
                <el-card :body-style="{ padding: '8px' }" shadow="hover">
                    <!-- 这里改成动态获取图片 -->
                    <img :src="getProductImageUrl(product.id)" class="product-image" alt="Product Image" />

                    <div class="product-info">
                        <h4>{{ product.name }}</h4>
                        <p class="price">价格: ￥{{ product.price }}</p>
                        <el-button type="primary" size="mini" @click="handleAddToCart(product)">加入购物车</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalProducts"
            layout="prev, pager, next, jumper" @current-change="handlePageChange" @size-change="handleSizeChange" />
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

export default {
    name: 'ProductList',
    props: {
        searchQuery: String,
        selectedCategory: String,
    },
    emits: ['addToCart'],
    setup(props, { emit }) {
        const currentPage = ref(1);
        const pageSize = ref(12);
        const totalProducts = ref(0);
        const products = ref([]);

        // 获取商品数据
        const fetchProducts = async () => {
            try {
                const response = await axios.post('http://localhost:8080/product/page', {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    searchQuery: props.searchQuery,
                    category: props.selectedCategory === '全部' ? '' : props.selectedCategory,
                }, {
                    withCredentials: true,
                });

                products.value = response.data.data.records; // 更新当前页商品列表
                totalProducts.value = response.data.data.total; // 更新商品总数
            } catch (error) {
                console.error('Failed to fetch products:', error);
                console.error('Error details:', error.response?.data || error.message);
            }
        };

        // 获取产品图片的 URL
        const getProductImageUrl = (productId) => {
            return `http://localhost:8080/product/image/${productId}`;
        };

        // 监听 props 的变化
        watch(
            () => [props.searchQuery, props.selectedCategory],
            () => {
                currentPage.value = 1; // 重置为第一页
                fetchProducts(); // 重新加载数据
            }
        );

        // 切换页码
        const handlePageChange = (page) => {
            currentPage.value = page;
            fetchProducts();
        };

        // 切换页面大小
        const handleSizeChange = (size) => {
            pageSize.value = size;
            fetchProducts();
        };

        const handleAddToCart = (product) => {
            emit('addToCart', product);
        };

        onMounted(fetchProducts);

        return {
            currentPage,
            pageSize,
            totalProducts,
            products,
            handlePageChange,
            handleSizeChange,
            handleAddToCart,
            getProductImageUrl,
        };
    },
};
</script>

<style scoped>
.product-list {
    padding: 10px;
}

.product-image {
    width: 100%;
    /* 图片宽度占满父容器 */
    height: 120px;
    /* 固定高度 */
    object-fit: cover;
    /* 裁剪两边，保持比例 */
    object-position: center;
    /* 居中裁剪 */
    border-radius: 8px;
    /* 可选，圆角设计 */
}

.product-info {
    text-align: center;
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
</style>
