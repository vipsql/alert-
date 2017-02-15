import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Popover } from 'antd';
import styles from './index.less'


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

const data= [{
  jb: "紧急",
  id: 11,
  des: '哈哈',
  list: [{
      date: 1487032335817,
      jd:'级别',
      name: 'DBserver_cpu利用率'
    }
  ]
},{
  jb: "紧急",
  id: 11,
  des: '哈哈',
  list: [{
      date: 1487032335817,
      jd:'级别',
      name: 'DBserver_cpu利用率'
    },{
        date: 1487032635817,
        jd:'级别2',
        name: 'DBserver_cpu利用率2'
      },{
          date: 1487033835817,
          jd:'级别2',
          name: 'DBserver_cpu利用率2'
        },{
            date: 1487035035817,
            jd:'级别2',
            name: 'DBserver_cpu利用率2'
          }
  ]
},{
  jb: "紧急",
  id: 11,
  des: '哈哈',
  list: [{
      date: 1486976290101,
      jd:'级别',
      name: 'DBserver_cpu利用率'
    }
  ]
},{
  jb: "紧急",
  id: 11,
  des: '哈哈',
  list: [{
      date: 1486976290101,
      jd:'级别',
      name: 'DBserver_cpu利用率'
    }
  ]
},{
  jb: "紧急",
  id: 11,
  des: '哈哈',
  list: [{
      date: 1486976290101,
      jd:'级别',
      name: 'DBserver_cpu利用率'
    }
  ]
}]
class ListTimeTable extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    const { setTimeLineWidth } = this.props
    const { startTime, endTime } = this.props.alertListTable

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
      endTime
    } = this.props.alertListTable

    const theads = columns.map( (item) => {
      return (
        <th key={item.key} width={item.width}>
          {item.title}
        </th>
      )
    } )
    // theads.unshift(<th width='30'></th>)
    // theads.unshift(<th key="checkAll" width='48'><input type="checkbox" /></th>)

    const defaultShowNums = 10; //默认显示10个点
    const gridTime = (endTime - startTime) / defaultShowNums //间隔时间戳

    let timeTH = []
    for(let i = 0; i < defaultShowNums; i++){
      const timstamp = startTime + gridTime * i
      const formatDate = new Date(timstamp).getHours() + ':' +  new Date(timstamp).getMinutes()
      const left = gridWidth * i
      timeTH.push(
        <div>
          <span className={styles.timePos} style={{left:left + 'px'}}>
          {formatDate}
          </span>
          <span className={styles.timeSep} style={{left:left + 'px'}}>
          </span>
        </div>
      )

    }




    let tbodyCon = [];
    if(isGroup){
      data.forEach( (item, index) => {
        const keys = Object.keys(item.children[0]);
        // 这里每次都会执行 其实需要提出去
        const tds = keys.map((key) => {
          return (
            <td key={key}>{item.children[index][key]}</td>
          )
        })
        const childtrs = item.children.map( (childItem,index) => {
          const trKey = 'tr' + index
          const tdKey = 'td' + index
          return (
              <tr key={trKey}>
                <td key={tdKey}><input type="checkbox" /></td>
                {tds}
              </tr>
          )
        } )
        childtrs.unshift(<tr key={index}><td colSpan={keys.length + 1}>{item.classify}</td></tr>)
        tbodyCon.push(childtrs)

      } )

    }else{

      tbodyCon = data.map( (item, index) => {

        // const info = item.alertInfo
        const keys = Object.keys(item);


        const tds = keys.map((key, index) => {
          // const tdKey = item.date + key
          const className = key == 'des' ? 'tdBorderRight' : ''
          if(key === 'list')  {
            return
          }
          return (
            <td key={key} className={styles[className]}>{item[key]}</td>

          )
        })

        // 构建告警点
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


        return (
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
      </div>
    )
  }
}
const mapDispatchToProps = (
  dispatch
) => {
  return {
    setTimeLineWidth: (gridWidth, minuteToWidth) => {
      dispatch({
        type: 'alertListTable/setTimeLineWidth',
        payload: {
          gridWidth,
          minuteToWidth
        }
      });
    }
  };
}
export default connect(({alertListTable}) => ({alertListTable}), mapDispatchToProps)(ListTimeTable)
