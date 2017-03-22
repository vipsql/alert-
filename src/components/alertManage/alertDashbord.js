import React, { Component } from 'react'
import styles from './index.less'
import { Spin } from 'antd'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/treemap')

class Chart extends Component{

    constructor(props) {
        super(props)
        this.setTreemapHeight = this.setTreemapHeight.bind(this)
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
            '0': '#ff9524', // 正常
            '1': '#a5f664', // 提醒
            '2': '#fadc23', // 警告
            '3': '#eb5a30' // 紧急
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
    }
    componentDidUpdate(){ 
         
        this.treemap = d3.layout.treemap()
          .round(false)
          .size([this.chartWidth, this.chartHeight])
          .sticky(true)
          .value(function(d) {
              return d.value;
        });
        var headerHeight = 40;
        var headerColor = "transparent";
        var transitionDuration = 500;
        var root;
        var node;

       
        // d3.json("../../../mock/alert.json", function(data) {
        if(this.props.currentDashbordData){
          node = root = {
              path: 'root',
              children: this.props.currentDashbordData
            };
            
            var nodes = this.treemap.nodes(root);

            var children = nodes.filter(function(d) {
                return !d.children;
            });
            var parents = nodes.filter(function(d) {
                return d.children;
            });


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
                .attr("height", headerHeight)
                .style("fill", headerColor);
            parentEnterTransition.append('text')
                .attr("class", "label")
                .attr("fill", "#6ac5fe")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return Math.max(0.01, d.dx/2);
                })
                .attr("y", "10")
                .attr("transform", "translate(3, 13)")
                .attr("width", function(d) {
                    console.log(d.dx)
                    return Math.max(0.01, d.dx);
                })
                .attr("height", headerHeight)
                .text(function(d) {
                    return d.path;
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
                    return d.path;
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
                  debugger
                    // location.href = 'http://www.baidu.com'
                })

                .append("svg")
                .attr("class", "clip");
            childEnterTransition.append("rect")
                .classed("background", true)
                // .attr('filter',"url(#inset-shadow)")
                .attr('stroke','#0d3158')
                .attr('stroke-width','1')
                .style("fill", function(d) {
                    // return color(d.maxSeverity);
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
                .attr("fill", "#04203e")
                .attr("font-size", "16")
                .attr("text-anchor", "middle")
                // .style("display", "none")
                .text(function(d) {
                    return d.path;
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
                    return d.path;
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
                    return d.path;
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
                .style("fill", d => {
                  return d.children ? headerColor : this.color(d.maxSeverity);
                } );

            node = d;

            if (d3.event) {
                d3.event.stopPropagation();
            }
        }
        }
            

          
        setInterval( () =>{
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
