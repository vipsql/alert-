import React, { PropTypes, Component } from 'react'
import { Button, Spin} from 'antd';
import { connect } from 'dva'
import { Popover } from 'antd'
import styles from '../index.less'
import LevelIcon from '../../common/levelIcon/index.js'
import CodeWords from '../../../codewords.json'

class ListTimeTable extends Component {
    componentDidMount(){
      const { setTimeLineWidth, begin, end  } = this.props

      const table = document.getElementById('listTimeTable')
      const width = table.offsetWidth
      const timeLine = document.getElementById('timeLine')
      // 360 表格左侧宽度
      // 50 是最后一点预留位置
      const lineW = width - 360 - 50
      timeLine.style.width = lineW + 'px'
      const gridWidth = lineW / 10
      const countMins = (end - begin) / (60 * 1000)
      const minuteToWidth = lineW / countMins

      setTimeLineWidth(gridWidth, minuteToWidth)

    }
    render(){
      const {
        isGroup,
        gridWidth,
        minuteToWidth,
        begin,
        end,
        data,
        columns,
        loadMore,
        isShowMore,
        checkAlertFunc,
        checkAlert,
        detailClick,
        spreadChild,
        noSpreadChild,
        spreadGroup,
        noSpreadGroup,
        selectedAll,
        toggleSelectedAll,
        relieveClick,
        isLoading
      } = this.props
      
      let colsKey = []
      const theads = columns.filter( item => (item['key'] == 'entityName' || item['key'] == 'name')).map( (item) => {
        //const width = item.width || 'auto'
        colsKey.push(item['key'])
        return (
          <th key={item.key}>
            {item.title}
          </th>
        )
      } )


      const defaultShowNums = 10; //默认显示10个点
      const gridTime = (end - begin) / defaultShowNums //间隔时间戳

      let timeTH = []
      
      const formatDate = function(date){
        const d = new Date(date)
        let hours = d.getHours()
        let mins = d.getMinutes()

        hours = hours < 10 ? '0' + hours : hours
        mins = mins < 10 ? '0' + mins : mins


        return hours + ':' + mins
      }
      for(let i = 0; i < defaultShowNums; i++){
        
        const timstamp = begin + gridTime * i
        const date = formatDate(timstamp)
        const left = gridWidth * i
        timeTH.push(
          <div key={i}>
            <span className={styles.timePos} style={{left:left + 'px'}}>
            {date}
            </span>
            <span className={styles.timeSep} style={{left:left + 'px'}}>
            </span>
          </div>
        )
        // 添加最后时间点的显示
        if( i == (defaultShowNums - 1)){
          const lastTimeLeft = gridWidth*defaultShowNums
          const lastTime = formatDate(end)
          timeTH.push(
            <div key={defaultShowNums}>
              <span className={styles.timePos} style={{left:lastTimeLeft  + 'px'}}>
              {lastTime}
              </span>
              <span className={styles.timeSep} style={{left:lastTimeLeft + 'px'}}>
              </span>
            </div>
          )
          
          
        }

      }


      let tbodyCon = []

      // 生成列
      const genTds = (item, keys) => {
         let TDS = []

         keys.forEach( (key, index) => {
           // const tdKey = item.date + key
           const className = key == 'name' ? 'tdBorderRight' : ''
           if(index == 0){
             TDS.push(
               <td key='sourceAlert'>
                  {
                    item['hasChild'] === true 
                      ? item['isSpread'] === true 
                        ? <span className={styles.triangleUp} data-id={item.id} onClick={ noSpreadChild }></span>
                          : <span className={styles.triangleDown} data-id={item.id} onClick={ spreadChild }></span>
                            : undefined
                  }
               </td>
             )
           }
           if(key == 'name') {
            TDS.push(<td key={key} className={styles[className]} data-id={item.id} onClick={detailClick} >
              {item[key]}
              {
                item['hasChild'] === true ?
                <span className={styles.relieveIcon} data-all={JSON.stringify(item)} onClick={relieveClick}></span>
                :
                undefined
              }
            </td>)
           } else {
             TDS.push(<td key={key} className={styles[className]}>{item[key]}</td>)
           }

         })
         TDS.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={item['severity']}/></td>)
         return TDS
      }

