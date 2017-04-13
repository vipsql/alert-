import { request } from '../utils'
import {stringify} from 'qs'

// 查询配置规则列表
export async function queryRulesList(params) {
  return request(`/application/query?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}