import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import request from '../../utils/request'

const echarts = require('echarts');
const data = [
    {
        "value": 26, // 区域总告警数
        "name": "position", //区域名称
        "path": "position", // 当前路径
        "children": [ // 区域子告警
            {
                "value": 12,
                "name": "a",
                "path": "position/a"
            },
            {
                "value": 28,
                "name": "b",
                "path": "position/b"
            },
            {
                "value": 20,
                "name": "c",
                "path": "Accountsposition/c"
            },
            {
                "value": 16,
                "name": "d",
                "path": "position/d"
            }
        ]
    },
    {
        "value": 12,
        "name": "people",
        "path": "people",
        "children": [
            {
                "value": 24,
                "name": "a",
                "path": "people/a"
            },
            {
                "value": 16,
                "name": "c",
                "path": "people/c"
            },
            {
                "value": 20,
                "name": "d",
                "path": "people/d"
            },
            {
                "value": 16,
                "name": "e",
                "path": "people/e"
            },
            {
                "value": 16,
                "name": "f",
                "path": "people/f"
            }
        ]
    },
    {
        "value": 12,
        "name": "classify",
        "path": "classify",
        "children": [
            {
                "value": 12,
                "name": "a",
                "path": "classify/a"
            }
        ]
    }
]
class Chart extends Component{
  setTreemapHeight(ele){
    const clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    ele.style.height = clientHeight + 'px';

  }
  render(){
    return (
      <div id="treemap" className={styles.treemap}></div>
    )
  }
  componentDidMount(){
    const treeMapNode = document.getElementById('treemap');
    this.setTreemapHeight(treeMapNode);

    const myChart = echarts.init(treeMapNode);
    var formatUtil = echarts.format;

    function getLevelOption() {
      return [
          {
              itemStyle: {
                  normal: {
                      borderWidth: 0,
                      gapWidth: 5
                  }
              },
              label:{
                   normal:{
                       show: true,
                       color:'green',
                       position: 'insideTopLeft'
                   }
               }
          },
          {
              itemStyle: {
                  normal: {
                      gapWidth: 0
                  }
              }
          },
          {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                  normal: {
                      gapWidth: 1,
                      borderColorSaturation: 0.6
                  }
              }
          }
      ];
    }
    let option = {
        tooltip: {
            formatter: function (info) {
                var value = info.value;
                var treePathInfo = info.treePathInfo;
                var treePath = [];

                for (var i = 1; i < treePathInfo.length; i++) {
                    treePath.push(treePathInfo[i].name);
                }

                return [
                    '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                    '告警数: ' + formatUtil.addCommas(value),
                ].join('');
            }
        },
        series: [
            {
                name:'告警数',
                type:'treemap',
                left:0,
                top:0,
                width:'100%',
                height: '100%',
                visibleMin: 300,
                roam: 'zoom',
                nodeClick: 'hash',
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    color: 'green'
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff'
                    }
                },
                breadcrumb: {
                  show: false
                },
                levels: getLevelOption(),
                data: data
            }
        ]
    }
    myChart.setOption(option);


  }

}

export default Chart
