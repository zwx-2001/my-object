<template>
  <div @keyup.enter="getUserList">
    <!-- 面包屑导航(我感觉更应该叫老鹰抓小鸡导航) -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 查询 -->
      <div>
        <el-row :gutter="40">
          <el-col :span="7">
            <!-- 可清空的输入框 后面多了一个×号 
                当点击了×号，可以触发一个clear回调函数-->
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- 数据渲染表格 -->
      <!-- border 带表格的边框
    stripe  斑马纹的边框 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 放入一个switch开关 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 存放三个操作按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editInfo(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-star-off"
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 pagination 组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addFormClosed"
    >
      <!-- 对话框添加表单 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息提示框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="userDialogVisible"
      width="30%"
      ref="editFormRef"
    >
      <!-- 编辑用户信息表单 -->
      <el-form :model="editForm" :rules="editRule" ref="editFormRef">
        <el-form-item label="username" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="moblie" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser" @close="editFormClosed"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--删除用户提示对话框-->
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    //自定义校验规则 email
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    //自定义脚亚目规则 手机号
    var checkPhone = (rule, value, callback) => {
      const regEmail = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      userDialogVisible: false,
      deleteDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {
        email: "",
        mobile: "",
        username: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 4,
            max: 10,
            message: "用户名的长度在 4 到 10 之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "密码长度在 6 到 12 之间",
            trigger: "blur",
          },
        ],
        email: [{ validator: checkEmail, trigger: "blur", required: true }],
        mobile: [{ validator: checkPhone, trigger: "blur", required: true }],
      },
      //编辑用户规则
      editRule: {
        id: [],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkPhone, trigger: "blur" }],
      },
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("查询失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //监听size的变化，获取到新的size 每页展示的个数
    handleSizeChange(newSize) {
      console.log(newSize);
      //根据最新的queryinfo去获取数据
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听page的变化 获取到新的page 第几页
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      //根据最新的queryinfo去获取数据
      this.getUserList();
    },
    //当用户的switch发生改变时，出发函数
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      // console.log(res.meta.status)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message.error("状态改变失败");
      } else {
        this.$message.success("状态改变成功");
      }
    },
    //添加用户
    addUser() {
      //提交表单都需要经行表单的预验证 验证成功发送请求
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 200) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //提交完成关闭表单
        this.dialogVisible = false
        this.$refs.ruleFormRef.resetFields();
      });
    },
    //监听添加表单关闭，关闭时候重置表单
    addFormClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    editFormClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    //根据id查找到用户信息
    async editInfo(id) {
      this.userDialogVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      console.log(res);
      //将用户信息渲染到输入框中
      this.editForm.email = res.data.email;
      this.editForm.mobile = res.data.mobile;
      this.editForm.username = res.data.username;
      this.editForm.id = res.data.id;
    },
    //编辑用户信息，发送请求
    editUser() {
      //先获取用户信息
      //表单预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //发送请求
        const { data: res } = await this.$http.put(
          `users/` + this.editForm.id,
          {
            mobile: this.editForm.mobile,
            email: this.editForm.email,
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改用户信息失败");
        this.$message.success("修改用户信息成功");
        //发送请求完成后，需要重新刷新页面的
        this.getUserList();
        console.log(res);
        //点击按钮会关闭页面
        this.userDialogVisible = false;
      });
    },
    //删除对话框
   async  deleteUser(id) {
   const results = await this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
              }).catch(err => err)
    console.log(results);
    if(results == 'confirm') {
      const{data: res} = await this.$http.delete(`users/${id}`)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    } 
      }
  },
};
</script>

<style scoped lang="less"></style>
