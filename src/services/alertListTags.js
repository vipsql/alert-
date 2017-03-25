import { request } from '../utils'

export async function getAllListTags() {
    return request(`/incident/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}