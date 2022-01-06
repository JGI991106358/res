<template>
  <div>
      <!-- 导航栏 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- Card区域 -->
      <el-card class="box-card">
        <el-row>
          <el-col>
            <el-button type="primary" @click="addRolesModle = true">添加角色</el-button>
          </el-col>
        </el-row>
        <el-table  :data="rolesList" border stripe>
          <el-table-column type="expand">
            <!-- 通过作用域插槽获取每一行的数据 -->
            <template slot-scope="scope">
              <el-row v-for=" (item1, index) in scope.row.children" :key="item1.id" :class="['bdbottom', index === 0? 'bdtop':'', 'vcenter']">
                <!-- 渲染一级权限 -->
                <el-col :span="5"  style="text-align: center">
                  <el-tag closable @close="deleteRole(scope.row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <el-row v-for="(item2, index) in item1.children" :key="item2.id" :class="['bdbottom', index === 0? '':'bdtop', 'vcenter']">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="deleteRole(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="deleteRole(scope.row, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoles(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="openRoles(scope.row, )">分配权限</el-button>
          </template>
          </el-table-column>
        </el-table>
    </el-card>、

    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesModle"
      width="50%"
      @close="clearnDialog">
      <el-form ref="addFromRef" label-width="80px" :model="addFrom" :rules="addRules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addFrom.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesModle = false">取 消</el-button>
          <el-button type="primary" @click="addRoleUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rolesVisible"
      width="50%"
      @close="resetRoles">
     <el-tree ref="treeRef" :data="setRights" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKey"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      addRolesModle: false, // 添加数据的模态窗口
      addFrom: {
        name: '',
        description: ''
      },
      addRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      },
      rolesVisible: false,
      setRights: [], // 所有权限的数据
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      roleId: '', // 分配权限时的id
      defKey: [] // 默认选中的节点id值(就是会勾选已拥有的权限)
    }
  },
  methods: {
    addRoleUser () {
      this.addRolesModle = false
    },
    // 对话框关闭清空
    clearnDialog () {
      this.$refs.addFromRef.resetFields()
    },
    // 获取数据列表
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.rolesList = res.data
      console.log(res.data)
    },
    // 编辑
    editRoles () {},
    // 删除
    removeRoles () {},
    // 删除权限
    async deleteRole (roles, rights) {
      const del = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (del !== 'confirm') {
        return this.$message.warning('删除已取消')
      }
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${rights}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      // this.getRolesList() 会触发全局刷新
      roles.children = res.data // 直接更改成为最新数据不会触发全局刷新
      console.log(res)
    },

    // 权限分配区域
    // 外部定义方法,通过递归获取角色的默认权限勾选状态
    getLavfKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      // 执行到这里说明不是最后一层节点，则递归再次执行
      node.children.forEach(item => {
        this.getLavfKeys(item, arr)
      })
    },
    async openRoles (roles) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.setRights = res.data
      console.log(this.setRights)

      // 递归获取三级节点的id存放到权限数组中
      this.getLavfKeys(roles, this.defKey)
      this.roleId = roles.id // 保存对应id给分配权限使用
      this.rolesVisible = true
    },
    // 监听关闭清空权限数组
    resetRoles () {
      this.defKey = []
    },
    // 发送选中权限分配
    async allRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getCheckedNodes()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('权限分配失败')
      }
      this.$message.success('权限分配成功')
      this.getRolesList() // 刷新数据列表
      this.rolesVisible = false
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
 .el-tag {
  margin: 7px;
}
 .bdtop {
  border-top: 1px solid #eee;
 }
 .bdbottom {
  border-bottom: 1px solid #eee;
 }
 //  纵项对齐样式
 .vcenter {
  display: flex;
  align-items: center;
 }
</style>
