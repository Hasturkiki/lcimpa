<script lang="ts">
export default {
  name: 'business'
};
</script>

<script setup lang="ts">
//  Api引入
import userApi from '@/api/user'
import goodsApi from '@/api/goods'
import businessApi from '@/api/business'

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
import {
  Search,
  Plus,
  Refresh,
  Delete
} from '@element-plus/icons-vue';
import {
  BusinessForm,
  BusinessQuery,
  BusinessType
} from '@/api/business/types';

const queryFormRef = ref(ElForm) //  查询表单
const dataFormRef = ref(ElForm)  // 业务表单

const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [] as number[],
  // 总条数
  total: 0,
  businessList: [] as BusinessType[],
  dialog: {
    visible: false
  } as DialogType,
  upOptions: [] as OptionType[],
  companyOptions: [] as OptionType[],
  goodsOptions: [] as OptionType[],
  goodsOptionsSelect: [] as OptionType[],
  stateOptionsSelect: [{value: 0, label: "未结算"}, {value: 1, label: "已结算"}, {value: 2, label: "已取消"}],
  upHistoryOptions: [] as OptionType[],
  companyHistoryOptions: [] as OptionType[],
  formData: {
    state: 0
  } as BusinessForm,
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as BusinessQuery,
  rules: {
    upId: [{required: true, message: '业务关联主播不能为空', trigger: 'blur'}],
    companyId: [{required: true, message: '业务关联企业不能为空', trigger: 'blur'}],
    goodsId: [{required: true, message: '业务关联货品不能为空', trigger: 'blur'}],
    brokerage: [
      {
        required: true,
        message: '佣金格式错误或超过限制',
        pattern: /^\d{1,8}(\.\d{1,4})?$/,
        trigger: 'blur'
      }
    ],
    state: [{required: true, message: '业务状态不能为空', trigger: 'blur'}],
  }
});

const {
  loading,
  ids,
  total,
  businessList,
  dialog,
  upOptions,
  companyOptions,
  goodsOptionsSelect,
  stateOptionsSelect,
  upHistoryOptions,
  companyHistoryOptions,
  formData,
  queryParams,
  rules
} = toRefs(state);

