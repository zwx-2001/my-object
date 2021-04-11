<template>

    <el-container>
  <el-header>
    <div class="logo">
      <img src="../assets/logo.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="clear">退出</el-button>
  </el-header>
  <el-container>
    <!--侧边导航栏-->
    <el-aside :width="temp ? '64px' : '200px'">
      <div class="toggle-button" @click="toggle()">|||</div>
      <!--菜单区域-->
      <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      :collapse = temp
      :collapse-transition = 'false' router :default-active="activePath">
      <!--unique-opend表示是否只保持一个菜单开启，默认是false
          collapse-transition 折叠动画关闭-->
      <!--一级菜单-->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <!---菜单图标-->
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!--二级菜单-->
        <!--index的作用是，开启路由后，将index的值作为path，然后跳转路由-->
        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/' + subItem.path" @click="saveNavState('/' + subItem.path)">
          <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
  </el-container>

</template>

<script>
export default {
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return{
      //折叠侧边栏的决定值
      temp: false,
      //选中按钮的路径
      activePath:'',
      menuList: [],
      iconsObj: {
        "125": 'iconfont icon-yonghuguanli',
        "103": "iconfont icon-quanxianguanli",
        "101": "iconfont icon-shangpinguanli",
        "102": "iconfont icon-dingdanguanli",
        "145": "iconfont icon-shujutongji"
      }
    }
  },
  methods: {
    clear() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) this.$message.error('获取左侧菜单失败')
      this.$message.success('获取成功')
      this.menuList = res.data
      console.log(res);
    },
    toggle() {
      this.temp = !this.temp
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      //点击时，将活跃路径的值传递给this.activePath
      this.activePath = activePath
    }
  }

}
</script>

<style scoped>
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
.iconfont {
  margin-right: 10px;
  font-size: 25px;
}
.el-menu {
  border-right: none !important;
}
.toggle-button {
  background-color: #4a5064;
  cursor: pointer;
  color: white;
  text-align: center;
  font-size: 10px;
  line-height: 25px;
  letter-spacing: 0.2em;
}
</style>