var data = {
    "rule": {
        "name": "测试规则",
        "description": "测试描述",
        //目标告警（0：实时告警；1：历史告警）
        "target": 1,
        "type": 0,
        "time": {
            "dayStart": "2017-03-25T17:15+08:00",
            "dayEnd": "2017-03-25T17:15+08:00",
            "timeCycle": 0,
            "timeCycleWeek": "0,1,6",
            "timeCycleMonth": "0,30",
            "timeStart": "12:15+08:00",
            "timeEnd": "12:15+08:00"
        },
        "source": "Monitor",
        "condition": {
            "content": [{
                "key": "severity",
                "opt": ">",
                "value": "2"
            }],
            "complex": [{
                "content": [{
                    "key": "severity",
                    "opt": ">",
                    "value": "2"
                }],
                "complex": [{
                    "content": [{
                        "key": "severity",
                        "opt": ">",
                        "value": "2"
                    }, {
                        "key": "severity",
                        "opt": ">",
                        "value": "2"
                    }],
                    "logic": "and"
                }],
                "logic": "and"
            }],
            "logic": "and"
        }
    },
    "action": {
        "type": [2],
        "tenant": "tenant_123456123",
        "actionDelOrClose": {
            "operation": 1,
            "type": 1
        },
        "actionNotification": {
            notifyWhenLevelUp: true,
            "recipients": [{
                "userId": "12345132uiu895jsdfgnjs2309",
                "realName": "hahaha",
                "email": "zjap@uyunsoft.cn",
                "mobile": "1231244"
            }, {
                "userId": "12345132uiu895jsdfgnjs2309",
                "realName": "hahaha",
                "email": "zjap@uyunsoft.cn",
                "mobile": "1231244"
            }
            ],
            "notificationMode": {
                "notificationMode": [
                    1,
                    3
                ],
                "emailTitle": "emailTitle",
                "emailMessage": "emailmesage",
                "smsMessage": "smsMessage",
                "webNotification": {
                  "title":"title",
                  "message":"内容",
                  "playTimeType": "ONECE", // {string} ONECE --> 一次， TENSEC --> 10s，TIMEOUT --> 直到超时
                  "timeOut": 30, // (s)
                  "voiceType": "3" // {string} 3 --> 紧急， 2 --> 警告， 1 --> 提醒， 0 --> 恢复
                }
            },
            "type": 3
        },
        "actionITSM": {
            "itsmModelId": "changed",
            "param": {
                "cesjo": "cesj"
            },
            "type": 4
        },
        "actionChatOps": {
            notifyWhenLevelUp: true,
            "chatOpsRoomId": "chatanfakj32us232j",
            "type": 6
        },
        "actionSuppress": {
            "type": 5
        },
        //告警升级
        "actionUpgrade": {
            "notificationGroupings": [{
                "delay": 15,
                "status": [
                    190,
                    255
                ],
                "recipients": [{
                    "userId": "xxx",
                    "realName": "xxx",
                    "email": "xxx",
                    "mobile": "xxx"
                }]
            }],
            "notificationMode": {
                "notificationMode": [1],
                "emailTitle": "xxx",
                "emailMessage": "xxx",
                "smsMessage": "xxx"
            }
        }
    }
}
realParam: {
  executors: {
    '6f26ac36ba0c4af89cf667655e9802b1': []
  },
  form: {
    importance: "",
    ticketDesc: "${description}",
    title: "${alias}",
    urgency: ""
  }
}