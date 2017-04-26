import React, { Component } from 'react'
import styles from './index.less'
import { Spin } from 'antd'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Tip from './d3Tip'
const d3Tip = new Tip

const formatMessages = defineMessages({
    noData:{
      id: 'alertManage.noData',
      defaultMessage: '告警看板暂无数据，请先设置关注数据',
    }
})

class Chart extends Component{

    constructor(props) {
        super(props)
        this.setTreemapHeight = this.setTreemapHeight.bind(this);
        this.timer = null // 定时器
    }
    setTreemapHeight(ele){
        // const _percent = 0.85 // 占屏比
        const clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
        ele.style.height = (clientHeight - 130) + 'px'

    }
    shouldComponentUpdate(nextProps){
      return this.props.currentDashbordData !== nextProps.currentDashbordData
    }
    componentDidMount(){
        const self = this;
        const severityToColor = {
            '0': '#a5f664', // 正常
            '1': '#fadc23', // 提醒
            '2': '#ff9524', // 警告
            '3': "#eb5a30" // 紧急
        }
        this.chartWidth = document.documentElement.clientWidth - 160 - 90;
        this.chartHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight) - 180;
        this.xscale = d3.scale.linear().range([0, this.chartWidth]);
        this.yscale = d3.scale.linear().range([0, this.chartHeight]);
        this.color = function(num){
            return severityToColor[num]
        };


        this.chart = d3.select("#treemap")
            .append("svg:svg")
            .attr("width", this.chartWidth)
            .attr("height", this.chartHeight)
            .append("svg:g")
        

