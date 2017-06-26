import { request, packURL } from '../utils'
import {stringify} from 'qs'

export async function isSetUserTags() {
    return request(`/incident/tags/isSet`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    // return Promise.resolve({
    //   result: true,
    //   data: true
    // })
}

export async function getTagsByUser() {
    return request(`/incident/tags/chosen`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function setUserTags(tagObject) {
    return request(`/incident/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagObject)
    })
}

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
