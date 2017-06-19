import { request } from '../utils'

export async function queryDashbord(parmas) {
//   return request(`/incident/getLastOneHourIncidentData`, {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(parmas)
//   })

    return Promise.resolve({ "result": true, "data": { "totalCriticalCnt": 0, "totalWarnCnt": 0, "picList": [{ "path": "jiedao", "children": [{ "path": "jiedao/xihulu8hao", "name": "西湖路8号", "value": 0, "maxSeverity": -1 }, { "path": "jiedao/xihulu6hao", "name": "西湖路6号", "value": 0, "maxSeverity": -1 }, { "path": "jiedao/xihulu5hao", "name": "西湖路5号", "value": 0, "maxSeverity": -1 }, { "path": "jiedao/jiedao7", "name": "街道7", "value": 0, "maxSeverity": -1 }, { "path": "jiedao/chunanlu12hao", "name": "淳安路12号", "value": 0, "maxSeverity": -1 }, { "path": "jiedao/fuyanglu9hao", "name": "富阳路9号", "value": 0, "maxSeverity": -1 }], "name": "街道", "value": 0 }, { "path": "xitongming", "children": [{ "path": "xitongming/IVS", "name": "IVS", "value": 0, "maxSeverity": -1 }, { "path": "xitongming/ITS", "name": "ITS", "value": 0, "maxSeverity": -1 }, { "path": "xitongming/CAD9", "name": "CAD9", "value": 0, "maxSeverity": -1 }, { "path": "xitongming/CAD8", "name": "CAD8", "value": 0, "maxSeverity": -1 }, { "path": "xitongming/CAD7", "name": "CAD7", "value": 0, "maxSeverity": -1 }, { "path": "xitongming/CAD3", "name": "CAD3", "value": 0, "maxSeverity": -1 }, { "path": "xitongming/CAD", "name": "CAD", "value": 0, "maxSeverity": -1 }], "name": "系统名", "value": 0 }, { "path": "severity", "children": [{ "path": "severity/3", "name": "3", "value": 0, "maxSeverity": -1 }, { "path": "severity/2", "name": "2", "value": 0, "maxSeverity": -1 }, { "path": "severity/1", "name": "1", "value": 0, "maxSeverity": -1 }, { "path": "severity/0", "name": "0", "value": 0, "maxSeverity": -1 }], "name": "等级", "value": 0 }, { "path": "zhandian", "children": [{ "path": "zhandian/xihuzhandian7", "name": "西湖站点7", "value": 0, "maxSeverity": -1 }, { "path": "zhandian/zhandian54", "name": "站点54", "value": 0, "maxSeverity": -1 }, { "path": "zhandian/zhandian189", "name": "站点189", "value": 0, "maxSeverity": -1 }, { "path": "zhandian/zhandian181", "name": "站点181", "value": 0, "maxSeverity": -1 }, { "path": "zhandian/zhandian150", "name": "站点150", "value": 0, "maxSeverity": -1 }, { "path": "zhandian/zhandian132", "name": "站点132", "value": 0, "maxSeverity": -1 }, { "path": "zhandian/zhandian115", "name": "站点115", "value": 0, "maxSeverity": -1 }, { "path": "zhandian/huaxinglugucuilulukou", "name": "华星路古翠路路口", "value": 0, "maxSeverity": -1 }], "name": "站点", "value": 0 }, { "path": "paichusuo", "children": [{ "path": "paichusuo/xihupachusuo", "name": "西湖派出所", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/xichengpachusuo", "name": "西城派出所", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/pachusuo87", "name": "派出所87", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo280", "name": "派出所280", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo236", "name": "派出所236", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo232", "name": "派出所232", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/pachusuo18", "name": "派出所18", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo178", "name": "派出所178", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/pachusuo17", "name": "派出所17", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo168", "name": "派出所168", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo158", "name": "派出所158", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/pachusuo138", "name": "派出所138", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo128", "name": "派出所128", "value": 0, "maxSeverity": -1 }, { "path": "paichusuo/paichusuo118", "name": "派出所118", "value": 0, "maxSeverity": -1 }], "name": "派出所", "value": 0 }, { "path": "source", "children": [{ "path": "source/shipinjiankongbaojing", "name": "视频监控报警", "value": 0, "maxSeverity": -1 }, { "path": "source/jichuziyuanjiankong", "name": "基础资源监控", "value": 0, "maxSeverity": -1 }, 
    { "path": "source/R8TrapTest", "name": "R8TrapTest1111111111111122", "value": 0, "maxSeverity": -1 },
    { "path": "source/R8TrapTest1", "name": "R8TrapTest1", "value": 0, "maxSeverity": -1 }
    ], "name": "来源", "value": 0 }, { "path": "shujuzhongxin", "children": [{ "path": "shujuzhongxin/xihupachusuo", "name": "西湖派出所", "value": 0, "maxSeverity": -1 }, { "path": "shujuzhongxin/hangzhoushujuzhongxin", "name": "杭州数据中心", "value": 0, "maxSeverity": -1 }, 
    { "path": "shujuzhongxin/shanghaishujuzhongxin", "name": "上海数据中心", "value": 0, "maxSeverity": -1 },
     { "path": "shujuzhongxin/shanghaishujuzhongxin1", "name": "上海数据中心1", "value": 0, "maxSeverity": -1 },
      { "path": "shujuzhongxin/shanghaishujuzhongxin2", "name": "上海数据中心2", "value": 0, "maxSeverity": -1 }
    ], "name": "数据中心", "value": 0 }, { "path": "cengci", "children": [{ "path": "cengci/chunangongwangdian", "name": "淳安供网点", "value": 0, "maxSeverity": -1 }, { "path": "cengci/tonglugongwangdian", "name": "桐庐供网点", "value": 0, "maxSeverity": -1 }, { "path": "cengci/shujuceng", "name": "数据层", "value": 0, "maxSeverity": -1 }, { "path": "cengci/cengci8", "name": "层次8", "value": 0, "maxSeverity": -1 }, { "path": "cengci/cunchuceng", "name": "存储层", "value": 0, "maxSeverity": -1 }, { "path": "cengci/xiachenggongwangdian", "name": "下城供网点", "value": 0, "maxSeverity": -1 }], "name": "层次", "value": 0 }, { "path": "gongwangdian", "children": [{ "path": "gongwangdian/gongwangdian1", "name": "�供网点1", "value": 0, "maxSeverity": -1 }, { "path": "gongwangdian/binjianggongwangdian", "name": "滨江供网点", "value": 0, "maxSeverity": -1 }, { "path": "gongwangdian/jianggangongwangdian", "name": "江干供网点", "value": 0, "maxSeverity": -1 }, { "path": "gongwangdian/jiandegongwangdian", "name": "建德供网点", "value": 0, "maxSeverity": -1 }, { "path": "gongwangdian/gongwangdian8", "name": "供网点8", "value": 0, "maxSeverity": -1 }], "name": "供网点", "value": 0 }, { "path": "gongdiandian", "children": [{ "path": "gongdiandian/xihugongdiandian8", "name": "西湖供电点8", "value": 0, "maxSeverity": -1 }, { "path": "gongdiandian/gongdiandian6", "name": "供电点6", "value": 0, "maxSeverity": -1 }, { "path": "gongdiandian/gongdiandian56", "name": "供电点56", "value": 0, "maxSeverity": -1 }, { "path": "gongdiandian/gongdiandian1", "name": "供电点1", "value": 0, "maxSeverity": -1 }, { "path": "gongdiandian/shangchenggongwangdian", "name": "上城供网点", "value": 0, "maxSeverity": -1 }], "name": "供电点", "value": 0 }, { "path": "key", "children": [{ "path": "key/shijj", "name": "shijj", "value": 0, "maxSeverity": -1 }], "name": "key", "value": 0 }, { "path": "Street", "children": [{ "path": "Street/chunanlu12hao", "name": "淳安路12号", "value": 0, "maxSeverity": -1 }, { "path": "Street/tonglulu11hao", "name": "桐庐路11号", "value": 0, "maxSeverity": -1 }, { "path": "Street/gongshulu5hao", "name": "拱墅路5号", "value": 0, "maxSeverity": -1 }, { "path": "Street/jiandelu10hao", "name": "建德路10号", "value": 0, "maxSeverity": -1 }], "name": "Street", "value": 0 }], "totalOkCnt": 0, "totalInfoCnt": 0 } })
}
