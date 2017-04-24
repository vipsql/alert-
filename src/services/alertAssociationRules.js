import { request } from '../utils'
import {stringify} from 'qs'

// 查询配置规则列表
export async function queryRulesList(params) {
  return request(`/rule/queryRules?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 更改状态
export async function changeRuleStatus(params) {
  return request(`/rule/changeFlag?ruleId=${params}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 删除
export async function deleteRule(params) {
  return request(`/rule/deleteRule?ruleId=${params}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

export async function getUsers(params) {
  return request(`/rule/getUsers`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 单条查询
export async function viewRule(params) {
  return request(`/rule/queryRule?ruleId=${params}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

export async function createRule(params) {
  return request(`/rule/createRule`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
  })
}
