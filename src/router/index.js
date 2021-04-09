import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/',redirect: '/login'},
  {path: '/login', component: login},
  {path: '/home', component: Home}
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
