import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true }
]
export const asyncRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/images',
    component: Layout,
    redirect: '/images/images',
    children: [{
      path: 'images',
      component: _import('images/index'),
      name: 'images',
      meta: { title: 'images', icon: 'images', noCache: true }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    children: [{
      path: 'user',
      component: _import('user/index'),
      name: 'user',
      meta: { title: 'user', icon: 'people', noCache: true }
    }]
  },
  {
    path: '/cloud',
    redirect: '/user/user',
    component: Layout,
    children: [{
      path: 'cloud',
      component: _import('cloud/index'),
      name: 'cloud',
      meta: { title: 'cloud', icon: 'cloud', noCache: true }
    }]
  },
  {
    path: '/terminal',
    redirect: '/terminal/terminal',
    component: Layout,
    children: [{
      path: 'terminal',
      component: _import('terminal/index'),
      name: 'terminal',
      meta: { title: 'terminal', icon: 'terminal', noCache: true }
    }]
  },
  {
    path: '/systems',
    component: Layout,
    redirect: 'noredirect',
    name: 'systems',
    meta: {
      icon: 'set',
      title: 'systems'
    },
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: _import('systems/setting/setting'),
        meta: { title: 'setting', noCache: true, icon: 'gongju' }
      },
      {
        path: 'peripheral',
        name: 'peripheral',
        component: _import('systems/peripheral/peripheral'),
        meta: { title: 'peripheral', noCache: true, icon: 'document' }
      },
      {
        path: 'auth',
        name: 'auth',
        component: _import('systems/auth/auth'),
        meta: { title: 'auth', noCache: true, icon: 'auth' }
      }
    ]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: _import('svg-icons/index'),
  //     name: 'icons',
  //     meta: { title: 'icons', icon: 'icon', noCache: true }
  //   }]
  // },
  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'component',
  //   meta: {
  //     title: 'components',
  //     icon: 'component'
  //   },
  //   children: [
  //     {
  //       path: 'tinymce', component: _import('components/tinymce'), name: 'tinymce-demo',
  //       meta: { title: 'tinymce' }
  //     },
  //     {
  //       path: 'markdown', component: _import('components/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }
  //     },
  //     {
  //       path: 'json-editor', component: _import('components/jsonEditor'), name: 'jsonEditor-demo',
  //       meta: { title: 'jsonEditor' }
  //     },
  //     {
  //       path: 'splitpane', component: _import('components/splitpane'), name: 'splitpane-demo',
  //       meta: { title: 'splitPane' }
  //     },
  //     {
  //       path: 'avatar-upload', component: _import('components/avatarUpload'), name: 'avatarUpload-demo',
  //       meta: { title: 'avatarUpload' }
  //     },
  //     {
  //       path: 'dropzone', component: _import('components/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }
  //     },
  //     {
  //       path: 'sticky', component: _import('components/sticky'), name: 'sticky-demo',
  //       meta: { title: 'sticky' }
  //     },
  //     {
  //       path: 'count-to', component: _import('components/countTo'), name: 'countTo-demo',
  //       meta: { title: 'countTo' }
  //     },
  //     {
  //       path: 'mixin', component: _import('components/mixin'), name: 'componentMixin-demo',
  //       meta: { title: 'componentMixin' }
  //     },
  //     {
  //       path: 'back-to-top', component: _import('components/backToTop'), name: 'backToTop-demo',
  //       meta: { title: 'backToTop' }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]
export default new Router({
  // mode: 'history', // 需要服务器端支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(generateRoutesFromPermission(asyncRouterMap))
})

function generateRoutesFromPermission(menus = []) {
  store.dispatch('GenerateRoutes', menus)
  return menus
}
