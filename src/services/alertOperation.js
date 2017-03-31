import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function getFormOptions() {
    let hostUrl = 'itsm.uyundev.cn';
    let userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
    
    if (window.location.host.indexOf("alert") > -1) {
        // 域名访问
        hostUrl = window.location.host.replace(/alert/, 'itsm');

    } else {
        // 顶级域名/Ip访问
        hostUrl = window.location.host + '/itsm'
    }
    console.log(hostUrl)
    return request(`${hostUrl}/api/v2/chat/models/query?user_id=${userInfo.userId}&tenant_id=${userInfo.tenantId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getChatOpsOptions() {
    let hostUrl = 'alert.uyundev.cn';
    let userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
    
    if (window.location.host.indexOf("alert") > -1) {
        // 域名访问
        hostUrl = window.location.host.replace(/alert/, 'chatops');

    } else {
        // 顶级域名/Ip访问
        hostUrl = window.location.host
    }
    console.log(hostUrl)
    return request(`${hostUrl}/chatops/api/v2/chat/teams/${userInfo.tenantId}/rooms`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function shareRoom(roomId, source, userId, param) {
    let hostUrl = 'alert.uyundev.cn';

    if (window.location.host.indexOf("alert") > -1) {
        // 域名访问
        hostUrl = window.location.host.replace(/alert/, 'chatops');

    } else {
        // 顶级域名/Ip访问
        hostUrl = window.location.host
    }
    console.log(hostUrl)
    return request(`${hostUrl}/serviceapi/v2/robot/messages/send?roomId=${roomId}&source=${source}&userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function dispatchForm(param) {
    return request(`/dataService/assignWO`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function close(param) {
    return request(`/incident/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function merge(param) {
    return request(`/incident/merge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function relieve(param) {
    return request(`/incident/decompose`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}