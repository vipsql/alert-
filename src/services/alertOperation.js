import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function getFormOptions() {
    // let hostUrl = 'itsm.uyun.cn';

    // if (window.location.origin.indexOf("alert") > -1) {
    //     // 域名访问
    //     hostUrl = window.location.origin.replace(/alert/, 'itsm');

    // } else {
    //     // 顶级域名/Ip访问
    //     hostUrl = window.location.origin + '/itsm'
    // }
    // console.log(hostUrl)
    return request(`/dataService/wos`,  {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getChatOpsOptions() {
    // let hostUrl = 'alert.uyundev.cn';
    // let param = {};
    // let userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'));

    // if (window.location.origin.indexOf("alert") > -1) {
    //     // 域名访问
    //     hostUrl = window.location.origin.replace(/alert/, 'chatops');
    // } else {
    //     // 顶级域名/Ip访问
    //     hostUrl = window.location.origin
    // }
    // param = {
    //     url: `${hostUrl}/chatops/api/v2/chat/teams/%s/rooms`
    // }
    // console.log(hostUrl)
    const chatopsUrl = await request(`/dataService/rooms`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (chatopsUrl.result) {
        return request(`${chatopsUrl.data.url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } else {
        return chatopsUrl
    }
}

export async function shareRoom(roomId, incidentId, roomName, param) {
    // let hostUrl = 'alert.uyundev.cn';
    // let paramWrapper = {};
    // if (window.location.origin.indexOf("alert") > -1) {
    //     // 域名访问
    //     hostUrl = window.location.origin.replace(/alert/, 'chatops');

    // } else {
    //     // 顶级域名/Ip访问
    //     hostUrl = window.location.origin
    // }
    let paramWrapper = {
        roomId: '' + roomId,
        incidentId: incidentId,
        roomName: roomName,
        body: JSON.stringify(param)
    }

    return request(`/dataService/sendChatOps`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paramWrapper)
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

export async function resolve(param) {
    return request(`/incident/resolve`, {
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

// 修改工单流水号
export async function changeTicket(params) {
    return request(`/incident/updateFlowNo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
}

// 工单详情URL
export async function viewTicket(code) {
    return request(`/incident/getITSMDetailUrl?orderFlowNum=${code}`,  {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
