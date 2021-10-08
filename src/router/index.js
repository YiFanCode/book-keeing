import Home from '@/container/Home'
import Detail from '@/container/Detail'
import Data from '@/container/Data'
import User from '@/container/User'
import Login from '@/container/Login'
import UserInfo from '@/container/UserInfo'
import Account from '@/container/Account'
import About from '@/container/About'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: "/detail",
    component: Detail
  },
  {
    path: '/data',
    component: Data
  },
  {
    path: '/user',
    component: User
  },
  {
    path: '/userinfo',
    component: UserInfo
  },
  {
    path: '/account',
    component: Account
  },
  {
    path: '/about',
    component: About
  },
  {
    path: "/login",
    component: Login
  }
]

export default routes