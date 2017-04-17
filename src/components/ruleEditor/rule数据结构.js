{

  "rule": {

    //规则名称
    "name": "测试规则1",

    //规则描述
    "description": "规则描述1",

    //执行安排（0:任意时间执行；1:周期性执行；2:固定时间段执行）
    "type": "0",

    //告警来源
    "time": {

      /*****固定时间段执行必填*****/
      "dayStart": "2017-03-25T17:15:00.000+08:00",
      "dayEnd": "2017-03-25T17:15:00.000+08:00",

      /*****周期性执行必填*****/
      //时间周期（0:每天；1:每周；2:每月）
      "timeCycle": "0",
      //时间周期为每周必填（0～6：周一～周日）
      "timeCycleWeek": "0,1,6",
      //时间周期为每月必填（0～30:1号～31号）
      "timeCycleMonth": "0,30",
      "timeStart": "12:15:00.000+08:00",
      "timeEnd": "12:15:00.000+08:00"
    },

    //告警来源
    "source": "Monitor",

    //匹配条件
    "condition": {
      "content": [{
        "key": "severity",
        "opt": ">",
        "value": "2"
      }],
      "child": [{
        "content": [{
          "key": "severity",
          "opt": ">",
          "value": "2"
        }],
        "child": [{
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
    },

    "actionId": "123456789"
  },
  //动作信息（负责任：赵乙伟）
  "action": {
    "tenant": "tenant_123456123",
    "actionDelOrClose": {
      "operation": 1,
      "type": 1
    },
    "actionNotification": {
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
      }],
      "notificationMode": {
        "notificationMode": [
          1,
          3
        ],
        "emailTitle": "emailTitle",
        "emailMessage": "emailmesage",
        "smsMessage": "smsMessage"
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
      "chatOpsRoomId": "chatanfakj32us232j",
      "type": 6
    },
    "actionSuppress": {
      "type": 5
    }
  }
}
