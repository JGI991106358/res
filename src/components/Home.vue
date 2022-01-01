<template>
    <el-container class="home-contant">
      <!-- 头部区域 -->
        <el-header>
          <div>
            <img src="">
            <span>电商后台管理</span>
          </div>
          <el-button type="danger" @click="logout" size="mini">退出</el-button>
        </el-header>
        <!-- 主体区域 -->
        <el-container>
            <!-- 主体侧边栏部分 -->
            <el-aside :width="isCollapse? '64px':'200px' ">
              <!-- 折叠菜单栏 -->
              <div class="toggle-button" @click="toggle">|||</div>
              <!-- 侧边菜单区域 -->
              <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF"
                :collapse="isCollapse"
                :collapse-transition="false"
                :router="true"
                :default-active='activePath'>
                <!-- 一级菜单 -->
                <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
                  <!-- 一级菜单模板区域 -->
                  <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconsObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                  </template>

                  <!-- 二级菜单 -->
                  <el-menu-item :index=" '/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveActive( '/' + subItem.path)">
                    <template slot="title">
                      <!-- 图标 -->
                      <i class="el-icon-menu"></i>
                      <!-- 文本 -->
                      <span>{{subItem.authName}}</span>
                    </template>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-aside>
            <!-- 主体内容区域 -->
            <el-main>
              <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.replace('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 折叠菜单
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    // 激活菜单项显示高亮效果
    saveActive (actPath) {
      window.sessionStorage.setItem('path', actPath)
      this.activePath = actPath
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('path')
  }
}
</script>

<style lang="less" scoped>
  .home-contant {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    background-color: #373d41;
    color: #fff;
    font-size: 20px;
    >div {
      display: flex;
      align-items: center;
      span {
        margin-left: 35px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #EAEDF1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
  }
</style>>
