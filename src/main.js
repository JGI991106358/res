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
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 设置请求根路径，并且将axios挂载到vue原型上
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
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
// 全局挂载使用弹框提示
Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
