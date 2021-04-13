<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">角色管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="showInfo()">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展示表格下拉项 -->
        <el-table-column type="expand">
          <!-- 渲染下拉项内容 一层渲染 -->
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="[i1 === 0 ? '' : 'dbtop', 'vcenter', 'dbbottom']"
            >
              <el-col :span="9">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级渲染 -->
              <el-col :span="15">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['dbbottom', i2 === 0 ? '' : 'dbtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级渲染 -->
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="技术负责人" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editInfo(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoleById(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightInfo(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--编辑角色按钮-->
    <el-dialog title="编辑信息" :visible.sync="editdialogVisible" width="30%">
      <!-- 编辑表单 -->
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="roleId">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormById()">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加角色按钮-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="resetForm()"
    >
      <!-- 添加表单 -->
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        label-width="80px"
        :rules="addRoleRule"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出对话框 -->

    <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="30%"
    @close="setRightsDiologClose()">
      <el-tree
        :data="rightsList"
        show-checkbox
        default-expand-all
        :default-checked-keys='defKey'
        node-key="id"
        :props="defProps"
        ref="rightTreeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkedId()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      //权限列表
      rightsList: [],
      //编辑角色
      editdialogVisible: false,
      //添加角色
      addDialogVisible: false,
      //分配权限
      setRightDialogVisible: false,
      editForm: {
        roleId: null,
        roleName: "",
        roleDesc: "",
      },
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      editRightForm: {
        id: null,
      },
      addRoleRule: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 4,
            max: 10,
            message: "名称长度在 4 到 10 之间",
            trigger: "blur",
          },
        ],
        roleDesc: [{}],
      },
      //绑定name属性
      defProps: {
        label: 'authName',
        children: 'children',
      },
      //默认选中的key值
      defKey: []
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      this.rolesList = res.data;
      console.log(res);
    },
    async removeRightById(role, rightId) {
      //弹框信息
      const results = await this.$confirm("即将删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (results === "confirm") {
        //如果点击确定，则发送请求
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) return this.$message.error("删除失败");
        this.$message.success("删除成功");
        role.children = res.data;
      }
    },
    //根据id获取角色信息
    async editInfo(id) {
      this.editdialogVisible = true;
      //    console.log(id);
      const { data: res } = await this.$http.get(`roles/${id}`);
      //获取的值给input输入框
      this.editForm.roleId = res.data.roleId;
      this.editForm.roleName = res.data.roleName;
      this.editForm.roleDesc = res.data.roleDesc;
    },
    //根据id修改角色信息
    async editFormById() {
      //表单预验证（我不想写了）

      //发送请求
      const { data: res } = await this.$http.put(
        "roles/" + this.editForm.roleId,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改角色失败");
      this.$message.success("修改角色成功");
      //更新页面
      this.getRolesList();
      //清空表单
      this.$refs.editFormRef.resetFields();
      //关闭表单
      this.editdialogVisible = false;
    },
    //删除角色
    async deleteRoleById(role) {
      //警示框
      const results = await this.$confirm("即将删除该角色, 是否继续?", "提示", {
        nfirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (results === "confirm") {
        //如果点击确定，则发送请求
        const { data: res } = await this.$http.delete(`roles/${role.id}`);
        if (res.meta.status !== 200) return this.$message.error("删除失败");
        this.$message.success("删除成功");
        //更新试图
        this.getRolesList();
      }
    },
    addRole() {
      //表单预验证
      this.$refs.addRoleFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        //验证成功,发送请求
        const { data: res } = await this.$http.post("roles", {
          roleName: this.addRoleForm.roleName,
          roleDesc: this.addRoleForm.roleDesc,
        });
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("创建角色失败");
        this.$message.success("创建角色成功");
        //更新视图
        this.getRolesList();
        //关闭提示框
        this.addDialogVisible = false;
      });
    },
    showInfo() {
      this.addDialogVisible = true;
    },
    //关闭重置表单内容
    resetForm() {
      this.$refs.addRoleFormRef.resetFields();
    },
    //获取权限列表树
    async showSetRightInfo(role) {
      const { data: res } = await this.$http.get("rights/tree");
      if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      //点击对应按钮时。保存id值
      this.editRightForm.id = role.id
      this.getDefKeys(role,this.defKey)
      this.setRightDialogVisible = true;

    },
     //根据权限，勾选
     //递归获取所有三级权限，并且保存到defkey中
    getDefKeys(node,arr) {
        if(!node.children) return arr.push(node.id)
            node.children.forEach(item => {
            this.getDefKeys(item, arr)
        });
    },
    //当对话框关闭时，清空数组defkey
    setRightsDiologClose() {
        this.defKey = []
    },
    //获取所有被选中节点的id
   async checkedId() {
        const keys = [...this.$refs.rightTreeRef.getCheckedKeys(),
                        ...this.$refs.rightTreeRef.getHalfCheckedKeys()]
        //join拆分数组，并且以‘，’隔开
        const idStr = keys.join(',')
        console.log(idStr);
        //发送请求
       const {data: res} = await this.$http.post(`roles/ `+this.editRightForm.id +`/rights`,{
           rids: idStr
       })
       console.log(res); 
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.setRightDialogVisible = false
        this.getRolesList();
    
    }

  },
};
</script>

<style scoped leng="less">
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
