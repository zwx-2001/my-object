<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告提示 -->
      <el-alert title="选中三级分类才能编辑参数" type="warning" show-icon>
      </el-alert>
      <!--  -->
      <el-row class="cate">
        <el-col>
          <span>选中的的分类：</span>
          <!--级联选择器  -->
          <el-cascader
            v-model="checkedOptKey"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
            ref="cascaderRef"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many" :disabled="isDisabled">
          <el-button
            type="primary"
            size="mini"
            @click="addAtrrInfo()"
            :disabled="isDisabled"
            >编辑动态参数</el-button
          >
          <!-- 渲染表格 -->
          <el-table :data="manyCateList">
            <el-table-column type="expand" prop="attr_vals">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteTag(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 动态编辑按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditAttrInfo(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteAttr(scope.row)"
                  >删除</el-button
                >
              </template>
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only" :disabled="isDisabled">
          <el-button
            type="primary"
            size="mini"
            @click="addAtrrInfo()"
            :disabled="isDisabled"
            >编辑静态参数</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyCateList">
            <!-- //下拉参数tags -->
            <el-table-column type="expand" prop="attr_vals">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteTag(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 动态编辑按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditAttrInfo(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteAttr(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- //添加参数对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClose()"
    >
      <el-form
        :rules="addAtrrRules"
        ref="addAtrrFormRef"
        :model="addAtrrFormInfo"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addAtrrFormInfo.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="attr_vals">
          <el-input
            v-model="addAtrrFormInfo.attr_vals"
            :disabled="attr_vals"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数提示对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClose()"
    >
      <el-form
        ref="editAttrFormRef"
        :model="editAttrFormRef"
        :rules="addAtrrRules"
      >
        <el-form-item label="新参数名" prop="attr_name">
          <el-input v-model="editAttrFormRef.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="新参数描述" prop="attr_vals">
          <el-input v-model="editAttrFormRef.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      //tabs选中的name
      activeName: "many",
      //选中的分类id列表
      checkedOptKey: [],
      //分类列表
      cateList: [],
      //静态参数列表，
      onlyCateList: [],
      //添加属性对话款visible
      addDialogVisible: false,
      //编辑属性的visible
      editDialogVisible: false,
      //动态参数列表
      manyCateList: [],
      //添加vals按钮visible
      inputVisible: false,
      //vals输入框的值
      inputValue: "",
      //配置级联选择器
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      //添加属性表单验证规则
      addAtrrRules: {
        attr_name: [
          { required: true, message: "请输入参数", trigger: "blur" },
          { min: 4, max: 8, message: "参数长度在4 到 10之间", trigger: "blur" },
        ],
        attr_vals: [
          { message: "请输入值", trigger: "blur" },
          { min: 4, max: 8, message: "值长度在4 到 10之间", trigger: "blur" },
        ],
      },
      //添加的属性表单
      addAtrrFormInfo: {
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
      },
      //编辑属性表单
      editAttrFormRef: {
        attr_name: "",
        attr_vals: "",
      },
      //保存编辑属性的请求参数
      cateId: "",
      attrId: "",
      //tag标签
      tag_vals: [],
    };
  },
  methods: {
    //获取所有分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.cateList = res.data;
    },
    //tabs点击事件
    handleTabsClick() {
      this.getAttrList();
    },
    //层级选择器改变事件
    handleChange() {
      this.getAttrList();
    },
    //获取动态和静态参数列表
    async getAttrList() {
      const { data: res } = await this.$http.get(
        "categories/" + this.checkedOptKey[2] + "/attributes",
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return;
      } else {
        res.data.forEach((item) => {
          if (item.attr_vals) {
            item.attr_vals = item.attr_vals.split(",");
          } else {
            item.attr_vals = [];
          }
          item.inputValue = "";
          item.inputVisible = false;
        });
        if (this.activeName === "many") {
          this.manyCateList = res.data;
        } else {
          this.onlyCateList = res.data;
        }
      }
    },
    //添加参数显示对话框
    addAtrrInfo() {
      this.addDialogVisible = true;
    },
    //添加属性发送请求
    async addAttr() {
      //表单与验证
      this.$refs.addAtrrFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/` + this.checkedOptKey[2] + `/attributes`,
          {
            attr_name: this.addAtrrFormInfo.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.addAtrrFormInfo.attr_vals,
          }
        );
        this.getAttrList();
        this.addDialogVisible = false;
      });
    },
    showEditAttrInfo(cate) {
      this.editDialogVisible = true;
      //保存点击的属性的id 和分类的id
      this.cateId = cate.cat_id;
      this.attrId = cate.attr_id;
    },
    //发送编辑属性的请求
    editAttr() {
      //表单与验证
      this.$refs.editAttrFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/` + this.cateId + `/attributes/` + this.attrId,
          {
            attr_name: this.editAttrFormRef.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.editAttrFormRef.attr_vals,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.editDialogVisible = false;
        this.getAttrList();
      });
    },
    //对话框关闭
    editDialogClose() {
      this.$refs.editAttrFormRef.resetFields();
    },
    addDialogClose() {
      this.$refs.addAtrrFormRef.resetFields();
    },
    //删除属性功能设计
    async deleteAttr(cate) {
      this.cateId = cate.cat_id;
      this.attrId = cate.attr_id;
      //弹出警示框
      const results = await this.$confirm(
        "此操作将永久删除该属性, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (results === "confirm") {
        //发送删除请求
        const { data: res } = await this.$http.delete(
          `categories/` + this.cateId + `/attributes/` + this.attrId
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.getAttrList();
        console.log(res);
      }
    },
    //点击添加vals的按钮，显示input
    showInput(cate) {
      cate.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(cate) {
      console.log(cate);
      if (cate.inputValue.trim().length === 0) {
        cate.inputValue = "";
        cate.inputVisible = false;
        return;
      }
      cate.attr_vals.push(cate.inputValue);
      cate.inputValue = "";
      cate.inputVisible = false;
      const { data: res } = await this.$http.put(
        `categories/${cate.cat_id}/attributes/${cate.attr_id}`,
        {
          attr_name: cate.attr_name,
          attr_sel: cate.attr_sel,
          attr_vals: cate.attr_vals.join(","),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
    //删除属性下的vals，tags
    async deleteTag(index, cate) {
      //index是tags的下标，表示删除第几个
      cate.attr_vals.splice(index, 1);
      //改变了数组，重新发起请求
      const { data: res } = await this.$http.put(
        `categories/${cate.cat_id}/attributes/${cate.attr_id}`,
        {
          attr_name: cate.attr_name,
          attr_sel: cate.attr_sel,
          attr_vals: cate.attr_vals.join(","),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
  },
  //计算属性
  computed: {
    isDisabled: function() {
      if (this.checkedOptKey.length === 3) {
        return false;
      } else {
        return true;
      }
    },
    attrName: function() {
      if (this.activeName === "only") {
        return "添加静态属性";
      } else {
        return "添加动态属性";
      }
    },
    attr_vals() {
      if (this.activeName === "many") {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style leng="less" scoped>
.cate {
  margin-top: 15px;
}
.el-tag {
  margin-right: 5px;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
</style>
