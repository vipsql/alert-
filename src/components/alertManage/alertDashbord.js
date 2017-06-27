import React, { Component } from 'react'
import styles from './index.less'
import { Spin } from 'antd'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Tip from './d3Tip'
import $ from 'jquery'
const d3Tip = new Tip

const formatMessages = defineMessages({
    noData:{
      id: 'alertManage.noData',
      defaultMessage: '告警看板暂无数据，请先设置关注数据',
    },
    NEW: {
        id: 'treemap.activeAlerts',
        defaultMessage: '未接手告警',
    },
    PROGRESSING: {
        id: 'treemap.assignedAlerts',
        defaultMessage: '处理中告警',
    },
    RESOLVED: {
        id: 'treemap.resolvedAlerts',
        defaultMessage: '已解决告警',
    },
    EXCEPTCLOSE: {
        id: 'treemap.exceptClosed',
        defaultMessage: '所有未关闭告警',
    }
})
const deepCopy= (soruce) => {
     return JSON.parse(JSON.stringify(soruce));
}


class Chart extends Component{

    constructor(props) {
        super(props)
        // this.setTreemapHeight = this.setTreemapHeight.bind(this);
        this.timer = null // 定时器
    }
    setTreemapHeight(ele){
        // const _percent = 0.85 // 占屏比
        const clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
        ele.style.height = (clientHeight - 130) + 'px'

    }
    shouldComponentUpdate(nextProps){
      return this.props.currentDashbordData !== nextProps.currentDashbordData || this.props.isFullScreen !== nextProps.isFullScreen
    }
    componentDidMount(){
        const self = this;

        const severityToColor = {
            '0': '#4fdfbf', // 恢复
            '1': '#f6cb03', // 提醒
            '2': '#fa8c16', // 警告
            '3': "#ec5437" // 紧急
        }
        this.chartWidth = document.documentElement.clientWidth - 160 - 90
        this.chartHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight) - 180
        this.xscale = d3.scale.linear().range([0, this.chartWidth])
        this.yscale = d3.scale.linear().range([0, this.chartHeight])
        this.color = function(num){
            // 没有数据时的颜色
            if(num < 0) {
                return "#6dcd7c"
            }
            return severityToColor[num]
        }

        this.chart = d3.select("#treemap")
            .append("svg:svg")
            .attr("width", this.chartWidth)
            .attr("height", this.chartHeight)
            .append("svg:g")


        this.timer = setInterval( () =>{
            // 全屏下不刷新
            //if(!this.props.isFullScreen){
                this.props.requestFresh()
            //}

        }, 60000)

