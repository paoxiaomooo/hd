<template>
    <el-dialog title="上传商品" v-model="IsDialogVisible" @close="handleReject">
        <el-form :model="productForm" label-width="100px">
            <el-form-item label="商品名称">
                <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
                <el-input-number v-model="productForm.price" :min="0" placeholder="请输入商品价格"></el-input-number>
            </el-form-item>
            <el-form-item label="商品描述">
                <el-input type="textarea" v-model="productForm.description" placeholder="请输入商品描述"></el-input>
            </el-form-item>
            <!-- <el-form-item label="商品类别">
                <el-input v-model="productForm.category" placeholder="请输入商品类别"></el-input>
            </el-form-item> -->
            <el-form-item label="商品分类">
                <el-select v-model="productForm.category" placeholder="选择商品分类">
                    <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
                </el-select>
            </el-form-item>
            <el-form-item label="商品库存">
                <el-input-number v-model="productForm.stock" :min="0" placeholder="请输入商品库存"></el-input-number>
            </el-form-item>

            <el-form-item label="商品图片">
                <el-upload class="upload-demo" action="http://localhost:8080/product/image/add"
                    :on-success="handleImageSuccess" :before-upload="beforeImageUpload" :show-file-list="false">
                    <el-button type="primary">选择图片</el-button>
                </el-upload>
                <span v-if="upload.tip">{{ upload.tip }}</span>
                <el-progress v-if="upload.dialogVisible" :percentage="upload.uploadProgress" :text-inside="true" />
            </el-form-item>
        </el-form>

        <template v-slot:footer>
            <el-button type="danger" @click="handleReject">取消</el-button>
            <el-button type="primary" @click="submitProduct">上传</el-button>
        </template>
    </el-dialog>
</template>


<script>
import { reactive, ref, watch, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
export default {
    name: 'UploadProduct',
    props: {
        DialogVisible: Boolean
    }, emits: ['update:DialogVisible'], // 确保发出事件更新父组件的状态
    setup(props, { emit }) {
        const productForm = reactive({
            name: '',
            price: 0,
            image_id: 0,
            description: '',
            category: '',
            stock: 0,
        });
        const IsDialogVisible = ref(false);
        const upload = reactive({
            dialogVisible: false,
            uploadProgress: 0,
            uploadMessage: '',
            tip: '',
        });

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
        watch(() => props.DialogVisible, (newValue, oldValue) => {
            console.log(`message changed from ${oldValue} to ${newValue}`);
        });
        const DialogVisible = ref(props.DialogVisible);

        // 监听父组件传递的 value 属性变化，确保弹窗显示状态的同步
        watch(
            () => props.DialogVisible,
            (newVal) => {
                IsDialogVisible.value = newVal;
            }
        );

        // 上传图片成功后的回调
        const handleImageSuccess = (response, file) => {
            if (productForm.image_id != 0) {
                deleteImage();
                console.log(productForm.image_id)
            }
            productForm.image_id = response.data;
            upload.uploadProgress = 100;
            upload.dialogVisible = false;
            upload.tip = "已上传 点击按钮重新上传";
        };

        // 上传图片前的钩子函数
        const beforeImageUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                ElMessage.error('图片格式必须为 JPG 或 PNG');
                return false;
            }
            if (!isLt2M) {
                ElMessage.error('图片大小不能超过 2MB');
                return false;
            }
            upload.dialogVisible = true;
            upload.uploadMessage = '正在上传...';
            upload.uploadProgress = 0;
            return true;
        };
        const userStore = useUserStore();
        // 上传商品
        const submitProduct = async () => {
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('price', productForm.price);
            formData.append('description', productForm.description);
            formData.append('category', productForm.category);
            formData.append('stock', productForm.stock);
            formData.append('image_id', productForm.image_id);
            // userStore.loadUserInfo();
            // formData.append('username', userStore.username);
            try {
                const response = await axios.post('http://localhost:8080/product/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                ElMessage.success("上传成功");
                console.log(-1);
                resetForm();
                emit('update:value', false); // 触发事件，关闭父组件的上传弹窗
            } catch (error) {
                ElMessage.error('上传商品失败');
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
        // 取消操作
        const handleReject = () => {
            deleteImage()
            resetForm();

            emit('update:DialogVisible', false);  // 通过 emit 触发父组件更新弹窗显示状态

        };

        // 重置表单
        const resetForm = () => {
            productForm.name = '';
            productForm.price = 0;
            productForm.image_id = 0;
            productForm.description = '';
            productForm.category = '';
            productForm.stock = 0;

            upload.dialogVisible = false;
            upload.uploadProgress = 0;
            upload.uploadMessage = '';
            upload.tip = '';
        };

        return {
            productForm,
            upload,
            DialogVisible,
            IsDialogVisible,
            categories,
            deleteImage,
            handleImageSuccess,
            beforeImageUpload,
            submitProduct,
            handleReject,
            resetForm,
        };
    },
};
</script>
