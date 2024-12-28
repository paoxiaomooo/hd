<template>
    <el-dialog title="修改商品" v-model="IsDialogVisible" @close="handleReject">
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
                    :on-success="handleImageSuccess" :before-upload="beforeImageUpload" :show-file-list="false"
                    :on-change="handleChange">
                    <el-button type="primary">选择图片</el-button>
                </el-upload>
                <span v-if="upload.tip">{{ upload.tip }}</span>
                <el-progress v-if="upload.dialogVisible" :percentage="upload.uploadProgress" :text-inside="true" />
            </el-form-item>
        </el-form>

        <template v-slot:footer>
            <el-button type="danger" @click="handleReject">取消</el-button>
            <el-button type="primary" @click="updateProduct">保存修改</el-button>
        </template>
    </el-dialog>
</template>

<script>
import { reactive, ref, watch, defineProps, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
export default {
    name: "EditProduct",
    props: {
        DialogVisible: Boolean,
        productData: Object, // 父组件传递的商品数据
    },
    emits: ["update:DialogVisible", "productUpdated"], // 新增商品更新事件
    setup(props, { emit }) {
        const productForm = reactive({
            id: 0,
            name: "",
            price: 0,
            image_id: 0,
            description: "",
            category: "",
            stock: 0,
        });
        const IsDialogVisible = ref(false);
        const upload = reactive({
            dialogVisible: false,
            uploadProgress: 0,
            uploadMessage: "",
            tip: "",
        });
        const isTemporaryImageUploaded = ref(false); // 标识是否有临时上传的新图片

        const categories = ref([
            "全部",
            "手机",
            "电脑",
            "家电",
            "服饰",
            "食品",
            "日用品",
            "图书",
            "汽车用品",
            "运动健康",
            "玩具",
            "办公用品",
            "化妆品",
            "母婴",
            "数码产品",
            "家居装修",
            "珠宝饰品",
            "宠物用品",
            "艺术品",
            "户外运动",
        ]);
        const deleteImage = async () => {
            if (productForm.image_id === 0) return; // 避免重复删除
            try {
                console.log("正在删除图片，image_id:", productForm.image_id);
                const response = await axios.post(
                    `http://localhost:8080/product/image/delete/${productForm.image_id}`,
                    { withCredentials: true }
                );
                console.log("图片删除成功，image_id:", productForm.image_id);
            } catch (error) {
                console.error("删除图片失败:", error);
                ElMessage.error("删除图片失败");
            }
        };

        // 初始化表单数据
        watch(
            () => props.productData,
            (newData) => {
                if (newData) {
                    Object.assign(productForm, newData);
                }
            },
            { immediate: true }
        );

        watch(
            () => props.DialogVisible,
            (newVal) => {
                IsDialogVisible.value = newVal;
            }
        );

        // 上传图片成功后的回调
        const handleImageSuccess = async (response) => {
            if (productForm.image_id != 0) {
                await deleteImage();
            }
            productForm.image_id = response.data; // 设置新图片的 image_id
            isTemporaryImageUploaded.value = true; // 标记新图片已上传
            upload.uploadProgress = 100;
            upload.dialogVisible = false;
            upload.tip = "图片上传成功";
        };


        // 上传图片前的钩子函数
        const beforeImageUpload = (file) => {
            const isJPG = file.type === "image/jpeg";
            const isPNG = file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                ElMessage.error("图片格式必须为 JPG 或 PNG");
                return false;
            }
            if (!isLt2M) {
                ElMessage.error("图片大小不能超过 2MB");
                return false;
            }
            upload.dialogVisible = true;
            upload.uploadMessage = "正在上传...";
            upload.uploadProgress = 0;
            return true;
        };

        // 提交商品修改
        const updateProduct = async () => {
            const productData = {
                name: productForm.name,
                price: productForm.price,
                description: productForm.description,
                category: productForm.category,
                stock: productForm.stock,
                image_id: productForm.image_id, // 确保上传成功后，带上 image_id

            };

            try {
                const response = await axios.put(
                    `http://localhost:8080/product/update/${productForm.id}`,
                    productData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                ElMessage.success("商品信息修改成功，请刷新");
                isTemporaryImageUploaded.value = false;

                emit("productUpdated", response.data); // 通知父组件商品已更新
                emit("update:DialogVisible", false);

            } catch (error) {
                ElMessage.error("商品修改失败");
            }
        };

        const handleReject = () => {
            console.log(-1);
            if (isTemporaryImageUploaded.value) {
                deleteImage(); // 仅删除临时上传的新图片
                isTemporaryImageUploaded.value = false; // 重置标记
            }
            resetForm();
            emit("update:DialogVisible", false);
        };

        const handleChange = async () => {

        }
        const resetForm = () => {
            Object.assign(productForm, props.productData);
            upload.dialogVisible = false;
            upload.uploadProgress = 0;
            upload.tip = "";
        };

        return {
            productForm,
            upload,
            IsDialogVisible,
            categories,
            isTemporaryImageUploaded,
            handleChange,
            deleteImage,
            handleImageSuccess,
            beforeImageUpload,
            updateProduct,
            handleReject,
            resetForm,
        };
    },
};
</script>