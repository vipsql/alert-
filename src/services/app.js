import { request } from '../utils'
import {stringify} from 'qs'

export async function queryAlertDashbord () {
  return request('/mock/app.json', {
    method: 'get'
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

// web notification
export async function getWebNotification(params) {
  return request(`/common/getWebNotification?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
  // return Promise.resolve({
  //   result: true,
  //   data: [
      // {"title": "这是一个标签", "message": "这是一个标签的message", "playTimeType": 'ONCE', "timeOut": 2, "voiceType": "3"},
      // {"title": "这是二个标签", "message": "这是二个标签的message", "playTimeType": 'TENSEC', "timeOut": 2, "voiceType": "2"},
      // {"title": "这是三个标签", "message": "这是三个标签的message", "playTimeType": 'TIMEOUT', "timeOut": 2, "voiceType": "1"},
      // {"title": "这是一个标签", "message": "这是一个标签的message", "playTimeType": 'ONCE', "timeOut": 2, "voiceType": "3"},
      // {"title": "这是二个标签", "message": "这是二个标签的message", "playTimeType": 'TENSEC', "timeOut": 2, "voiceType": "2"},
      // {"title": "这是三个标签", "message": "这是三个标签的message", "playTimeType": 'TIMEOUT', "timeOut": 2, "voiceType": "1"},
      // {"title": "这是一个标签", "message": "这是一个标签的message", "playTimeType": 'ONCE', "timeOut": 2, "voiceType": "3"},
      // {"title": "这是二个标签", "message": "这是二个标签的message", "playTimeType": 'TENSEC', "timeOut": 2, "voiceType": "2"},
      // {"title": "这是三个标签", "message": "这是三个标签的message", "playTimeType": 'TIMEOUT', "timeOut": 2, "voiceType": "1"},
      // {"title": "这是一个标签", "message": "这是一个标签的message", "playTimeType": 'ONCE', "timeOut": 2, "voiceType": "3"},
  //   ]
  // })
}