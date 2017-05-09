import { request } from '../utils'
import {stringify} from 'qs'

// 查询所有的Tags的Key
export async function getAllTagsKey() {
    return request(`/incident/tags/allKeys`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getTagValues(param) {
    return request(`/incident/tags/getTagValues?${stringify(param)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}