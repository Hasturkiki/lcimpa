<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
//  Api引入
import userApi from '@/api/user'

import {
  reactive,
  ref,
  watchEffect,
  onMounted,
  toRefs
} from 'vue';
import {
  ElTree,
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
  UserForm,
  UserQuery,
  UserType
} from '@/api/user/types';

const typeTreeRef = ref(ElTree);  //  用户类型树
const queryFormRef = ref(ElForm); //  查询表单
const dataFormRef = ref(ElForm);  //  用户表单

const state = reactive({
  //  遮罩层
  loading: true,
  //  选中数组
  ids: [] as number[],
  //  总条数
  total: 0,
  userList: [] as UserType[],
  dialog: {
    visible: false
  } as DialogType,
  //  用户类型下拉项
  typeOptions: [
    {value: "-1", label: "用户类型", disabled: true, children: [{value: "1", label: "企业"}, {value: "2", label: "主播"}]}
  ],
  typeOptionsSelect: [{value: 1, label: "企业"}, {value: 2, label: "主播"}],
  typeName: undefined,
  formData: {
    isEnabled: true
  } as UserForm,
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as UserQuery,
  rules: {
    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
    type: [{required: true, message: '用户类型不能为空', trigger: 'blur'}],
    email: [
      {
        pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        message: '请输入正确的电子邮箱地址',
        trigger: 'blur'
      }
    ],
    telephone: [
      {
        pattern: /^[1][3-9][0-9]{9}$/,
        message: '请输入正确的联系方式',
        trigger: 'blur'
      }
    ]
  }
});

const {
  ids,
  loading,
  queryParams,
  userList,
  total,
  dialog,
  formData,
  rules,
  typeOptions,
  typeName,
  typeOptionsSelect
} = toRefs(state);

//  watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
watchEffect(() => {
  typeTreeRef.value.filter(state.typeName);
}, {flush: 'post'});

//  用户类型筛选
function filterTypeNode(value: string, data: any) {
  if (!value) {
    return true;
  }
  return data.label.indexOf(value) !== -1;
}

//  用户类型树节点click
function handleTypeNodeClick(data: { [key: string]: any }) {
  state.queryParams.type = data.value
  handleQuery();
}

//  用户状态change
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.isEnabled === true ? '启用' : '停用';
  ElMessageBox.confirm(
    '确认要' + text + '' + row.username + '用户吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      if (row.isEnabled === true)
        return userApi.enableUserById(row.id);
      else
        return userApi.disableUserById(row.id);
    })
    .then(() => {
      ElMessage.success(text + '成功');
    })
    .catch(() => {
      row.isEnabled = row.isEnabled !== true;
    });
}

//  查询
function handleQuery() {
  state.loading = true;
  userApi.listUserPages(state.queryParams).then(({data}) => {
    state.userList = data.list;
    state.total = data.total;
    state.loading = false;
  });
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

//  重置密码
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    '请输入用户「' + row.username + '」的新密码',
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(({value}) => {
      if (!value) {
        ElMessage.warning('密码不可为空');
        return false;
      } else if(!new RegExp('^[A-Za-z0-9]{6,16}$').test(value)) {
        ElMessage.warning('密码为6~16个英文或数字');
        return false;
      }
      userApi.updateUserPassword(row.id, value).then(() => {
        ElMessage.success('密码重置成功，用户' + row.username + '的新密码是：' + value);
      });
    })
    .catch(() => {
    });
}

//  添加用户
async function handleAdd() {
  state.dialog = {
    title: '添加用户',
    visible: true
  }
}

//  修改用户
async function handleUpdate(row: { [key: string]: any }) {
  dialog.value = {
    title: '修改用户',
    visible: true
  };

  const userId = row.id || state.ids;
  userApi.getUserForm(userId).then(({data}) => {
    formData.value = data;
  });
}

