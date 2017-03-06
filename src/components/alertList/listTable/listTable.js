import React, { PropTypes, Component } from 'react'
import { Button } from 'antd';
import LevelIcon from '../../common/levelIcon/index.js'
import styles from '../index.less'

class ListTable extends Component {
  constructor(){
    super()
  }
  render(){
    const {
      isGroup,
      isShowMore,
      data,
      columns,
      checkAlertFunc,
      loadMore,
      checkAlert,
      detailClick,
      spreadChild,
      noSpreadChild,
      spreadGroup,
      noSpreadGroup
    } = this.props
    let colsKey = []
    
    const theads = columns.map( (item) => {
      const width = item.width || 'auto'
      colsKey.push(item['key'])
      return (
        <th key={item.key} width={width}>
          {item.title}
        </th>
      )
    } )

    // theads.unshift(
    //   <th key="checkAll" width={60}><input type="checkbox" /></th>
    // )
    let tbodyCon = [];

    // 生成每一列的参数
    const getTds = (item, keys) => {
      let tds = [];
      keys.forEach((key, index) => {
        let data = item[key];
        let td;
        if(index == 0){
          tds.push(
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
        if(key == 'lastOccurtime'){
          const date = new Date(data)
          data = `${date.getHours()}:${date.getMinutes()}`
          td = <td key={key}>{data}</td>
        }
        if(key == 'lastTime'){
          data = `${Math.floor(data/(60*60*1000))}h`
          td = <td key={key}>{data}</td>
        }
        if(key == 'status'){
          switch (data) {
            case 0:
              data = `新告警`
              break;
            case 40:
              data = `已确认`
              break;
            case 150:
              data = `处理中`
              break;
            case 255:
              data = `已解决`
              break;
            default:
              data
              break;
          }
          td = <td key={key}>{data}</td>
        }
        if(key == 'typeName') {
          td = <td key={key} className={ styles.tdBtn } data-id={item.id} onClick={detailClick} >{data}</td>
        } else {
          td = <td key={key}>{data}</td>
        }
        tds.push(td)
      })
      tds.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={
          item['severity'] == 10 ? 
              'tx' : item['severity'] == 20 ?
                  'gj' : item['severity'] == 30 ?
                      'cy' : item['severity'] == 40 ?
                          'zy' : item['severity'] == 50 ? 
                              'jj' : undefined
      }/></td>)
      return tds
    }

    // 生成每一列子告警的参数
    const getChildTds = (item, keys) => {
      let tds = [];
      keys.forEach((key, index) => {
        let data = item[key];
        let td;
        if(key == 'lastOccurtime'){
          const date = new Date(data.time)
          data = `${date.getHours()}:${date.getMinutes()}`
          td = <td key={key}>{data}</td>
        }
        if(key == 'lastTime'){
          data = `${Math.floor(data/(60*60*1000))}h`
          td = <td key={key}>{data}</td>
        }
        if(key == 'status'){
          switch (data) {
            case 0:
              data = `新告警`
              break;
            case 40:
              data = `已确认`
              break;
            case 150:
              data = `处理中`
              break;
            case 255:
              data = `已解决`
              break;
            default:
              data
              break;
          }
          td = <td key={key}>{data}</td>
        }
        if(key == 'typeName') {
          td = <td key={key} className={ styles.tdBtn } data-id={item.id} onClick={detailClick} >{data}</td>
        } else {
          td = <td key={key}>{data}</td>
        }
        tds.push(td)
      })
      tds.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={
          item['severity'] == 10 ? 
              'tx' : item['severity'] == 20 ?
                  'gj' : item['severity'] == 30 ?
                      'cy' : item['severity'] == 40 ?
                          'zy' : item['severity'] == 50 ? 
                              'jj' : undefined
      }/></td>)
      tds.unshift(<td key='space-col-td' colSpan="2"></td>)
      return tds
    }

    // 生成子告警行
    const genchildTrs = (childItem, childIndex, keys, item) => {
      
      const trKey = 'chTd' + childIndex
      const childTds = getChildTds(childItem, keys)
      
      return (
        <tr key={trKey} className={!item.isSpread && styles.hiddenChild}>
          {childTds}
        </tr>
      )
    }

    if(isGroup){
      data.forEach( (item, index) => {
        const keys = colsKey
        let childtrs = []
        let groupTitle = item.isGroupSpread === false ?
          (<tr className={styles.trGroup} key={index}>
            <td colSpan={keys.length + 3}>
              <span className={styles.expandIcon} data-classify={item.classify} onClick={spreadGroup}>+</span>
                {item.classify}
            </td>
          </tr>)
          :
          (<tr className={styles.trGroup} key={index}>
            <td colSpan={keys.length + 3}>
              <span className={styles.expandIcon} data-classify={item.classify} onClick={noSpreadGroup}>-</span>
                {item.classify}
            </td>
          </tr>)

        item.children !== undefined && item.children.forEach( (childItem, index) => {
          console.log(childItem)
          
          const tds = getTds(childItem, keys)

          // 如果有子告警
          let childs = []
          if(childItem.childrenAlert && item.isGroupSpread !== false){

            childs = childItem.childrenAlert.map ( (childAlertItem, childIndex) => {

              return genchildTrs(childAlertItem, childIndex, keys, childItem)

            })
          }else{
            childs = null
          }

          const trKey = 'td' + index
          const tdKey = 'td' + index
          childtrs.push(
              <tr key={trKey} className={!item.isGroupSpread && styles.hiddenChild}>
                <td key={tdKey}><input type="checkbox" data-id={childItem.id} data-all={JSON.stringify(childItem)} onClick={checkAlertFunc}/></td>
                {tds}
              </tr>
          )
          childtrs.push(childs)
        } )
        childtrs.unshift(groupTitle)
        tbodyCon.push(childtrs)

      } )

    }else{

      data.length > 0 && data.children === undefined && data.forEach( (item, index) => {
        const keys = colsKey
        const tds = getTds(item, keys)
        let commonTrs = []

        // 如果有子告警
        let childs = []
        if(item.childrenAlert){

          childs = item.childrenAlert.map ( (childItem, childIndex) => {

            return genchildTrs(childItem, childIndex, keys, item)

          })
        }else{
          childs = null
        }
        
        commonTrs.push(
          <tr key={item.id}>
            {
              Object.keys(checkAlert).length !== 0 ?
              <td key={index}><input type="checkbox" checked={checkAlert[item.id].checked} data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlertFunc}/></td>
              :
              undefined
            }
            {tds}
          </tr>
        )

        tbodyCon.push(commonTrs, childs)
      })

    }


    return(
      <div>
        <table className={styles.listTable}>
          <thead>
            <tr>
              <th key="checkAll" width={60}><input type="checkbox" /></th>
              <th width="20" key='space-col'></th>
              <th width='10'></th>
              {theads}
            </tr>
          </thead>
          <tbody>
            {
              data.length > 0 ? tbodyCon :
              <tr>
              <td colSpan={columns.length + 3}>暂无数据</td>
              </tr>
            }
          </tbody>
        </table>
        {isShowMore && <Button className={styles.loadMore} onClick={loadMore}>显示更多</Button>}
      </div>
    )
  }
}

export default ListTable
