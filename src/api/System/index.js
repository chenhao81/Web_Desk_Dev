import request from '@/utils/request'

// 服务器时间
export function getServiceTime() {
  return request({
    url: '/sys/gettime',
    method: 'post'
  })
}

// 服务器时间设置
export function postServiceTimeSet() {
  return request({
    url: '/sys/settime',
    method: 'post'
  })
}

// 离线登录次数
export function postOfflineLimitSet(query) {
  return request({
    url: '/sys/set_offline_limit',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 全局外设策略
export function postGlobalUsb(query) {
  return request({
    url: '/sys/set_global_usb',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 获取授权状态
export function getAuthStatus() {
  return request({
    url: '/sys/status',
    method: 'post'
  })
}

// 获取授权码
export function getAuthRequestCode() {
  return request({
    url: '/sys/get_request_code',
    method: 'post'
  })
}

// 授权
export function postAuthCode() {
  return request({
    url: '/sys/license',
    method: 'post'
  })
}
