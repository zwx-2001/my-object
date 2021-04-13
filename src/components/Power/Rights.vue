<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <!-- 权限等级显示 -->
        <el-table-column label="权限等级"
        >
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList();
  },
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      this.rightsList = res.data;
    },
  },
};
</script>

<style></style>
