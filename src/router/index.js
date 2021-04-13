import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users/users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/',redirect: '/login'},
  { path: '/login', component: login},
  //当访问到home路由时，会被重定向到子路由welocme上面
  { path: '/home',
   component: Home,
   redirect: '/welcome', 
       children:[{
         path: '/welcome',
         component: welcome
        },
        {
          path: '/users',
          component: users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
      ]
  }
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//这就是路由导航，长见识了
//to从哪里来
//from到哪去(这里还没有用到)
//next放行
router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next() 
})

export default router
