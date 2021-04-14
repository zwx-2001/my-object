import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import './assets/icons/iconfont.css';
import './assets/icons/iconfont';
import './assets/css/global.css';
Vue.config.productionTip = false
Vue.prototype.$http = axios
//引入项目依赖
import TableTree from 'vue-table-with-tree-grid'
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
//当访问需要权限的api时，需要用到axios劫持，对数据进行处理
//在请求头加上Authorization属性，可以对有权限的api进行访问
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器

Vue.use(ElementUI)
Vue.component('tree-table',TableTree)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
