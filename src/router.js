import Vue from 'vue'
import Router from 'vue-router'

// Layouts
import GuestHeader from './layouts/guest/Header'
import GuestWrapper from './layouts/guest/Wrapper'
import AuthSidebar from './layouts/auth/Sidebar'
import AuthHeader from './layouts/auth/Header'
import AuthWrapper from './layouts/auth/Wrapper'

// Views
import GuestHome from './views/guest/Home'
import Login from './views/guest/Login'
import Register from './views/guest/Register'
import Activate from './views/guest/Activate'
import Forgot from './views/guest/Forgot'
import Reset from './views/guest/Reset'

import SubscriberHome from './views/auth/dashboards/Subscriber'
import AdministratorHome from './views/auth/dashboards/Administrator'
import UsersIndex from './views/auth/users/Index'
import UsersProfile from './views/auth/users/Profile'

import {store} from './store'

Vue.use(Router);

export const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/',
          component: GuestWrapper,
          beforeEnter: (to, from, next) => {
              if (store.state['is_logged_in']) {
                  let role = store.state['auth_object']['role'];
                  next({name: `${role}.home`})
              } else {
                  next()
              }
          },
          children: [
              {
                  path: '/',
                  name: 'landing',
                  components: {
                      header: GuestHeader,
                      default: GuestHome
                  }
              },
              {
                  path: '/login',
                  name: 'login',
                  components: {
                      header: GuestHeader,
                      default: Login
                  }
              },
              {
                  path: '/register',
                  name: 'register',
                  components: {
                      header: GuestHeader,
                      default: Register
                  }
              },
              {
                  path: '/activate/:code',
                  name: 'activate',
                  components: {
                      header: GuestHeader,
                      default: Activate
                  }
              },
              {
                  path: '/forgot',
                  name: 'forgot',
                  components: {
                      header: GuestHeader,
                      default: Forgot
                  }
              },
              {
                  path: '/reset/password/:token',
                  name: 'reset',
                  components: {
                      header: GuestHeader,
                      default: Reset
                  }
              }
          ]
      },
      {
          path: '/',
          component: AuthWrapper,
          children: [
              {
                  path: '/home',
                  name: 'subscriber.home',
                  components: {
                      sidebar: AuthSidebar,
                      header: AuthHeader,
                      default: SubscriberHome
                  },
                  meta: {auth: true, roles: ['subscriber']},
              },
              {
                  path: '/admin/home',
                  name: 'administrator.home',
                  components: {
                      sidebar: AuthSidebar,
                      header: AuthHeader,
                      default: AdministratorHome
                  },
                  meta: {auth: true, roles: ['administrator']}
              },
              {
                  path: '/users',
                  name: 'users.index',
                  components: {
                      sidebar: AuthSidebar,
                      header: AuthHeader,
                      default: UsersIndex
                  },
                  meta: {auth: true, roles: ['administrator']}
              },
              {
                  path: '/profile',
                  name: 'users.profile',
                  components: {
                      sidebar: AuthSidebar,
                      header: AuthHeader,
                      default: UsersProfile
                  },
                  meta: {auth: true, roles: ['administrator']}
              }
          ]
      }
  ]
});

router.beforeEach((to, from, next) => {
    let role = store.state['auth_object']['role'];

    if (!to.meta.auth) {
        return next()
    }

    if (!store.state['is_logged_in']) {
        return next({name: 'login'})
    }

    if (!to.meta.roles) {
        return next()
    }

    if (to.meta.roles.includes(role)) {
        return next()
    }

    next({name: 'denied'})
});
