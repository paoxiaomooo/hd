<template>
    <div class="cart">
        <h3>购物车</h3>
        <el-table :data="cartItems" style="width: 100%; max-height: 300px; overflow-y: auto;">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="price" label="价格" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="danger" @click="emitRemoveFromCart(scope.row.id)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="total">
            <p>总价: ￥{{ totalPrice }}</p>
            <el-button type="primary" class="checkout-button" @click="checkout">结账</el-button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    name: 'Cart',
    props: ['cartItems'],
    emits: ['removeFromCart'],
    setup(props, { emit }) {
        const totalPrice = computed(() => {
            return props.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        });

        const emitRemoveFromCart = (productId) => {
            emit('removeFromCart', productId);
        };

        const checkout = () => {
            // 在这里可以添加结账逻辑
            alert("结账功能暂未实现！");
        };

        return {
            totalPrice,
            emitRemoveFromCart,
            checkout,
        };
    },
};
</script>

<style scoped>
.cart {
    position: fixed;
    top: 120px;
    right: 20px;
    width: 400px;
    padding: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    z-index: 1000;
}

.el-table {
    max-height: 300px;
    overflow-y: auto;
}

.total {
    margin-top: 10px;
    font-weight: bold;
    font-size: 1.2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checkout-button {
    margin-top: 10px;
    width: 100%;
}
</style>
