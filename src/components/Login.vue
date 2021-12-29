<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginRef" :model="loginFrom" label-width="0px" class="login_form" :rules="loginRules">
        <!-- 账号框 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码框 -->
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima" type="password" ></el-input>
        </el-form-item>
         <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登入表单的数据绑定对象
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输登入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 重置登入表单
    resetLogin () {
      // 想要获取表单的方法就得先获取表单得实例对象再使用resetFields()方法重置表单
      this.$refs.loginRef.resetFields()
    },
    // 表单登入验证
    login () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginFrom)
        if (res.meta.status > 200 && res.meta.status > 300) return this.$message.error('登入失败')
        this.$message.success('登入成功')
        // 将token保存到会话作用域中sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.replace('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
 .login_container {
   background-color: #2b4b6b;
   height: 100%;
   .login_box {
     width: 450px;
     height: 300px;
     background-color: #fff;
     border-radius: 3px;
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%, -50%);
     .avatar_box {
       height: 130px;
       width: 130px;
       border: 1px solid #eee;
       border-radius: 50%;
       padding: 10px;
       box-shadow: 0 0 10px #ddd;
       position: absolute;
       left: 50%;
       transform: translate(-50%, -50%);
       background-color: #fff;
       img {
         width: 100%;
         height: 100%;
         border-radius: 50%;
         overflow: hidden;
         background-color: #eee;
       }
     }
   }
 }
//  表单区域
.login_form {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  padding: 0 20px;
  bottom: 0;
}
 .btns {
   display: flex;
   justify-content: flex-end;
 }
</style>
