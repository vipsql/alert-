import React, { Component } from 'react'
import styles from './index.less'
import request from '../../utils/request'
import { connect } from 'dva'
import { Spin } from 'antd'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/treemap')
var chartWidth = 1000;
var chartHeight = 1000;
var xscale = d3.scale.linear().range([0, chartWidth]);
var yscale = d3.scale.linear().range([0, chartHeight]);
var color = d3.scale.category10();
var headerHeight = 20;
var headerColor = "#000";
var transitionDuration = 500;
var root;
var node;

var treemap = d3.layout.treemap()
    .round(false)
    .size([chartWidth, chartHeight])
    .sticky(true)
    .value(function(d) {
        return d.size;
    });

var chart = d3.select("#tree")
    .append("svg:svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .append("svg:g")


d3.json("../../../mock/flare1.json", function(data) {
    node = root = data;
    var nodes = treemap.nodes(root);

    var children = nodes.filter(function(d) {
        return !d.children;
    });
    var parents = nodes.filter(function(d) {
        return d.children;
    });


    // create parent cells
    var parentCells = chart.selectAll("g.cell.parent")
        .data(parents, function(d) {
            return "p-" + d.name;
        });
    var parentEnterTransition = parentCells.enter()
        .append("g")
        .attr("class", "cell parent")
        .on("click", function(d) {
            zoom(d);
        })

        .append("svg")
        .attr("class", "clip")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight);
    parentEnterTransition.append("rect")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight)
        .style("fill", headerColor);
    parentEnterTransition.append('text')
        .attr("class", "label")
        .attr("transform", "translate(3, 13)")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight)
        .text(function(d) {
            return d.name;
        });
    // update transition
    var parentUpdateTransition = parentCells.transition().duration(transitionDuration);
    parentUpdateTransition.select(".cell")
        .attr("transform", function(d) {
            return "translate(" + d.dx + "," + d.y + ")";
        });
    parentUpdateTransition.select("rect")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight)
        .style("fill", headerColor);
    parentUpdateTransition.select(".label")
        .attr("transform", "translate(3, 13)")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight)
        .text(function(d) {
            return d.name;
        });
    // remove transition
    parentCells.exit()
        .remove();

    // create children cells
    var childrenCells = chart.selectAll("g.cell.child")
        .data(children, function(d) {
            return "c-" + d.name;
        });
    // enter transition
    var childEnterTransition = childrenCells.enter()
        .append("g")
        .attr("class", "cell child")
        .on("contextmenu", function(d,e) {
            zoom(node === d.parent ? root : d.parent);
            currentEvent.preventDefault()
        })
        .on("click", () => {
            // location.href = 'http://www.baidu.com'
        })

        .append("svg")
        .attr("class", "clip");
    childEnterTransition.append("rect")
        .classed("background", true)
        .style("fill", function(d) {
            return color(d.parent.name);
        });
    childEnterTransition.append('text')
        .attr("class", "label")
        .attr('x', function(d) {
            return d.dx / 2;
        })
        .attr('y', function(d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        // .style("display", "none")
        .text(function(d) {
            return d.name;
        });
    // update transition
    var childUpdateTransition = childrenCells.transition().duration(transitionDuration);
    childUpdateTransition.select(".cell")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    childUpdateTransition.select("rect")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", function(d) {
            return d.dy;
        })
        .style("fill", function(d) {
            return color(d.parent.name);
        });
    childUpdateTransition.select(".label")
        .attr('x', function(d) {
            return d.dx / 2;
        })
        .attr('y', function(d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        // .style("display", "none")
        .text(function(d) {
            return d.name;
        });

    // exit transition
    childrenCells.exit()
        .remove();



    zoom(node);
});


function size(d) {
    return d.size;
}


function count(d) {
    return 1;
}


//and another one
function textHeight(d) {
    var ky = chartHeight / d.dy;
    yscale.domain([d.y, d.y + d.dy]);
    return (ky * d.dy) / headerHeight;
}

function getRGBComponents(color) {
    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);
    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
}


function idealTextColor(bgColor) {
var nThreshold = 105;
var components = getRGBComponents(bgColor);
var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}


function zoom(d) {

treemap
    .padding([headerHeight / (chartHeight / d.dy), 0, 0, 0])
    .nodes(d);

// moving the next two lines above treemap layout messes up padding of zoom result
var kx = chartWidth / d.dx;
var ky = chartHeight / d.dy;
var level = d;

xscale.domain([d.x, d.x + d.dx]);
yscale.domain([d.y, d.y + d.dy]);

if (node != level) {
    chart.selectAll(".cell.child .label")
        // .style("display", "none");
}

var zoomTransition = chart.selectAll("g.cell").transition().duration(transitionDuration)
    .attr("transform", function(d) {
        return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")";
    })
    .each("start", function() {
        d3.select(this).select("label")
            .style("display", "none");
    })
    .each("end", function(d, i) {
        if (!i && (level !== self.root)) {
            chart.selectAll(".cell.child")
                .filter(function(d) {
                    return d.parent === self.node; // only get the children for selected group
                })
                .select(".label")
                .style("display", "")
                .style("fill", function(d) {
                    return idealTextColor(color(d.parent.name));
                });
        }
    });

zoomTransition.select(".clip")
    .attr("width", function(d) {
        return Math.max(0.01, (kx * d.dx));
    })
    .attr("height", function(d) {
        return d.children ? headerHeight : Math.max(0.01, (ky * d.dy));
    });

zoomTransition.select(".label")
    .attr("width", function(d) {
        return Math.max(0.01, (kx * d.dx));
    })
    .attr("height", function(d) {
        return d.children ? headerHeight : Math.max(0.01, (ky * d.dy));
    })
    .text(function(d) {
        return d.name;
    });

zoomTransition.select(".child .label")
    .attr("x", function(d) {
        return kx * d.dx / 2;
    })
    .attr("y", function(d) {
        return ky * d.dy / 2;
    });

zoomTransition.select("rect")
    .attr("width", function(d) {
        return Math.max(0.01, (kx * d.dx));
    })
    .attr("height", function(d) {
        return d.children ? headerHeight : Math.max(0.01, (ky * d.dy));
    })
    .style("fill", function(d) {
        return d.children ? headerColor : color(d.parent.name);
    });

node = d;

if (d3.event) {
    d3.event.stopPropagation();
}
}
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
                            gapWidth: 5,
                            borderColorSaturation: 0.85
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
                            gapWidth: 2,
                            borderColorSaturation: 0.85
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
