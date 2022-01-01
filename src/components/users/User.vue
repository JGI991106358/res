<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="querInfo.query" clearable @clear="getUserInfo">
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column  label="姓名" prop="username"></el-table-column>
        <el-table-column  label="邮箱" prop="email"></el-table-column>
        <el-table-column  label="电话" prop="moble"></el-table-column>
        <el-table-column  label="角色" prop="role_name"></el-table-column>
        <el-table-column  label="状态" prop="mg_state">
          <template slot-scope="scoped">
            <el-switch v-model="scoped.row.mg_state" @change="stateChange(scoped.row)">
            </el-switch>
            <!-- {{scoped.row}}每一行表格的数据项 -->
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="180px">
          <template scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
            <!-- tooltip提示文字 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 添加用户的Dialog -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialog"
        width="50%"
        @close="clearnDialog">
        <!-- 内容主体区 -->
        <el-form :model="addFrom" :rules="addRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editVisible"
        width="50%"
        @close="editDialogClosed">
          <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px">
            <el-form-item label="用户名">
              <el-input v-model="editFrom.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="modile">
              <el-input v-model="editFrom.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editFrom.email"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义校验规则
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱!'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号!'))
    }
    return {
      querInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialog: false, // 控制添加用户的显示隐藏
      // 添加用户的表单数据
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输登入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改窗口的显示隐藏
      editVisible: false,
      editFrom: {}, // 保存查询出来的用户信息数据
      editFromRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      } // 修改表单的验证规则
    }
  },
  methods: {
    async getUserInfo () {
      const { data: res } = await this.$http.get('users', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.console.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 用户状态改变Switch开关
    async stateChange (state) {
      const { data: res } = await this.$http.put(`users/${state.id}/state/${state.mg_state}`)
      if (res.meta.status !== 200) {
        state.mg_state = !state.mg_state
        return this.$$message.error('更新状态失败')
      }
      this.$message.success('更新状态成功')
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getUserInfo()
    },
    // 监听页码值改变的时间
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.querInfo.pagenum = newPage
      this.getUserInfo()
    },
    // 监听对话框关闭
    clearnDialog () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户表单
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // validate()方法 预验证的回调函数回调的valid参数返回验证的结果
        if (!valid) return
        // 发起添加用户的请求
        const { data: res } = await this.$http.post('users', this.addFrom)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 隐藏添用户的对话框，刷新列表
        this.addDialog = false
        this.getUserInfo()
      })
    },
    // 修改用户信息对话框
    async editDialog (id) {
      this.editVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('显示失败')
      }
      this.editFrom = res.data
      this.editVisible = true
    },
    // 监听修改用户对话框关闭
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },
    // 提交修改
    editUserInfo () {
      // 预校验
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        // 发送请求修改数据
        const { data: res } = await this.$http.put('users/' + this.editFrom.id, { email: this.editFrom.email, mobile: this.editFrom.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.editVisible = false
        this.getUserInfo()
        this.$message.success('更新数据成功')
      })
    },

    // 删除用户
    async removeUser (id) {
      // 触发二次确认弹框
      const confireResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        // 捕获并返回异常
        return err
      })
      // 成功的结果是confirm 失败的结果concel
      // console.log(confireResult)
      if (confireResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserInfo()
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>

</style>
