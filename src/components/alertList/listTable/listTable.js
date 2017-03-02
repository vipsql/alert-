import React, { PropTypes, Component } from 'react'
import { Button } from 'antd';
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
      detailClick
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

    theads.unshift(<th key="checkAll" width={60}><input type="checkbox" /></th>)
    let tbodyCon = [];

    // 生成每一列的参数
    const getTds = (item, keys) => {
      return keys.map((key) => {
        let data = item[key];
        if(key == 'lastOccurtime'){
          const date = new Date(data)
          data = `${date.getHours()}:${date.getMinutes()}`
        }
        if(key == 'lastTime'){
          data = `${Math.floor(data/(60*60*1000))}h`
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
        }
        return (
          key == 'typeName' ?
          <td key={key} className={ styles.tdBtn } data-id={item.id} onClick={detailClick} >{data}</td>
          :
          <td key={key}>{data}</td>
        )
      })
    }

    if(isGroup){
      data.forEach( (item, index) => {
        const keys = colsKey
        const childtrs = item.children !== undefined ? item.children.map( (childItem, index) => {
          
          const tds = getTds(childItem, keys)
          const trKey = 'td' + index
          const tdKey = 'td' + index
          return (
              <tr key={trKey}>
                <td key={tdKey}><input type="checkbox" data-id={childItem.id} data-all={JSON.stringify(childItem)} onClick={checkAlertFunc}/></td>
                {tds}
              </tr>
          )
        } ) : []
        childtrs.unshift(<tr className={styles.trGroup} key={index}><td colSpan={keys.length + 1}><span className={styles.expandIcon}>-</span>{item.classify}</td></tr>)
        tbodyCon.push(childtrs)

      } )

    }else{

      tbodyCon = data.length > 0 && data.children === undefined && data.map( (item, index) => {
        const keys = colsKey
        const tds = getTds(item, keys)
        
        return (
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
      })

    }


    return(
      <div>
        <table className={styles.listTable}>
          <thead>
            <tr>
              {theads}
            </tr>
          </thead>
          <tbody>
            {
              data.length > 0 ? tbodyCon :
              <tr>
              <td colSpan={columns.length + 1}>暂无数据</td>
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