        // 监听ESC
        document.addEventListener('keyup',(e) =>{
            if(this.props.isFullScreen){
                if(e.keyCode === 27){ //esc按键
                    self.props.setFullScreen()
                }
            }
        },false)
    }

    componentWillReceiveProps(newProps) {

    }

    componentDidUpdate(nextProps){
        const { oldDashbordDataMap, isFixed } = this.props;

        if(this.props.isFixed != nextProps.isFixed || this.props.isFullScreen != nextProps.isFullScreen) {
            this._repaint();
            return;
        }

        if(this.treemap) {
            this._update();
        } else {
            this._repaint();
        }

    }

    componentWillUnmount() {
        d3Tip.hide();
        clearInterval(this.timer)
    }

    // 根据窗口大小重新设置每一块的大小
    _resize() {

    }

    // 全屏
    _fullScreen() {
        const childCells = d3.select(".cell.child");
        const parentCells = d3.select(".cell.parent");

    }

    _idealTextColor(bgColor) {
        var nThreshold = 105;
        var components = this._getRGBComponents(bgColor);
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    }

    _getRGBComponents(color) {
        var r = color.substring(1, 3);
        var g = color.substring(3, 5);
        var b = color.substring(5, 7);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
    }

    // 单元格内容变化
    _textTransition(selector, isFullScreen) {
        const cells = d3.select(selector);
        // cells.selectAll("*").interrupt();
        const textTransition = cells.select("svg").select(".label")
        .attr("isFullScreen", isFullScreen)
        .text((d) => this._wrap(d, isFullScreen?this.chartWidth / d.parent.dx * d.dx : d.dx))
        .transition();

        if(isFullScreen) {
            textTransition.each("end", function(d) {
                textTransition.attr("isFullScreen", isFullScreen);
            })
        }
    }

    _wrap(d, actualWidth) {
        let self = d3.select("#" + d.id + "> svg > .label"),
            text;
        const originText = self.text();
        const originFontSize = self.attr("font-size");
        if (!d.children && (d.parent.path == 'severity' || d.parent.path == 'status')) {
            text = window[`_${d.parent.path}`][d.name]
        } else {
            text = d.name;
        }

        self.text(text);
        self.attr("font-size", "11.3pt");
        let textLength =  self.node().getComputedTextLength();
        let isShorted = false

        const width = actualWidth || d.dx;

        while (textLength > (width - 5) && text.length > 0) {
            isShorted = true;
            text = text.slice(0, -1);
            self.text(text + '...');
            textLength = self.node().getComputedTextLength();
        }

        self.text(originText);
        self.attr("font-size", originFontSize);

        return isShorted?(text + "...") : text;
    }

    _update() {
        const { oldDashbordDataMap, currentDashbordData } = this.props;
        var children = currentDashbordData.filter(function(d) {
            return !d.children;
        });
        const childrenCells = d3.selectAll("g.cell.child");
        childrenCells
        .data(children, function(d) {
            return "c-" + d.path;
        });

        currentDashbordData.forEach((parentNode, index) => {
            parentNode.children.forEach((childNode) => {
                const oldNode = oldDashbordDataMap[childNode.id];
                const wrap = this._wrap;
                const currentNode = d3.select("#" + childNode.id);

                // 最高级别警告发生变化时呈现的动画
                if((childNode && oldNode) && childNode.maxSeverity != oldNode.maxSeverity) {
                    const svg = currentNode.select("svg");
                    if(currentNode[0] && currentNode[0][0]) {
                        currentNode[0][0].__data__.maxSeverity = childNode.maxSeverity;
                    }
                    svg
                    .select("rect")
                    .transition()
                    .duration(2000)
                    .style("fill", (d) => {
                        return this.color(childNode.maxSeverity)
                    })
                }

                // 告警数发生变化时呈现的动画
                if(childNode && (!oldNode || oldNode.trueVal != childNode.trueVal)) {
                    const node = this.chart.select("#" + childNode.id);
                    currentNode[0][0].__data__.trueVal = childNode.trueVal;
                    currentNode[0][0].__data__.noData = childNode.trueVal == 0;
                    node.data(childNode);
                    const svg = d3.select("#" + childNode.id).select("svg");
                    svg
                    .select("text.label")
                    .transition()
                    .duration(500)
                    .style("opacity", "0")
                    .transition()
                    .delay(2000)
                    .transition()
                    .duration(500)
                    .style("opacity", "1")

                    const text = svg
                    .append("text")
                    .attr("class", "tipLabel")
                    .attr('x', function(d) {
                        if(d.kx) {
                            return d.kx * d.dx / 2;
                        } else {
                            return d.dx / 2;
                        }
                    })
                    .attr("dy", ".35em")
                    .attr("fill", "#04203e")
                    .attr("font-size", "13")
                    .attr("text-anchor", "middle")
                    .text((oldNode.trueVal > childNode.trueVal?('-' + (oldNode.trueVal - childNode.trueVal)):'+' + (childNode.trueVal - oldNode.trueVal)))
                    .style("color", "red")
                    .attr('font-size', function(d) {
                        const self = d3.select(this);
                        const originFontSize = self.attr("font-size");
                        const originStyle = document.defaultView.getComputedStyle(self.node())
                        const textLength = self.node().getComputedTextLength();
                        const fontSizeTimesDx = d.dx / textLength;
                        const fontSizeTimesDy = d.dy / originStyle.lineHeight;
                        let targetFontSize = 13 * (fontSizeTimesDx > fontSizeTimesDy?fontSizeTimesDy:fontSizeTimesDx) * 0.8;

                        if(targetFontSize > 30) {
                            targetFontSize = 30
                        }
                        return targetFontSize;
                    })

                    // 若告警数减少则数字从上往下移动，否则从下往上移动
                    if(oldNode.trueVal < childNode.trueVal) {
                        text
                        .attr('y', function(d) {
                            if(d.ky) {
                                return d.ky * d.dy;
                            } else {
                                return d.dy;
                            }
                        })
                        .transition()
                        .duration(1000)
                        .attr('y', function(d) {
                            if(d.ky) {
                                return d.ky * d.dy / 2
                            } else {
                                return d.dy / 2;
                            }
                        })
                        .transition()
                        .duration(1000)
                        .attr('y', function(d) {
                            return -10;
                        })
                    } else {
                        text
                        .attr('y', function(d) {
                            return 0;
                        })
                        .transition()
                        .duration(1000)
                        .attr('y', function(d) {
                            if(d.ky) {
                                return d.ky * d.dy / 2
                            } else {
                                return d.dy / 2;
                            }
                        })
                        .transition()
                        .duration(1000)
                        .attr('y', function(d) {
                            if(d.ky) {
                                return d.ky * d.dy + 10
                            } else {
                                return d.dy + 10;
                            }
                        })
                    }

                    text
                    .transition()
                    .delay(2000)
                    .style("display", "none")
                    .text((d) => this._wrap(d))
                    .remove();
                }
            })
        })

        if(!this.props.isFixed) {
            setTimeout(() => { this._repaint(); }, 3000);
        }
    }

    _repaint() {
        let { intl: {formatMessage}, selectedStatus } = this.props;

        // 如果全屏
        const treemapNode = document.querySelector('#treemap')

        // 去掉所有动画
        $("text.label").css("opacity", "1");
        $("text.tipLabel").remove();

        if(this.props.isFullScreen){
             //这里是为了遮住头部的那段空白 用了下面hack
            //  高度添加40px(headerHeight为40)
            // 然后在往上移动40px遮住空白
            this.chartWidth = window.innerWidth
            this.chartHeight = window.innerHeight
            treemapNode.style.cssText = 'position:fixed;top:-20px;left:0'

        }else{
            if (this.props.isFold) {
                this.chartWidth = document.documentElement.clientWidth - 140;
            } else {
                this.chartWidth = document.documentElement.clientWidth - 160 - 90;
            }
            this.chartHeight = window.innerHeight - 180
            treemapNode.style.cssText = 'position:absolute;'
        }


        this.xscale = d3.scale.linear().range([0, this.chartWidth]);
        this.yscale = d3.scale.linear().range([0, this.chartHeight]);

        d3.select("#treemap")
            .select('svg')
            .attr("width", this.chartWidth)
            .attr("height", this.chartHeight)

        // 计算总的告警数 主要是为了当告警数很小时 区域无法显示 给一个最小的区域快大小
        let sumAlerts = 0
        this.props.currentDashbordData.forEach( (item)=>{
            sumAlerts += item.value
        })


        this.treemap = d3.layout.treemap()
          .round(false)
          .size([this.chartWidth, this.chartHeight])
          .sticky(true)
          .value(function(d) {
              if(d.fixedValue){
                return d.fixedValue
              }else{
                return d.value
              }

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

        let updateData = deepCopy(this.props.currentDashbordData)
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

        var nodes = this.treemap.nodes(root)

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

                .attr("id", function(d) {
                    return d.id
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
                .attr('font-size', '13')
                .attr("height", headerHeight)
                .text((d) => this._wrap(d))
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
                .text((d) => this._wrap(d));
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
                .attr("id", function(d) {
                    return d.id
                })
                .on("contextmenu", (d, e) => {
                    const parentD = node === d.parent ? root : d.parent;
                    zoom.call(this, node === d.parent ? root : d.parent, d.parent)
                    // this._textTransition("#" + parentNode.id + " > .child");
                    if(parentD.parent) {
                        parentD.children.forEach((childD) => {
                            childD.isFullScreen = true;
                        })
                    }
                    d3Tip.hide()
                    currentEvent.preventDefault()
                  })
                .on("click", (d) => {
                    d3Tip.hide()
                    let alertListPath = {};
                    let pathArr = d.path.split('/');
                    if ( pathArr !== undefined && pathArr[0] !== undefined && pathArr[1] !== undefined ) {
                        let temp = pathArr[0];
                        // if ( pathArr[0] == 'severity' || pathArr[0] == 'status') {
                        //     alertListPath[temp] = {key: pathArr[0], keyName: d.parent.name, values: pathArr[1]};
                        // } else
                        if (pathArr[0] == 'source') {
                            alertListPath[temp] = {key: pathArr[0], keyName: d.parent.name, values: d.name};
                        } else if (pathArr[0] != 'severity') {
                            alertListPath[d.parent.name] = {key: d.parent.name, keyName: d.parent.name, values: d.name};
                        }
                    }
                    // alertListPath.severity = d.maxSeverity == 0
                    //                             ? {key: 'severity', keyName: window.__alert_appLocaleData.messages['constants.severity'], values: '0'} : d.maxSeverity == 1
                    //                                 ? {key: 'severity', keyName: window.__alert_appLocaleData.messages['constants.severity'], values: '1,0'} : d.maxSeverity == 2
                    //                                     ? {key: 'severity', keyName: window.__alert_appLocaleData.messages['constants.severity'], values: '2,1,0'} : d.maxSeverity == 3
                    //                                         ? {key: 'severity', keyName: window.__alert_appLocaleData.messages['constants.severity'], values: '3,2,1,0'}
                    //                                         : {key: 'severity', keyName: window.__alert_appLocaleData.messages['constants.severity'], values: '3,2,1,0'}
                    alertListPath.status = this.props.selectedStatus === 'NEW'
                                                ? {key: 'status', keyName: window.__alert_appLocaleData.messages['constants.state'], values: '0'} : this.props.selectedStatus === 'PROGRESSING'
                                                    ? {key: 'status', keyName: window.__alert_appLocaleData.messages['constants.state'], values: '150'} : this.props.selectedStatus === 'RESOLVED'
                                                        ? {key: 'status', keyName: window.__alert_appLocaleData.messages['constants.state'], values: '190'} : this.props.selectedStatus === 'EXCEPTCLOSE'
                                                          ? {key: 'status', keyName: window.__alert_appLocaleData.messages['constants.state'], values: '0,40,150,190'} : undefined;
                    alertListPath.selectedTime = this.props.selectedTime;
                    localStorage.setItem('alertListPath', JSON.stringify(alertListPath))

                    const path = d.parent.path
                    localStorage.setItem('__visual_group', path)
                    if(path != 'source' && path != 'status' && path != 'severity'){
                        const gr1 = [{key:d.parent.name, value: d.name}]
                        localStorage.setItem('__alert_visualAnalyze_gr1', JSON.stringify(gr1))
                    }
                    window.location.hash = "#/alertManage/alertList";
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
                .style("fill", (d) => {
                    // return color(d.maxSeverity);
                })
                .on('mouseenter', (d) => {
                    d3Tip.show(d, formatMessage({...formatMessages[this.props.selectedStatus]}))
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
                .attr("fill", "#ffffff")
                .attr("font-size", "14")
                //.attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                // .style("display", "none")
                .text((d) => this._wrap(d))
                .on('mouseover', (d) => {
                    d3Tip.show(d, formatMessage({...formatMessages[this.props.selectedStatus]}))
                    return false
                })
                .on('mouseout', (d) => {
                    d3Tip.show(d, formatMessage({...formatMessages[this.prop.selectedStatus]}))
                    return false
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
                .text((d) => this._wrap(d));

            // exit transition
            childrenCells.exit()
                .remove();



            zoom.call(this,node);
        // });


        function size(d) {
            if(d.fixedValue){
                return d.fixedValue;
              }else{
                return d.value;
              }
        }


        // function count(d) {
        //     return 1;
        // }


        //and another one
        function textHeight(d) {
            var ky = this.chartHeight / d.dy;
            this.yscale.domain([d.y, d.y + d.dy]);
            return (ky * d.dy) / headerHeight;
        }


        function zoom(d, cellD) {

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


            const parentD = d;

            if(parentD.parent) {
                parentD.children.forEach((childD) => {
                    childD.kx = kx;
                    childD.ky = ky;
                })
            } else if(cellD) {
                cellD.children.forEach((childD) => {
                    childD.kx = undefined;
                    childD.ky = undefined;
                })
            }

            // const kxTransition = d3.select("#" + d.id).attr("kx", kx);

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
                        const tempNode = d3.select("#" + d.id);
                        parentD.children.forEach((childD) => {
                            d3.select("#" + childD.id).select('.label').text((d) => this._wrap(d));
                        })
                        // this.chart.selectAll(".cell.child")
                        //     .filter(function(d) {
                        //         return d.parent === self.node; // only get the children for selected group
                        //     })
                        //     .select(".label")
                        //     .style("display", "")
                        //     .text(this._wrap)
                        //     .style("fill", (d) => {
                        //       return this._idealTextColor(color(d.maxSeverity));
                        //     });
                    }

                    const matchD = parentD.children.filter((childD) => childD.id == d.id);
                    if(matchD && matchD.length > 0 && level.depth == 1) {
                        this._textTransition("#" + matchD[0].id, true);
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
                .text((d) => this._wrap(d));

            zoomTransition.select(".child .label")
                .attr("x", function(d) {
                    return kx * d.dx / 2;
                })
                .attr("y", function(d) {
                    return ky * d.dy / 2;
                })
                .attr("font-size", "11.5pt")
                .style("text-shadow", "1px 1px 1px #333")
                // .attr("font-size", function(d) {

                //     d.w = this.getComputedTextLength();
                //     return d.dx > d.w ? 13 : 13 * d.dx / d.w;
                // })
                // .style("opacity", function(d) { d.w = this.getComputedTextLength(); return kx * d.dx > d.w ? 1 : 0; })
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
                      return '#6dcd7c'
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


    render(){

        const hasData = Array.isArray(this.props.currentDashbordData) && this.props.currentDashbordData.length > 0

        // 下面分开判断主要是为了没数据居中显示
        return (
            <div>

            <div className={styles.loadingWrap}>
                <Spin spinning= {this.props.isLoading}>
                    <div id="treemap" className={styles.treemap + ' ' + (this.props.isFullScreen?styles.maxTreemap:'')}>

                    </div>
                </Spin>
            </div>
            { !hasData && <div className={styles.alertNoData}><FormattedMessage {...formatMessages['noData']} /></div>}
            </div>
        )
    }

}
export default injectIntl(Chart)