//  表单提交
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = state.formData.id;
      if (userId) {
        userApi.updateUser(state.formData).then(() => {
          ElMessage.success('修改用户成功');
          closeDialog();
          handleQuery();
        });
      } else {
        let username = state.formData.username
        let type = state.formData.type
        let telephone = state.formData.telephone
        let email = state.formData.email
        let isEnabled = state.formData.isEnabled
        userApi.addUser(username, type, telephone, email, isEnabled).then(() => {
          ElMessage.success('新增用户成功，默认密码为123456');
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}

//  删除用户
function handleDelete(row: { [key: string]: any }) {
  const userIds = row.id || state.ids.join(',');
  ElMessageBox.confirm(
    '是否确认删除用户编号为「' + userIds + '」的数据项?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(function () {
      userApi.deleteUsers(userIds).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('删除失败'));
}

//  关闭用户弹窗
function closeDialog() {
  dialog.value.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.value.id = undefined;
}

onMounted(() => {
  //  初始化用户列表数据
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 用户类型树 -->
      <el-col :span="4" :xs="24">
        <el-card shadow="never">
          <el-input
            v-model="typeName"
            placeholder="用户类型"
            clearable
            :prefix-icon="Search"
            style="margin-bottom: 20px"
          />
          <el-tree
            ref="typeTreeRef"
            :data="typeOptions"
            :props="{ children: 'children', label: 'label', disabled: '' }"
            :expand-on-click-node="false"
            :filter-node-method="filterTypeNode"
            default-expand-all
            @node-click="handleTypeNodeClick"
          />
        </el-card>
      </el-col>

      <!-- 用户数据 -->
      <el-col :span="20" :xs="24">
        <!--  搜索栏  -->
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="用户名"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="用户状态" prop="isEnabled">
              <el-select
                v-model="queryParams.isEnabled"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option value=true label="启用"/>
                <el-option value=false label="禁用"/>
              </el-select>
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
            :data="userList"
            @selection-change="handleSelectionChange"
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
              key="username"
              label="用户名"
              align="center"
              prop="username"
              width="120"
            />
            <el-table-column
              label="用户类型"
              width="80"
              align="center"
              prop="type"
              #default="scope"
            >
              <el-tag type="success" v-if="scope.row.type === 1">
                企业
              </el-tag>
              <el-tag v-else>
                主播
              </el-tag>
            </el-table-column>
            <el-table-column
              label="联系方式"
              align="center"
              prop="telephone"
              width="142"
            >
              <template #default="scope">
                <el-tag effect="plain" type="info" size="large" round v-if="scope.row.telephone.length !== 0">
                  {{ scope.row.telephone }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="电子邮箱"
              align="center"
              prop="email"
              width="180"
            >
              <template #default="scope">
                <el-tag effect="plain" type="info" size="large" round v-if="scope.row.email.length !== 0">
                  {{ scope.row.email }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="用户状态" align="center" prop="isEnabled" width="80">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isEnabled"
                  :inactive-value=false
                  :active-value=true
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="150"
            >
              <template #default="scope">
                <el-tag type="info">{{ scope.row.createTime.replace('T', '  ').replaceAll('-', '/') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template #default="scope">
                <el-button type="success" link @click="resetPassword(scope.row)">重置密码</el-button>
                <el-button
                  type="primary"
                  link
                  @click="handleUpdate(scope.row)"
                >编辑
                </el-button>
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

    <!-- 用户表单 -->
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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="用户类型" prop="type">
          <el-tree-select
            placeholder="请选择用户类型"
            v-model="formData.type"
            :data="typeOptionsSelect"
          />
        </el-form-item>

        <el-form-item label="联系方式" prop="telephone">
          <el-input
            v-model="formData.telephone"
            placeholder="请输入联系方式"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入电子邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="用户状态" prop="isEnabled">
          <el-radio-group v-model="formData.isEnabled">
            <el-radio :label=true>正常</el-radio>
            <el-radio :label=false>禁用</el-radio>
          </el-radio-group>
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
