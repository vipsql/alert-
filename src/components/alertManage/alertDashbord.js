import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import request from '../../utils/request'
import { connect } from 'dva'
import { Spin } from 'antd';

const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/treemap')

class Chart extends Component{

    constructor(props) {
        super(props);
        this.setTreemapHeight = this.setTreemapHeight.bind(this);
    }
    setTreemapHeight(ele){
        // const _percent = 0.85 // 占屏比

        const clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        ele.style.height = (clientHeight - 130) + 'px';

    }

    componentDidUpdate(){
        const formatUtil = echarts.format;

        // 修改数据结构->指定区域快的颜色
        const severityToColor = {
            '10':  '#10cc10',//提醒
            '20':  '#ffdd00',//警告
            '30':  'orange',//次要
            '40':  '#f57268',//主要
            '50':  'red'//紧急
        }

        const  treemapList = this.props.currentDashbordData && this.props.currentDashbordData.map( item => {
            if(item.children){
            item.children.map( childItem => {
                let itemStyle = {}
                itemStyle['normal'] = {}
                itemStyle.normal.color = severityToColor[childItem['maxSeverity']]
                childItem['itemStyle'] = itemStyle
                return childItem
            })
            }
            return item
        } )

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
                            // color:'green',
                            position: 'insideTopLeft'
                        }
                    },
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
                    roam: true,
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
                    data: treemapList
                }
            ]
        }
        this.myChart.setOption(option);

        this.myChart.resize();
    }
    componentDidMount(){
        const treeMapNode = document.getElementById('treemap');
        this.setTreemapHeight(treeMapNode);

        this.myChart = echarts.init(treeMapNode);

        setInterval( () =>{
            // var data = {"message":"热图查询成功","data":{"totalCriticalCnt":33,"totalMajorCnt":29,"totalInfoCnt":24,"totalMinorCnt":13,"totalWarnCnt":22,"picList":[{"name":"资源类型名称","value":19,"path":"entityTypeName","children":[{"name":"光缆","path":"entityTypeName\/guanglan","value":9,"maxSeverity":50},{"name":"计算机","path":"entityTypeName\/jisuanji","value":10,"maxSeverity":50}]},{"name":"告警级别","value":102,"path":"severity","children":[{"name":"紧急","path":"severity\/jinji","value":27,"maxSeverity":50},{"name":"警告","path":"severity\/jinggu","value":19,"maxSeverity":20},{"name":"次要","path":"severity\/ciyao","value":13,"maxSeverity":30},{"name":"主要","path":"severity\/zhuyao","value":22,"maxSeverity":40},{"name":"提醒","path":"severity\/dixing","value":21,"maxSeverity":10}]}]},"result":true}
            // .data.picList
            // this.myChart.setOption({
            //     series: [{
            //         data: data
            //     }]
            // });
            this.props.requestFresh()
        }, 60000);

    }

    render(){
        return (
            <div className={styles.loadingWrap}>
                <Spin tip="加载中..." spinning= {this.props.isLoading}>
                    <div id="treemap" className={styles.treemap}></div>
                    {(Array.isArray(this.props.currentDashbordData) && this.props.currentDashbordData.length < 1) && <div className={styles.alertNoData}>告警看板暂无数据</div>}
                </Spin>
            </div>
        )
    }

}
export default Chart
