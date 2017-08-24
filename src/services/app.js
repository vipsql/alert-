import { request } from '../utils'
import {stringify} from 'qs'

export async function getUserInformation() {
  return request(`/dataService/getUserInfo`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 获取所有用户信息
export async function getUsers(params) {
  return request(`/common/getUsers?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// web notification
export async function getWebNotification(params) {
  return request(`/common/getWebNotification?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}