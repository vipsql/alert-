import { request } from '../utils'

export async function queryAlertManage() {
  return request('/mock/app.json', {
    method: 'get'
  })
}

export async function tagsView() {
  return {
    data: [
      {
        name: '告警来源',
        key: 1,
        tags: [
          {
            key: 1,
            name: "cmdb",
            selected: false
          },
          {
            key: 2,
            name: "apm",
            selected: false
          },
          {
            key: 3,
            name: "zabbx",
            selected: false
          }
        ]
      },
      {
        name: '告警通知',
        key: 2,
        tags: [
          {
            key: 4,
            name: "crud",
            selected: false
          },
          {
            key: 5,
            name: "asd",
            selected: false
          },
          {
            key: 6,
            name: "yuhh",
            selected: false
          },
          {
            key: 7,
            name: "hbghh",
            selected: false
          },
          {
            key: 8,
            name: "ljujjhghgf",
            selected: false
          },
          {
            key: 9,
            name: "erddcc",
            selected: false
          },
          {
            key: 10,
            name: "wwecxvv",
            selected: false
          }
        ]
      }
    ]
  }
}