//  查询
function handleQuery() {
  state.loading = true
  businessApi.listBusinessPages(state.queryParams).then(({data}) => {
      state.businessList = data.list
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

//  添加业务
async function handleAdd() {
  state.dialog = {
    title: '添加业务',
    visible: true
  }
}

//  选中企业后更新货品列表&清空当前货品选择项
async function chooseCompany(companyId: number) {
  state.goodsOptionsSelect = []
  goodsApi.listGoodsPages({
    pageNum: 1,
    pageSize: 1024,
    keywords: "",
    ownerId: companyId
  }).then(({data}) => {
    let goodsList = data.list;
    for (const goods of goodsList) {
      let value = goods.id
      let label = goods.goodsName
      let goodsOption = {value, label}
      state.goodsOptionsSelect.push(goodsOption)
    }
    if (state.formData.goodsId && !state.formData.id) {
      state.formData.brokerage = ''
      state.formData.goodsId = ''
    }
  })
}

//  选中货品后显示默认佣金
async function showBrokerage(goodsId: number) {
  goodsApi.getGoodsForm(goodsId).then(({data}) => {
    state.formData.brokerage = data.brokerage
  })
}

//  修改业务
async function handleUpdate(row: { [key: string]: any }) {
  const businessId = row.id || state.ids;
  businessApi.getBusinessForm(businessId).then(({data}) => {
    formData.value = data
    chooseCompany(data.companyId)
  }).then(() => {
    dialog.value = {
      title: '修改业务',
      visible: true
    }
  });
}

//  表单提交
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      const businessId = state.formData.id;
      if (businessId) {
        businessApi.updateBusiness(state.formData).then(() => {
          ElMessage.success('修改业务成功');
          closeDialog();
          handleQuery();
        });
      } else {
        businessApi.addBusiness(state.formData).then(() => {
          ElMessage.success('新增业务成功');
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}

//  删除业务
function handleDelete(row: { [key: string]: any }) {
  const businessIds = row.id || state.ids.join(',');
  ElMessageBox.confirm(
    '是否确认删除业务编号为「' + businessIds + '」的数据项?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(function () {
      businessApi.deleteBusinessList(businessIds).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

//  关闭业务弹窗
function closeDialog() {
  dialog.value.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.value.id = undefined;
  state.goodsOptionsSelect = state.goodsOptions
}

onMounted(() => {
  //  初始化业务列表数据
  handleQuery();

  //  初始化主播数据
  userApi.listUserPages({
    pageNum: 1,
    pageSize: 1024,
    keywords: "",
    isEnabled: true,
    type: 2
  }).then(({data}) => {
    let upList = data.list;
    for (const user of upList) {
      let value = user.id
      let label = user.username
      let upOption = {value, label}
      state.upOptions.push(upOption)
    }
  })
  //  初始化企业数据（历史数据）
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
  //  初始化货品数据
  goodsApi.listGoodsPages({
    pageNum: 1,
    pageSize: 1024,
    keywords: "",
    ownerId: 0
  }).then(({data}) => {
    let goodsList = data.list;
    for (const goods of goodsList) {
      let value = goods.id
      let label = goods.goodsName
      let goodsOption = {value, label}
      state.goodsOptions.push(goodsOption)
    }
  })
  state.goodsOptionsSelect = state.goodsOptions

  //  初始化主播数据（历史数据）
  userApi.listUpHistory().then(({data}) => {
    let upList = data.list;
    for (const user of upList) {
      let value = user.id
      let label = user.username
      let upOption = {value, label}
      state.upHistoryOptions.push(upOption)
    }
  })
  //  初始化企业数据（历史数据）
  userApi.listCompanyHistory().then(({data}) => {
    let companyList = data.list;
    for (const user of companyList) {
      let value = user.id
      let label = user.username
      let companyOption = {value, label}
      state.companyHistoryOptions.push(companyOption)
    }
  })
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!-- 业务数据 -->
      <el-col :span="24" :xs="24">
        <!--  搜索栏  -->
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="关联信息"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="关联主播" prop="upId">
              <el-tree-select
                v-model="queryParams.upId"
                :data="upHistoryOptions"
                placeholder="全部"
                clearable
                style="width: 150px"
              />
            </el-form-item>

            <el-form-item label="关联企业" prop="companyId">
              <el-tree-select
                v-model="queryParams.companyId"
                :data="companyHistoryOptions"
                placeholder="全部"
                clearable
                style="width: 150px"
              />
            </el-form-item>

            <el-form-item label="状态" prop="state">
              <el-tree-select
                v-model="queryParams.state"
                :data="stateOptionsSelect"
                placeholder="全部"
                clearable
                style="width: 150px"
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
            :data="businessList"
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
              key="upId"
              label="关联主播名称"
              align="center"
              prop="upName"
              width="200"
            />
            <el-table-column
              key="companyId"
              label="关联企业名称"
              align="center"
              prop="companyName"
              width="200"
            />
            <el-table-column
              key="goodsId"
              label="关联货品名称"
              align="center"
              prop="goodsName"
              width="200"
            />
            <el-table-column
              #default="scope"
              label="实际佣金"
              align="center"
              prop="brokerage"
              width="150"
            >
              <el-tag type="warning" size="large" color="#f8e3c5">${{ scope.row.brokerage }}</el-tag>
            </el-table-column>
            <el-table-column #default="scope" label="用户状态" align="center" prop="state" width="150">
              <el-tag type="info" v-if="scope.row.state === 0">
                未结算
              </el-tag>
              <el-tag type="success" v-else-if="scope.row.state === 1">
                已结算
              </el-tag>
              <el-tag type="danger" v-else-if="scope.row.state === 2">
                已取消
              </el-tag>
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
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 业务表单 -->
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
        <el-form-item label="关联主播" prop="upId">
          <el-tree-select
            placeholder="请选择业务关联主播"
            v-model="formData.upId"
            :data="upOptions"
          />
        </el-form-item>

        <el-form-item label="关联企业" prop="companyId">
          <el-tree-select
            placeholder="请选择业务关联企业"
            v-model="formData.companyId"
            :data="companyOptions"
            @change="chooseCompany(formData.companyId)"
          />
        </el-form-item>

        <el-form-item label="关联货品" prop="goodsId">
          <el-tree-select
            v-if="!formData.companyId"
            disabled="true"
            placeholder="请先选择业务关联企业"
          />
          <el-tree-select
            v-else
            placeholder="请选择业务关联货品"
            v-model="formData.goodsId"
            :data="goodsOptionsSelect"
            @change="showBrokerage(formData.goodsId)"
          />
        </el-form-item>

        <el-form-item label="实际佣金" prop="brokerage">
          <el-input v-model="formData.brokerage" placeholder="请输入实际佣金" style="width: 200px"/>
        </el-form-item>

        <el-form-item label="业务状态" prop="state">
          <el-tree-select
            placeholder="请选择业务状态"
            v-model="formData.state"
            :data="stateOptionsSelect"
          />
        </el-form-item>
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
