<template>

    <el-container>
  <el-header>
    <div class="logo">
      <img src="../assets/logo.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info">退出</el-button>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item>
          <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>
  </el-container>

</template>

<script>
export default {

}
</script>

<style>
.el-header {
  background-color: #373d41;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-container {
  width: 100%;
  height: 100%;
}
.el-header  div img  {
  height: 100%;
  width: auto;
}
.logo {
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
}
</style>