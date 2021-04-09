<template>
  <div class="login-container">
    <div class="login-box">
      <div class="img-box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- element使用icon图标
            prefix-icon-->
      <!--表单 --> 
        <el-form label-width="0px" class="form" :model="ruleForm" :rules="rules" ref="Form">
       <!--账号输入框-->
          <el-form-item  prop="name">
            <el-input prefix-icon="iconfont icon-zhanghao" v-model="ruleForm.name"></el-input>
          </el-form-item>
      <!--密码输入框-->
          <el-form-item  prop="password">
            <el-input  prefix-icon="iconfont icon-suo1" v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
      <!--按钮组-->
          <el-form-item class="buttons">
            <el-button type="primary" @click="login">Login</el-button>
            <el-button type="danger" @click="resetForm">cannel</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return{
      ruleForm: {
        name: 'admin',
        password: '123456'
      },
      rules: {
        name: [
            { required: true, message: '请输入活动名称', trigger: 'change' },
            { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'change' }
          ],
        password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 10, max: 15, message: '长度在 10 到 15 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      //点击cannel清空表单内容
      //resetFields函数
      this.$refs.Form.resetFields()
    },
    login() {
      //表单预校验
      //validate函数，接收一个回调函数,返回一个布尔值
      this.$refs.Form.validate((valid) => {
        this.$http.post("login",this.ruleForm)
          // if(valid) return this.$message.success('登录成功')
       //需要访问后端接口返回数据
        
      })
    }
  }
}
</script>

<style>
  @import '../assets/css/global.css';
  .login-container {
    width: 100%;
    height: 100%;
    background-color: rgb(2, 43, 78,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-box {
    width: 600px;
    height: 350px;
    background-color: aliceblue;
    position: relative;
    opacity: 0.8;
    border-radius: 10px;

  }
  .img-box {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: aliceblue;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
  .form {
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>