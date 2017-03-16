import React, { PropTypes, Component } from 'react'
import { Button, Spin, Switch } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'

class applicationList extends Component {
  constructor(){
    super()
  }
  render(){
    const {
      applicationData,
      columns,
      isLoading,
      orderUp,
      orderDown,
      orderBy,
      orderType,
      orderByTittle,
      switchClick,
      deleteClick
    } = this.props

    let colsKey = []
    let theads = []
    
    columns.forEach( (item) => {
      const isOrder = item.order || false
      const width = item.width || 'auto'
      const orderTriangle = orderBy !== undefined && item['key'] == orderBy ? styles['orderTriang-active'] : undefined
      const orderTh_active = orderBy !== undefined && item['key'] == orderBy ? styles['orderTh-active'] : undefined

      colsKey.push(item['key'])
      
      theads.push(
        <th key={item.key} width={width}>
          {isOrder ? <span className={ orderType !== undefined ? classnames(styles.orderTh, orderTh_active) : styles.orderTh} data-key={item['key']} onClick={ orderByTittle }>{item.title}</span>
          : `${item.title}`}
          {isOrder && 
            [<span className={ orderType !== undefined && orderType === 1 ? classnames(styles.orderTriangleUp, orderTriangle) : styles.orderTriangleUp} data-key={item['key']} key={1} onClick={ orderUp }></span>,
            <span className={ orderType !== undefined && orderType === 0 ? classnames(styles.orderTriangleDown, orderTriangle) : styles.orderTriangleDown} data-key={item['key']} key={0} onClick={ orderDown }></span>]}
        </th>
      )
    } )

    let tbodyCon = [];

    const formatDate = function(date){
      const d = new Date(date)

      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDay();
      let hours = d.getHours();
      let mins = d.getMinutes();

      hours = hours < 10 ? '0' + hours : hours
      mins = mins < 10 ? '0' + mins : mins


      return year + '/' + month + '/' + day + ' ' + hours + ':' + mins
    }

    // 生成每一列的参数
    const getTds = (item, keys) => {
      let tds = [];
      keys.forEach((key, index) => {
        let data = item[key];
        let td;
        if(key == 'createDate'){
          data = formatDate(data)
          td = <td key={key}>{data}</td>
        }
        if(key == 'name'){
          td = <td key={key}>{item['applyType']['name']}</td>
        }
        if(key == 'status'){
          switch (data) {
            case 0:
               data = false
              break;
            case 1:
               data = true
              break;
            default:
               data = false
              break;
          }
          td = <td key={key}><Switch checked={data} onChange={ (status) => {switchClick(item['id'], status)} }/></td>
        }
        if(key == 'operation') {
          td = <td key={key}>
           <Button size='small'>编辑</Button>
           &nbsp;&nbsp;
           <Button size='small' disabled={item['status']} onClick={ () => {deleteClick(item['id'])}}>删除</Button>
          </td>
        } 
        if(key == 'displayName') {
          td = <td key={key}>{data}</td>
        }
        tds.push(td)
      })
      tds.unshift(<td width="10" key='space-col-td'></td>)
      return tds
    }

    applicationData.length > 0 && applicationData.forEach( (item, index) => {
        const keys = colsKey
        const tds = getTds(item, keys)
        let commonTrs = []

        commonTrs.push(
            <tr key={item.id}>
                {tds}
            </tr>
        )
        tbodyCon.push(commonTrs)
    })


    return(
      <div>
        <Spin tip="加载中..." spinning={isLoading}>
          <table className={styles.listTable}>
            <thead>
              <tr> 
                <th width='10' key='space-col'></th>
                {theads}
              </tr>
            </thead>
            <tbody>
              {
                applicationData.length > 0 ? tbodyCon :
                <tr>
                  <td colSpan={columns.length + 1}>暂无数据</td>
                </tr>
              }
            </tbody>
          </table>
        </Spin>
      </div>
    )
  }
}

applicationList.defaultProps = {

}

applicationList.propTypes = { 
  
}

export default applicationList