      // 生成子告警列
      const getChildTds = (item, keys) => {
         let TDS = []

         keys.forEach( (key, index) => {
           // const tdKey = item.date + key
           const className = key == 'name' ? 'tdBorderRight' : '';

           if(key == 'alertName') {
             TDS.push(<td key={key} className={styles[className]} data-id={item.id} onClick={detailClick} >{item[key]}</td>)
           } else {
             TDS.push(<td key={key} className={styles[className]}>{item[key]}</td>)
           }
           
         })
         TDS.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={item['severity']}/></td>)
         TDS.unshift(<td key='space-col-td'></td>)
         return TDS
      }

      //  生成时间线
      const genDots = (item, keys) => {
        let dots = null
        let dotsLine = []
        let lineDotLeft = 0
        let lineDotW = 0
        
        lineDotLeft = (item[0].occurTime - begin) / (60 * 1000) * minuteToWidth
        const len = item.length
        lineDotW = (item[len-1]['occurTime'] - item[0]['occurTime']) / (60 * 1000) * minuteToWidth
        
        dots =  item.map( (itemDot, idx) => {
          const left = (itemDot.occurTime - begin) / (60 * 1000) * minuteToWidth
          const iconColor = itemDot['severity'] == 3 ? 
                              'jjLevel' : itemDot['severity'] == 2 ?
                                  'gjLevel' : itemDot['severity'] == 1 ?
                                      'txLevel' : itemDot['severity'] == 0 ?
                                          'hfLevel' : undefined
          let newDate = new Date(+itemDot['occurTime'])
          const content = (
            <div>
              <p>{`级别：${CodeWords['severity'][itemDot['severity']]}`}</p>
              <p>{`告警名称：${itemDot['name']}`}</p>
              <p>{`告警ID：${itemDot['incidentId']}`}</p>
              <p>{`发生时间：${newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDate() + ' ' + newDate.getHours() + ':' + newDate.getMinutes()}`}</p>
              <p>{`告警描述：${itemDot['description']}`}</p>
              <p>{`来源：${itemDot['source']}`}</p>
            </div>
          );
          return (
            <Popover content={content} key={`dot-${idx}`} trigger={'click'} className={styles.myPopover}>
              <span style={{left: left  + 'px'}} className={styles[iconColor]} data-id={itemDot.id} onClick={detailClick}></span>
            </Popover>

          )
        })
       
        return {
          dots,
          lineDotW,
          lineDotLeft
        }
      }

      // 生成子告警行
      const genchildTrs = (childItem, childIndex, keys, item, lineDotW, lineDotLeft) => {
        const childTds = getChildTds(childItem, keys)
        const childDotsInfo = genDots(childItem.timeLine, keys)
        const childDots = childDotsInfo.dots
        const childLineDotW = childDotsInfo.lineDotW
        const childLineDotLeft = childDotsInfo.lineDotLeft
        return (
          <tr key={childIndex} className={!item.isSpread ? styles.hiddenChild : styles.noSpread}>
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
          let keys = colsKey;

          let groupTr = null
          let commonTrs = []
          let childTrs = []
          // 分组行
          groupTr = groupItem.isGroupSpread === false ?
          (<tr className={styles.trGroup} key={index}>
            <td colSpan={6}>
              <span className={styles.expandIcon} data-classify={groupItem.classify} onClick={spreadGroup}>+</span>
                {groupItem.classify}
            </td>
          </tr>)
          :
          (<tr className={styles.trGroup} key={index}>
            <td colSpan={6}>
              <span className={styles.expandIcon} data-classify={groupItem.classify} onClick={noSpreadGroup}>-</span>
                {groupItem.classify}
            </td>
          </tr>)
          
          if (groupItem.children !== undefined) {
            
            groupItem.children.forEach( (item, index) => {

              const tds = genTds(item, keys)
              const dotsInfo = genDots(item.timeLine, keys)
              const dots = dotsInfo.dots
              const lineDotW = dotsInfo.lineDotW
              const lineDotLeft = dotsInfo.lineDotLeft

              if(item.childrenAlert && groupItem.isGroupSpread !== false){
                childTrs = item.childrenAlert.map ( (childItem, childIndex) => {
                  //keys = Object.keys(childItem);
                  return genchildTrs(childItem, childIndex, keys, item, lineDotW, lineDotLeft)

                })
              }else{
                childTrs = null
              }

              commonTrs.push(
                <tr key={index} className={groupItem.isGroupSpread !== undefined && !groupItem.isGroupSpread ? styles.hiddenChild : styles.noSpread}>
                  <td key="checkbox" className={styles.checkstyle}><input type="checkbox" checked={checkAlert[item.id].checked} data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlertFunc}/></td>
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
          tbodyCon.push(
            groupTr,
            commonTrs
          )



        } )

      }else{

        if (data.length > 0 && data.children === undefined) {

          data.forEach( (item, index) => {

            let keys = colsKey;
            
            const tdCheck = Object.keys(checkAlert).length !== 0 ? 
              <td key="checkbox" className={styles.checkstyle}><input type="checkbox" checked={checkAlert[item.id].checked} data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlertFunc}/></td> 
              : 
              undefined
            const tds = genTds(item, keys)
            const dotsInfo = genDots(item.timeLine, keys)
            const dots = dotsInfo.dots
            const lineDotW = dotsInfo.lineDotW
            const lineDotLeft = dotsInfo.lineDotLeft

            // 如果有子告警
            let childTrs = []

            if(item.childrenAlert){

              childTrs = item.childrenAlert.map ( (childItem, childIndex) => {
                keys = colsKey
                return genchildTrs(childItem, childIndex, keys, item, lineDotW, lineDotLeft)

              })
            }else{
              childTrs = null
            }
            
            tbodyCon.push(
              <tr key={index} className={styles.noSpread}>
                {tdCheck}
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
      }


      return(
        <div>
          <Spin tip="加载中..." spinning={isLoading}>
            <table width='100%' id="listTimeTable" className={styles.listTimeTable}>
              <thead>
                <tr>
                  <th key="checkAll" width='48' className={styles.checkstyle}><input type="checkbox" checked={selectedAll} onChange={toggleSelectedAll}/></th>
                  <th width="20" key='space-col'></th>
                  <th width='10'></th>
                  {theads}
                  <th key="timeLine" id="timeLine">
                    <div className={styles.relPos}>{timeTH}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
              {
                data.length > 0 ? tbodyCon :
                <tr>
                  <td colSpan="6" style={{textAlign: 'center'}}>暂无数据</td>
                </tr>
              }
              </tbody>
            </table>
          </Spin>
          {isShowMore && <div className={styles.loadMore}><Button onClick={loadMore}>显示更多</Button></div>}
        </div>
      )
    }
}
export default ListTimeTable
