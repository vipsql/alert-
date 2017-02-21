import { request } from '../utils'
import querystring from 'querystring';

export async function queryAlertDashbord () {
  return request('/mock/app.json', {
    method: 'get'
  })
}

export async function login(userName) {
  
  return request(`/arbiter/rest/v1/alert/getUserId/${userName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}
