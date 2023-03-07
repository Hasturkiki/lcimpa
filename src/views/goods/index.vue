<script lang="ts">
export default {
  name: 'goods'
};
</script>

<script setup lang="ts">
//  Api引入
import userApi from '@/api/user'
import goodsApi from '@/api/goods'

import {
  reactive,
  ref,
  onMounted,
  toRefs
} from 'vue';
import {
  ElForm,
  ElMessageBox,
  ElMessage
} from 'element-plus';
import type {UploadProps, UploadUserFile} from 'element-plus'
import {
  Search,
  Plus,
  Refresh,
  Delete
} from '@element-plus/icons-vue';
import {
  GoodsForm,
  GoodsQuery,
  GoodsType
} from '@/api/goods/types';

const queryFormRef = ref(ElForm) //  查询表单
const dataFormRef = ref(ElForm)  // 货品表单
const pictureBaseURL = import.meta.env.VITE_APP_BASE_API  //  图片路径

const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [] as number[],
  // 总条数
  total: 0,
  goodsList: [] as GoodsType[],
  dialog: {
    visible: false
  } as DialogType,
  companyOptions: [] as OptionType[],
  formData: {} as GoodsForm,
  mainImages: [] as UploadUserFile[],
  detailImages: [] as UploadUserFile[],
  deleteMainImageIds: [] as number[],
  deleteDetailImageIds: [] as number[],
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as GoodsQuery,
  rules: {
    goodsName: [{required: true, message: '货品名称不能为空', trigger: 'blur'}],
    description: [{required: true, message: '货品简介不能为空', trigger: 'blur'}],
    ownerId: [{required: true, message: '货品所属企业不能为空', trigger: 'blur'}],
    brokerage: [
      {
        required: true,
        message: '佣金格式错误或超过限制',
        pattern: /^\d{1,8}(\.\d{1,4})?$/,
        trigger: 'blur'
      }
    ]
  }
});

const {
  loading,
  ids,
  total,
  goodsList,
  dialog,
  companyOptions,
  formData,
  mainImages,
  detailImages,
  deleteMainImageIds,
  deleteDetailImageIds,
  queryParams,
  rules
} = toRefs(state);

const ImageDialogImageUrl = ref('')
const ImageDialogVisible = ref(false)
const ImageDialogTitle = ref('')

