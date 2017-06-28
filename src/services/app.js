import { request } from '../utils'
import querystring from 'querystring';

export async function queryAlertDashbord () {
  return request('/mock/app.json', {
    method: 'get'
  })
}

export async function login(userName) {
  
  return request(`/incident/getUserId/${userName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export async function getUserInformation() {
  return request(`/dataService/getUserInfo`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 获取所有用户信息
export async function getUsers() {
  return request(`/common/getUsers`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}