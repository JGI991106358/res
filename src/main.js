import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入样式文件不能省略后面的文件后缀 .css
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/grlobal.css'
import '@/assets/fonts/iconfont.css'
// 按需引入
import { Button, Form, FormItem, Input, Message, MessageBox, Pagination, Tooltip, Dialog, Container, Header, Switch, Table, TableColumn, Aside, Main, Row, Col, Card, Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem } from 'element-ui'

// 设置请求根路径，并且将axios挂载到vue原型上
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 全局注册ui组件
/*
当需要自定义标签名称的全局注册方式
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)...
 */
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

// 全局挂载使用弹框提示
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
