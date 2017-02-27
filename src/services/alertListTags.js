import { request } from '../utils'

export async function getAllListTags() {
    return request(`/arbiter/rest/v1/alert/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}