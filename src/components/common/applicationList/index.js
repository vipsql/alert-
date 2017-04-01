import React, { PropTypes, Component } from 'react'
import { Button, Spin, Switch } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { Link } from 'dva/router'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

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
      deleteClick,
      intl: {formatMessage}
    } = this.props

    let colsKey = []
    let theads = []

    const formatMessages = defineMessages({
        displayName: {
          id: 'alertApplication.List.displayName',
          defaultMessage: '应用显示名',
        },
        name: {
          id: 'alertApplication.List.application',
          defaultMessage: '应用名称',
        },
        createDate: {
          id: 'alertApplication.List.createDate',
          defaultMessage: '添加时间',
        },
        status: {
          id: 'alertApplication.List.onOff',
          defaultMessage: '是否开启',
        },
        operation: {
          id: 'alertApplication.List.actions',
          defaultMessage: '操作',
        },
        action_edit: {
          id: 'alertApplication.List.edit',
          defaultMessage: '编辑',
        },
        action_delete: {
          id: 'alertApplication.List.delete',
          defaultMessage: '删除',
        },
        noData: {
          id: 'alertList.noListData',
          defaultMessage: '暂无数据',
        },
    })
    
    columns.forEach( (item) => {
      const isOrder = item.order || false
      const width = item.width || 'auto'
      const orderTriangle = orderBy !== undefined && item['key'] == orderBy ? styles['orderTriang-active'] : undefined
      const orderTh_active = orderBy !== undefined && item['key'] == orderBy ? styles['orderTh-active'] : undefined

      colsKey.push(item['key'])
      
      theads.push(
        <th key={item.key} width={width}>
          {isOrder ? <span className={ orderType !== undefined ? classnames(styles.orderTh, orderTh_active) : styles.orderTh} data-key={item['key']} onClick={ orderByTittle }>{formatMessage({...formatMessages[item['key']]})}</span>
          : <FormattedMessage {...formatMessages[item['key']]} />}
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
    const getTds = (item, keys, itemIndex) => {
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
           <Link to={`alertConfig/alertApplication/applicationView/edit/${item['id']}`}><Button className={styles.editBtn} size='small'>{formatMessage({...formatMessages['action_edit']})}</Button></Link>
           &nbsp;&nbsp;
           {
             item['builtIn'] != 0 ?
             <Button size='small' className={styles.delBtn} disabled={item['status']} onClick={ () => {deleteClick(item)}}>{formatMessage({...formatMessages['action_delete']})}</Button>
             :
             undefined
           }
          </td>
        } 
        if(key == 'displayName') {
          td = <td key={key}>{data}</td>
        }
        tds.push(td)
      })
      tds.unshift(<td width="30" key='space-col-td'></td>)
      return tds
    }

    applicationData.length > 0 && applicationData.forEach( (item, index) => {
        const colorClass = index % 2 === 0 ? styles['even'] : styles['odd']
        const keys = colsKey
        const tds = getTds(item, keys, index)
        let commonTrs = []

        commonTrs.push(
            <tr key={item.id} className={colorClass}>
                {tds}
            </tr>
        )
        tbodyCon.push(commonTrs)
    })


    return(
      <div>
        <Spin spinning={isLoading}>
          <table className={styles.listTable}>
            <thead>
              <tr> 
                <th width='30' key='space-col'></th>
                {theads}
              </tr>
            </thead>
            <tbody>
              {
                applicationData.length > 0 ? tbodyCon :
                <tr>
                  <td colSpan={columns.length + 1} style={{textAlign: 'center'}}><FormattedMessage {...formatMessages['noData']} /></td>
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

export default injectIntl(applicationList)
