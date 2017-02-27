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
      checkAlert,
      loadMore
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

    if(isGroup){
      data.forEach( (item, index) => {
        const keys = colsKey
        // 这里每次都会执行 其实需要提出去
        const tds = keys.map((key) => {
          return (
            <td key={key}>{item.children[index][key]}</td>
          )
        })
        const childtrs = item.children.map( (childItem,index) => {
          const trKey = 'td' + index
          const tdKey = 'td' + index
          return (
              <tr key={trKey}>
                <td key={tdKey}><input type="checkbox" /></td>
                {tds}
              </tr>
          )
        } )
        childtrs.unshift(<tr className={styles.trGroup} key={index}><td colSpan={keys.length + 1}><span className={styles.expandIcon}>+</span>{item.classify}</td></tr>)
        tbodyCon.push(childtrs)

      } )

    }else{

      tbodyCon = data.length > 0 && data.map( (item, index) => {
        const keys = colsKey

        // 列是不固定的 需要抽取出来
        const tds = keys.map((key) => {
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

                break;
              default:

            }
          }
          return (
            <td key={key}>{data}</td>
          )
        })
        return (
          <tr key={item.id}>
            <td key={index}><input type="checkbox" data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlert}/></td>
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