const beforeRemove: UploadProps['beforeRemove'] = (file) => {
  return ElMessageBox.confirm(
    `确定删除 ${file.name} ?`
  ).then(
    () => true,
    () => false
  )
}
const handleRemoveM: UploadProps['onRemove'] = (file) => {
  if (!file.raw)
    deleteMainImageIds.value.push(file.uid)
}
const handleRemoveD: UploadProps['onRemove'] = (file) => {
  if (!file.raw)
    deleteDetailImageIds.value.push(file.uid)
}
const handlePreview: UploadProps['onPreview'] = (file) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ImageDialogImageUrl.value = file.url!
  ImageDialogTitle.value = file.name
  ImageDialogVisible.value = true
}
const handleExceed: UploadProps['onExceed'] = (files, fileList) => {
  ElMessage.warning(
    `最多选择 4 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  )
}
const handleChange: UploadProps['onChange'] = (file: any) => {
  let flag = file.size > 1024 * 1024 * 4
  if (flag) {
    ElMessage.warning('文件大小请勿超过4MB！')
  }
}

//  查询
function handleQuery() {
  state.loading = true
  goodsApi.listGoodsPages(state.queryParams).then(({data}) => {
      state.goodsList = data.list
      state.total = data.total
      state.loading = false
    }
  );
}

//  重置
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

//  行选中
function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.id);
}

//  添加货品
async function handleAdd() {
  state.dialog = {
    title: '添加货品',
    visible: true
  }
}

//  修改货品
async function handleUpdate(row: { [key: string]: any }) {
  dialog.value = {
    title: '修改货品',
    visible: true
  };

  const goodsId = row.id || state.ids;
  goodsApi.getGoodsForm(goodsId).then(({data}) => {
    formData.value = data
    let mainImagePositions = []
    for (const mainImageP of data.mainImagePositions) {
      mainImagePositions.push(mainImageP)
    }
    let mainImageOriginNames = []
    for (const mainImageN of data.mainImageOriginalNames) {
      mainImageOriginNames.push(mainImageN)
    }
    let mainImageIDs = [] as number[]
    for (const mainImageID of data.mainImageIDs) {
      mainImageIDs.push(mainImageID)
    }
    for (let i = 0; i < mainImagePositions.length; i++) {
      mainImages.value.push({
        uid: mainImageIDs[i],
        name: mainImageOriginNames[i],
        url: pictureBaseURL + mainImagePositions[i]
      })
    }
    let detailImagePositions = []
    for (const detailImageP of data.detailImagePositions) {
      detailImagePositions.push(detailImageP)
    }
    let detailImageOriginNames = []
    for (const detailImageN of data.detailImageOriginalNames) {
      detailImageOriginNames.push(detailImageN)
    }
    let detailImageIDs = [] as number[]
    for (const detailImageID of data.detailImageIDs) {
      detailImageIDs.push(detailImageID)
    }
    for (let i = 0; i < detailImagePositions.length; i++) {
      detailImages.value.push({
        uid: detailImageIDs[i],
        name: detailImageOriginNames[i],
        url: pictureBaseURL + detailImagePositions[i]
      })
    }
  });
}

//  表单提交
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (state.mainImages.length === 0 || state.detailImages.length === 0) {
      ElMessage.info('图片不能为空')
      return
    }
    if (valid) {
      const goodsId = state.formData.id;
      const goodsVo = new FormData()
      goodsVo.append('goods', new Blob([JSON.stringify(state.formData)], {type: 'application/json'}))
      if (goodsId) {
        for (const mainImage of state.mainImages)
          if (mainImage.raw)
            goodsVo.append('mainImages', mainImage.raw)
        for (const detailImage of state.detailImages)
          if (detailImage.raw)
            goodsVo.append('detailImages', detailImage.raw)
        goodsVo.append('deleteMainImageIds', new Blob([JSON.stringify(state.deleteMainImageIds)], {type: 'application/json'}))
        goodsVo.append('deleteDetailImageIds', new Blob([JSON.stringify(state.deleteDetailImageIds)], {type: 'application/json'}))
        goodsApi.updateGoods(goodsVo).then(() => {
          ElMessage.success('修改货品成功');
          closeDialog();
          handleQuery();
        });
      } else {
        for (const mainImage of state.mainImages)
          if (mainImage.raw)
            goodsVo.append('mainImages', mainImage.raw)
        for (const detailImage of state.detailImages)
          if (detailImage.raw)
            goodsVo.append('detailImages', detailImage.raw)
        goodsApi.addGoods(goodsVo).then(() => {
          ElMessage.success('新增货品成功');
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}

//  删除货品
function handleDelete(row: { [key: string]: any }) {
  const goodsIds = row.id || state.ids.join(',');
  ElMessageBox.confirm(
    '是否确认删除货品编号为「' + goodsIds + '」的数据项?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(function () {
      goodsApi.deleteGoodsList(goodsIds).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

//  关闭货品弹窗
function closeDialog() {
  dialog.value.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.value.id = undefined;
  mainImages.value = []
  detailImages.value = []
  deleteMainImageIds.value = []
  deleteDetailImageIds.value = []
}

onMounted(() => {
  //  初始化货品列表数据
  handleQuery();

  //  初始化企业数据
  userApi.listUserPages({
    pageNum: 1,
    pageSize: 1024,
    keywords: "",
    isEnabled: true,
    type: 1
  }).then(({data}) => {
    let companyList = data.list;
    for (const user of companyList) {
      let value = user.id
      let label = user.username
      let companyOption = {value, label}
      state.companyOptions.push(companyOption)
    }
  })
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!-- 货品数据 -->
      <el-col :span="24" :xs="24">
        <!--  搜索栏  -->
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="货品名称"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="所属企业" prop="ownerId">
              <el-tree-select
                v-model="queryParams.ownerId"
                :data="companyOptions"
                placeholder="全部"
                clearable
                style="width: 200px"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <!--  增删操作  -->
          <template #header>
            <el-form-item style="float: left">
              <el-button
                type="success"
                :icon="Plus"
                @click="handleAdd"
              >新增
              </el-button>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="ids.length === 0"
                @click="handleDelete"
              >删除
              </el-button>
            </el-form-item>
          </template>

          <!--  展示栏  -->
          <el-table
            v-loading="loading"
            :data="goodsList"
            @selection-change="handleSelectionChange"
            show-overflow-tooltip
          >
            <el-table-column type="selection" width="30" align="center"/>
            <el-table-column
              key="id"
              label="ID"
              align="center"
              prop="id"
              width="42"
            />
            <el-table-column
              key="goodsName"
              label="货品名称"
              align="center"
              prop="goodsName"
              width="150"
            />
            <el-table-column
              #default="scope"
              label="货品简介"
              align="center"
              prop="description"
              width="233"
            >
              <div style="background-color: rgba(217,217,255,0.5); padding: 7px 0">{{ scope.row.description }}</div>
            </el-table-column>
            <el-table-column
              #default="scope"
              label="货品主视图"
              align="center"
              prop="mainImagePositions"
              width="120"
            >
              <el-carousel height="100px"
                           :indicator-position="scope.row.mainImageIDs.length > 1 ? 'outside' : 'none'"
                           :arrow="scope.row.mainImageIDs.length > 1 ? 'hover' : 'never'">
                <el-carousel-item v-for="(item, index) in scope.row.mainImagePositions" :key="index">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="pictureBaseURL + item"
                    :preview-src-list="[pictureBaseURL + item]"
                    :alt="scope.row.mainImageOriginalNames[index]"
                    :preview-teleported="true"
                  />
                </el-carousel-item>
              </el-carousel>
            </el-table-column>
            <el-table-column
              #default="scope"
              label="货品详细图"
              align="center"
              prop="detailImagePositions"
              width="120"
            >
              <el-carousel height="100px"
                           :indicator-position="scope.row.detailImageIDs.length > 1 ? 'outside' : 'none'"
                           :arrow="scope.row.detailImageIDs.length > 1 ? 'hover' : 'never'">
                <el-carousel-item v-for="(item, index) in scope.row.detailImagePositions" :key="index">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="pictureBaseURL + item"
                    :preview-src-list="[pictureBaseURL + item]"
                    :alt="scope.row.detailImageOriginalNames[index]"
                    :preview-teleported="true"
                  />
                </el-carousel-item>
              </el-carousel>
            </el-table-column>
            <el-table-column
              #default="scope"
              key="ownerId"
              label="所属企业"
              align="center"
              prop="ownerName"
              width="120"
            >
              <el-tag type="success" size="large" color="#eee">{{ scope.row.ownerName }}</el-tag>
            </el-table-column>
            <el-table-column
              #default="scope"
              label="佣金"
              align="center"
              prop="brokerage"
              width="150"
            >
              <el-tag type="warning" size="large" color="#f8e3c5">${{ scope.row.brokerage }}</el-tag>
            </el-table-column>
            <el-table-column
              #default="scope"
              label="创建时间"
              align="center"
              prop="createTime"
              width="150"
            >
              <el-tag type="info" size="large">{{
                  scope.row.createTime.replace('T', '  ').replaceAll('-', '/')
                }}
              </el-tag>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click="handleUpdate(scope.row)"
                >编辑
                </el-button
                >
                <el-button
                  type="danger"
                  link
                  @click="handleDelete(scope.row)"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 货品表单 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="货品名称" prop="goodsName">
          <el-input v-model="formData.goodsName" placeholder="请输入货品名称"/>
        </el-form-item>

        <el-form-item label="货品简介" prop="description">
          <el-input v-model="formData.description" placeholder="请输入货品简介"/>
        </el-form-item>

        <el-form-item label="所属企业" prop="ownerId">
          <el-tree-select
            placeholder="请选择货品所属企业"
            v-model="formData.ownerId"
            :data="companyOptions"
          />
        </el-form-item>

        <el-form-item label="佣金" prop="brokerage">
          <el-input v-model="formData.brokerage" placeholder="请输入佣金"/>
        </el-form-item>

        <el-form-item label="主视图" prop="mainImages">
          <el-upload
            action="#"
            v-model:file-list="mainImages"
            list-type="picture-card"
            :auto-upload="false"
            :multiple="true"
            :limit="4"
            :drag="true"
            accept="image/*"
            :on-preview="handlePreview"
            :on-remove="handleRemoveM"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500KB.
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="详细图" prop="detailImages">
          <el-upload
            action="#"
            v-model:file-list="detailImages"
            list-type="picture-card"
            :auto-upload="false"
            :multiple="true"
            :limit="4"
            :drag="true"
            accept="image/*"
            :on-preview="handlePreview"
            :on-remove="handleRemoveD"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500KB.
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-dialog v-model="ImageDialogVisible" :title="ImageDialogTitle" style="max-width: 800px">
          <img :src="ImageDialogImageUrl" alt="Preview Image"
               style="width: 90%; aspect-ratio: auto; margin: 0 auto"/>
        </el-dialog>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.el-table .cell {
  box-sizing: border-box;
  overflow: inherit;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding: 0 12px;
}
</style>
