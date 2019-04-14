import Vue from 'vue'
import Router from 'vue-router'

// Layouts
import GuestHeader from './layouts/guest/Header'
import GuestWrapper from './layouts/guest/Wrapper'
import AuthSidebar from './layouts/auth/Sidebar'
import AuthHeader from './layouts/auth/Header'
import AuthWrapper from './layouts/auth/Wrapper'

// Views
import GuestHome from './views/guest/Home.vue'
import SubscriberHome from './views/auth/dashboards/Subscriber'

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
                  next({name: 'home'})
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
              }
          ]
      },
      {
          path: '/',
          component: AuthWrapper,
          children: [
              {
                  path: '/home',
                  name: 'home',
                  components: {
                      sidebar: AuthSidebar,
                      header: AuthHeader,
                      default: SubscriberHome
                  }
              }
          ]
      }
  ]
});
