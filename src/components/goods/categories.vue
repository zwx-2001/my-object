<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateInfo()"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 自定义表格 -->
      <tree-table
        :data="CategoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-circle-close" v-else style="color: red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="danger" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="edit" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateInfo(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[4, 8, 10]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateTotal"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑分类提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="editCateVisible"
      width="30%"
      @close="editInfoClose()"
    >
      <el-form :model="editInfo" ref="editCateFormRef">
        <el-form-item label="修改分类" prop="cat_name">
          <el-input v-model="editInfo.cat_name" clearable> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类提示框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="30%"
      @close="addCateDialogClose()"
    >
      <el-form :model="addInfo" ref="addCateFormRef">
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="addInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader
            v-model="checkedOptKey"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategories();
  },
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      //分类总数
      cateTotal: null,
      CategoriesList: [],
      //tree-table定义列的规则
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示当前是模板列
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "edit",
        },
      ],
      //编辑分类
      editCateVisible: false,
      addCateVisible: false,
      //修改分类名称
      editInfo: {
        cat_id: "",
        cat_name: "",
      },
      //添加分类
      addInfo: {
        cat_pid: "0",
        cat_name: "",
        cat_level: "0",
      },
      //初始化父级分类列表
      parentCateList: [],
      //cascader选中的id
      checkedOptKey: [],
      //cascader的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: 'hover',
        checkStrictly: true
      },
    };
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      console.log(res);
      this.CategoriesList = res.data.result;
      this.cateTotal = res.data.total;
    },
    //当size发生改变时候触发该函数
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage;
      this.getCategories();
    },
    //当页码发生变化时触发该函数
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCategories();
    },
    //修改分类名称
    editCateInfo(cate) {
      this.editInfo.cat_id = cate.cat_id;
      this.editInfo.cat_name = cate.cat_name;
      console.log(this.editInfo.cat_name);
      this.editCateVisible = true;
    },
    //发送修改分类名称请求
    async editCate() {
      const { data: res } = await this.$http.put(
        `categories/` + this.editInfo.cat_id,
        {
          cat_name: this.editInfo.cat_name,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.editCateVisible = false;
      this.getCategories();
    },
    //关闭修改分类表单，重置表单
    editInfoClose() {
      this.$refs.editCateFormRef.resetFields();
    },
    //删除分类
    async deleteCate(cate) {
      //弹出框，返回的是一个promise
      const results = await this.$confirm("确定删除该分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (results == "confirm") {
        const { data: res } = await this.$http.delete(
          `categories/${cate.cat_id}`
        );
        //模板
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.editCateVisible = false;
        this.getCategories();
      }
    },
    //添加分类
    async addCate() {
      console.log(this.addInfo.cat_name);
      const { data: res } = await this.$http.post("categories", this.addInfo);
      console.log(res);
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.addCateVisible = false
      this.getCategories();
    },

    //获取和显示分类的列表
    showAddCateInfo() {
      this.getParentCateList();
      this.addCateVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.parentCateList = res.data;
    },
    //级联选择器发生了变化时
    handleChange() {
      if (this.checkedOptKey.length > 0) {
        this.addInfo.cat_pid = this.checkedOptKey[
          this.checkedOptKey.length - 1
        ];
        this.addInfo.cat_level = this.checkedOptKey.length;
      } else {
        this.addInfo.cat_pid = 0;
        this.addInfo.cat_level = 0;
      }
      console.log(this.addInfo);
    },
    //当添加分类弹出框关闭的时候
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.checkedOptKey = [];
      this.addInfo.cat_pid = 0;
      this.addInfo.cat_level = 0;
    },
  },
};
</script>

<style leng="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>
