import React, { PropTypes, Component } from 'react'
import { Button } from 'antd';
import { connect } from 'dva'
import { Popover } from 'antd'
import styles from '../index.less'


const columns = [{
  title: '对象',
  dataIndex: 'objec',
  key: 'objec',
  width: 100
}, {
  title: '告警名称',
  dataIndex: 'name',
  key: 'name',
  width: 180
}];
class ListTimeTable extends Component {
    componentDidMount(){
      const { setTimeLineWidth, startTime, endTime  } = this.props

      const table = document.getElementById('listTimeTable')
      const width = table.offsetWidth
      const timeLine = document.getElementById('timeLine')
      const lineW = width - 360
      timeLine.style.width = lineW + 'px'
      const gridWidth = Math.floor(lineW / 10)
      const countMins = (endTime - startTime) / (60 * 1000)
      const minuteToWidth = Math.floor(lineW / countMins)

      setTimeLineWidth(gridWidth, minuteToWidth)

    }
    render(){
      const {
        isGroup,
        gridWidth,
        minuteToWidth,
        startTime,
        endTime,
        data,
        showMore
      } = this.props


      const theads = columns.map( (item) => {
        return (
          <th key={item.key} width={item.width}>
            {item.title}
          </th>
        )
      } )
      // 添加一个空列显示合并告警箭头
      theads.unshift((
        <th width="10" key='space-col'></th>
      ))

      const defaultShowNums = 10; //默认显示10个点
      const gridTime = (endTime - startTime) / defaultShowNums //间隔时间戳

      let timeTH = []
      for(let i = 0; i < defaultShowNums; i++){
        const timstamp = startTime + gridTime * i
        const formatDate = new Date(timstamp).getHours() + ':' +  new Date(timstamp).getMinutes()
        const left = gridWidth * i
        timeTH.push(
          <div key={i}>
            <span className={styles.timePos} style={{left:left + 'px'}}>
            {formatDate}
            </span>
            <span className={styles.timeSep} style={{left:left + 'px'}}>
            </span>
          </div>
        )

      }


      let tbodyCon = []

      // 生成列
       const genTds = (item, keys) => {
         let TDS = []

         keys.forEach( (key, index) => {
           // const tdKey = item.date + key
           const className = key == 'des' ? 'tdBorderRight' : ''
           if(key === 'list' || key == 'children')  {
             return
           }

           if(index == 1){
               TDS.push(
                <td key='sourceAlert'>
                  {item.children && <span className={styles.triangleLeft}>
                  </span>}
                </td>
              )

            }
            TDS.push(
              <td key={key} className={styles[className]}>{item[key]}</td>
            )

         })

         return TDS
       }

      //  生成时间线
      const genDots = (item, keys) => {
        let dots = null
        let dotsLine = []
        let lineDotLeft = 0
        let lineDotW = 0
        keys.forEach((key, index) => {
          if(key === 'list')  {
            lineDotLeft = (item['list'][0].date - startTime) / (60 * 1000) * minuteToWidth
            const len = item['list'].length
            lineDotW = (item['list'][len-1]['date'] - item['list'][0]['date']) / (60 * 1000) * minuteToWidth

            dots =  item['list'].map( (itemDot, idx) => {
              const left = (itemDot.date - startTime) / (60 * 1000) * minuteToWidth
              const content = (
                <div>
                  <p>{itemDot['jd']}</p>
                  <p>{itemDot['name']}</p>
                </div>
              );
              return (
                <Popover content={content} key={`dot-${idx}`}>
                  <span style={{left: left  + 'px'}}></span>
                </Popover>

              )
            })
          }
        })
        return {
          dots,
          lineDotW,
          lineDotLeft
        }
      }

      // 生成子告警行
      const genchildTrs = (childItem, childIndex, keys, lineDotW, lineDotLeft) => {
        const childTds = genTds(childItem, keys)
        const childDotsInfo = genDots(childItem, keys)
        const childDots = childDotsInfo.dots
        const childLineDotW = childDotsInfo.lineDotW
        const childLineDotLeft = childDotsInfo.lineDotLeft
        return (
          <tr key={childIndex} >
            <td key="checkbox"></td>
            {childTds}
            <td key="timeDot">
              <div className={styles.timeLineDot}>
                <div className={styles.lineDot} style={{width:childLineDotW + 'px', left: childLineDotLeft + 'px'}}></div>
                {childDots}
              </div>
            </td>
          </tr>
        )
      }

      if(isGroup){
        data.forEach( (groupItem, index) => {
          let groupTr = null
          let commonTrs = []
          let childTrs = []
          // 分组行
          groupTr = (
            <tr>
              <td colSpan='6'>{groupItem['classify']}</td>
            </tr>
          )
          //
          groupItem.children.forEach( (item, index) => {
            let keys = Object.keys(item)

            const tds = genTds(item, keys)
            const dotsInfo = genDots(item, keys)
            const dots = dotsInfo.dots
            const lineDotW = dotsInfo.lineDotW
            const lineDotLeft = dotsInfo.lineDotLeft

            commonTrs = (
              <tr key={index}>
                <td key="checkbox"><input type="checkbox" /></td>
                {tds}
                <td key="timeDot">
                  <div className={styles.timeLineDot}>
                    <div className={styles.lineDot} style={{width:lineDotW + 'px', left: lineDotLeft + 'px'}}></div>
                    {dots}
                  </div>
                </td>
              </tr>
            )

            if(item.children){
              childTrs = item.children.map ( (childItem, childIndex) => {
                keys = Object.keys(childItem);
                return genchildTrs(childItem, childIndex, keys, lineDotW, lineDotLeft)

              })
            }else{
              childTrs = null
            }

          })
          tbodyCon.push(
            groupTr,
            commonTrs,
            childTrs
          )



        } )

      }else{
        data.map( (item, index) => {

          // const info = item.alertInfo
          let keys = Object.keys(item);

          const tds = genTds(item, keys)
          const dotsInfo = genDots(item, keys)
          const dots = dotsInfo.dots
          const lineDotW = dotsInfo.lineDotW
          const lineDotLeft = dotsInfo.lineDotLeft

          // 如果有子告警
          let childTrs = []

          if(item.children){

            childTrs = item.children.map ( (childItem, childIndex) => {
              keys = Object.keys(childItem);
              return genchildTrs(childItem, childIndex, keys, lineDotW, lineDotLeft)

            })
          }else{
            childTrs = null
          }

          tbodyCon.push(
            <tr key={index}>
              <td key="checkbox"><input type="checkbox" /></td>
              {tds}
              <td key="timeDot">
                <div className={styles.timeLineDot}>
                  <div className={styles.lineDot} style={{width:lineDotW + 'px', left: lineDotLeft + 'px'}}></div>
                  {dots}
                </div>
              </td>
            </tr>,
            childTrs
          )
        })
      }


      return(
        <div>
          <table width='100%' id="listTimeTable" className={styles.listTimeTable}>
            <thead>
              <tr>
                <th key="checkAll" width='48'><input type="checkbox" /></th>
                <th width='30'></th>
                {theads}
                <th key="timeLine" id="timeLine">
                  <div className={styles.relPos}>{timeTH}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tbodyCon}

            </tbody>
          </table>
          <Button onClick={showMore}>显示更多2</Button>
        </div>
      )
    }
}
export default ListTimeTable
