import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import request from '../../utils/request'

const echarts = require('echarts');

class Chart extends Component{
    
    constructor(props) {
        super(props);
        this.setTreemapHeight = this.setTreemapHeight.bind(this);
    }
    setTreemapHeight(ele){
        const _percent = 0.8 // 占屏比

        const clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        ele.style.height = (clientHeight * _percent) + 'px';

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
                    data: this.props.currentDashbordData
                }
            ]
        }
        myChart.setOption(option);


    }

    render(){
        return (
            <div id="treemap" className={styles.treemap}></div>
        )
    }

}

export default Chart