        this.timer = setInterval( () =>{
            // var data = {"message":"热图查询成功","data":{"totalCriticalCnt":33,"totalMajorCnt":29,"totalInfoCnt":24,"totalMinorCnt":13,"totalWarnCnt":22,"picList":[{"name":"资源类型名称","value":19,"path":"entityTypeName","children":[{"name":"光缆","path":"entityTypeName\/guanglan","value":9,"maxSeverity":50},{"name":"计算机","path":"entityTypeName\/jisuanji","value":10,"maxSeverity":50}]},{"name":"告警级别","value":102,"path":"severity","children":[{"name":"紧急","path":"severity\/jinji","value":27,"maxSeverity":50},{"name":"警告","path":"severity\/jinggu","value":19,"maxSeverity":20},{"name":"次要","path":"severity\/ciyao","value":13,"maxSeverity":30},{"name":"主要","path":"severity\/zhuyao","value":22,"maxSeverity":40},{"name":"提醒","path":"severity\/dixing","value":21,"maxSeverity":10}]}]},"result":true}
            // .data.picList
            // this.myChart.setOption({
            //     series: [{
            //         data: data
            //     }]
            // })
            this.props.requestFresh()
        }, 60000)
    }
    componentDidUpdate(){
        if (this.props.isFold) {
            this.chartWidth = document.documentElement.clientWidth - 180;
        } else {
            this.chartWidth = document.documentElement.clientWidth - 160 - 90;
        }

        d3.select("#treemap")
            .select('svg')
            .attr("width", this.chartWidth)
        
        this.treemap = d3.layout.treemap()
          .round(false)
          .size([this.chartWidth, this.chartHeight])
          .sticky(true)
          .value(function(d) {
              return d.value;
          });
        var headerHeight = 40;
        var headerColor = "#0d3158";
        var transitionDuration = 500;
        var root;
        var node;

        if(this.props.currentDashbordData.length < 1) {
            d3.select("#treemap").select('svg').attr('height', 0)
            return
        }else{
            d3.select("#treemap").select('svg').attr('height', this.chartHeight)
        }

        let updateData = this.props.currentDashbordData
        updateData.forEach((item, index) => {            
            if(item.value == 0){item.noData = true}
                if(item.children){
                let hasZeros = 0
                    item.children.forEach((childItem) => {
                        if(childItem.value == 0){
                            childItem.value = 1
                        childItem.noData = true
                        hasZeros++
                        
                        }else{
                        
                    }
                    })
                item.value = hasZeros
                }
        })

        node = root = {
              path: 'root',
              children: updateData
            };

            var nodes = this.treemap.nodes(root);
            
            var children = nodes.filter(function(d) {
                return !d.children;
            });
            var parents = nodes.filter(function(d) {

                return d.children;
            });

        // d3.json("../../../mock/alert.json", function(data) {
        if(children.length > 0){
          
            // create parent cells
            var parentCells = this.chart.selectAll("g.cell.parent")
                .data(parents.slice(1), function(d) {
                    return "p-" + d.path;
                });

            var parentEnterTransition = parentCells.enter()
                .append("g")
                .attr("class", "cell parent")
                .on("click", d => {

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
                .attr('stroke','#163c67')
                .attr('stroke-width','4')
                .attr("height", headerHeight)
                .style("fill", headerColor);
            parentEnterTransition.append('text')
                .attr("class", "label")
                .attr("fill", "#6ac5fe")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return Math.max(0.01, d.dx/2);
                })
                .attr("y", "12")
                .attr("transform", "translate(3, 13)")
                .attr("width", function(d) {
                    return Math.max(0.01, d.dx);
                })
                .attr('font-size', '14')
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
                .attr("x", function(d) {
                    return Math.max(0.01, d.dx/2);
                })
                .attr("y", "10")
                .attr("height", headerHeight)
                .style("fill", headerColor);
            parentUpdateTransition.select(".label")
                .attr("transform", "translate(3, 13)")
                .attr("width", function(d) {
                    return Math.max(0.01, d.dx);
                })
                .attr('font-size', '20')
                .attr("height", 20)
                .text(function(d) {
                    return d.name;
                });
            // remove transition
            parentCells.exit()
                .remove();

            // create children cells
            var childrenCells = this.chart.selectAll("g.cell.child")
                .data(children, function(d) {
                    return "c-" + d.path;
                });
            // enter transition
            var childEnterTransition = childrenCells.enter()
                .append("g")
                .attr("class", "cell child")
                .on("contextmenu", (d, e) => {
                  zoom.call(this, node === d.parent ? root : d.parent);
                    currentEvent.preventDefault()
                  })
                .on("click", (d) => {
                    d3Tip.hide()
                    let alertListPath = {};
                    let keyValue = d.name;
                    let pathArr = d.path.split('/');
                    if ( pathArr !== undefined && pathArr[0] !== undefined && pathArr[1] !== undefined ) {
                        let temp = pathArr[0];
                        if ( pathArr[0] == 'severity' || pathArr[0] == 'status') {
                            alertListPath[temp] = pathArr[1];
                        } else {
                            alertListPath[temp] = keyValue;
                        }
                    }
                    alertListPath.severity = d.maxSeverity == 0
                                                ? '0' : d.maxSeverity == 1
                                                    ? '1,0' : d.maxSeverity == 2
                                                        ? '2,1,0' : d.maxSeverity == 3
                                                            ? '3,2,1,0' : '3,2,1,0'
                    localStorage.setItem('alertListPath', JSON.stringify(alertListPath));
                    window.location.hash = "#/alertManage/" + d.path;
                })
                
                // .on('mouseout', tip.hide)

                .append("svg")
                .attr("class", "clip")
                
            childEnterTransition.append("rect")
                .classed("background", true)
                // .attr('filter',"url(#inset-shadow)")
                .attr('stroke','#163c67')
                .attr('stroke-width','2')
                .attr("style", "cursor:pointer")
                .style("fill", function(d) {
                    // return color(d.maxSeverity);
                })
                .on('mouseenter', function(d){
                    d3Tip.show(d)
                })
                .on('mouseleave', function(){
                    d3Tip.hide()
                })
            childEnterTransition.append('text')
                .attr("class", "label")
                .attr('x', function(d) {
                    return d.dx / 2;
                })
                .attr('y', function(d) {
                    return d.dy / 2;
                })
                .attr("dy", ".35em")
                .attr("fill", "#04203e")
                .attr("font-size", "13")
                .attr("text-anchor", "middle")
                // .style("display", "none")
                .text(function(d) {
                    return d.name
                })
                .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; })
                .on('mouseover', function(d){  
                    return false
                    d3Tip.show(d)
                })
                .on('mouseout', function(d){
                    return false
                    d3Tip.show(d)
                })
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
                    // return color(d.maxSeverity);
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



            zoom.call(this,node);
        // });


        function size(d) {
            return d.value;
        }


        function count(d) {
            return 1;
        }


        //and another one
        function textHeight(d) {
            var ky = this.chartHeight / d.dy;
            this.yscale.domain([d.y, d.y + d.dy]);
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

            this.treemap
                .padding([headerHeight / (this.chartHeight / d.dy), 0, 0, 0])
                .nodes(d);

            // moving the next two lines above treemap layout messes up padding of zoom result
            var kx = this.chartWidth / d.dx;
            var ky = this.chartHeight / d.dy;
            var level = d;

            this.xscale.domain([d.x, d.x + d.dx]);
            this.yscale.domain([d.y, d.y + d.dy]);

            if (node != level) {
                this.chart.selectAll(".cell.child .label")
                    // .style("display", "none");
            }

            var zoomTransition = this.chart.selectAll("g.cell").transition().duration(transitionDuration)
                .attr("transform", (d) => {
                  return "translate(" + this.xscale(d.x) + "," + this.yscale(d.y) + ")";
                })
                .each("start", function() {
                    d3.select(this).select("label")
                        .style("display", "none");
                })
                .each("end", (d, i) => {
                   if (!i && (level !== self.root)) {
                        this.chart.selectAll(".cell.child")
                            .filter(function(d) {
                                return d.parent === self.node; // only get the children for selected group
                            })
                            .select(".label")
                            .style("display", "")
                            .style("fill", (d) => {
                              return idealTextColor(color(d.maxSeverity));
                            });
                    }
                  })

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
                    if (!d.children && (d.parent.path == 'severity' || d.parent.path == 'status')) {
                        return window[`_${d.parent.path}`][d.name]
                    } else {
                        return d.name;
                    }
                });

            zoomTransition.select(".child .label")
                .attr("x", function(d) {
                    return kx * d.dx / 2;
                })
                .attr("y", function(d) {
                    return ky * d.dy / 2;
                });
            zoomTransition.select(".parent .label")
                .attr("x", function(d) {
                    return kx * d.dx / 2;
                })

            zoomTransition.select("rect")
                .attr("width", function(d) {
                    return Math.max(0.01, (kx * d.dx));
                })
                .attr("height", function(d) {
                    return d.children ? headerHeight : Math.max(0.01, (ky * d.dy));
                })
                .style("fill", d => {
                    if(!d.children && d.noData){
                      return '#7ff5d9'
                     }
                  return d.children ? headerColor : this.color(d.maxSeverity);
                } );

            
            node = d;

            if (d3.event) {
                d3.event.stopPropagation();
            }
        }
        }

    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render(){
        const hasData = Array.isArray(this.props.currentDashbordData) && this.props.currentDashbordData.length > 0
        
        // 下面分开判断主要是为了没数据居中显示
        return (
            <div>
            <div className={styles.loadingWrap}>
                <Spin spinning= {this.props.isLoading}>
                    <div id="treemap" className={styles.treemap}></div> 
                </Spin>
            </div>
            { !hasData && <div className={styles.alertNoData}><FormattedMessage {...formatMessages['noData']} /></div>}
            </div>
        )
    }

}
export default Chart
