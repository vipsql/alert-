import { request } from '../utils'

export async function getAllListTags() {
    return request(`/api/v2/incident/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}