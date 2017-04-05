import React, { PropTypes, Component } from 'react'
import { Button, Spin } from 'antd';
import LevelIcon from '../levelIcon/index.js'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

class ListTable extends Component {
  constructor(){
    super()
  }
  render(){
    const {
      sourceOrigin,
      isGroup,
      groupBy,
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
      noSpreadGroup,
      selectedAll,
      toggleSelectedAll,
      relieveClick,
      isLoading,
      orderUp,
      orderDown,
      orderBy,
      orderType,
      orderByTittle,
      intl: {formatMessage}
    } = this.props
    let colsKey = []
    let theads = []
    
    const formatMessages = defineMessages({
        entityName:{
          id: 'alertList.title.enityName',
          defaultMessage: '对象',
        },
        name: {
          id: 'alertList.title.name',
          defaultMessage: '告警名称',
        },
        source: {
          id: 'alertList.title.source',
          defaultMessage: '告警来源',
        },
        status:{
          id: 'alertList.title.status',
          defaultMessage: '告警状态',
        },
        description:{
          id: 'alertList.title.description',
          defaultMessage: '告警描述',
        },
        count:{
          id: 'alertList.title.count',
          defaultMessage: '次数',
        },
        lastTime:{
          id: 'alertList.title.lastTime',
          defaultMessage: '持续时间',
        },
        lastOccurTime:{
          id: 'alertList.title.lastOccurTime',
          defaultMessage: '最后发送时间',
        },
        showMore: {
          id: 'alertList.showMore',
          defaultMessage: '显示更多',
        },
        noData: {
          id: 'alertList.noListData',
          defaultMessage: '暂无数据',
        },
        Unknown: {
          id: 'alertList.unknown',
          defaultMessage: '未知',
        }
    })
    
    columns.forEach( (item) => {
      const isOrder = item.order || false
      //const width = item.width || 'auto'
      const orderTriangle = orderBy !== undefined && item['key'] == orderBy ? styles['orderTriang-active'] : undefined
      const orderTh_active = orderBy !== undefined && item['key'] == orderBy ? styles['orderTh-active'] : undefined

      colsKey.push(item['key'])
      
      theads.push(
        <th key={item.key}>
          {!isGroup && isOrder ? <span className={ orderType !== undefined ? classnames(styles.orderTh, orderTh_active) : styles.orderTh} data-key={item['key']} onClick={ orderByTittle }>{
              item.title === undefined ? formatMessage({...formatMessages[item['key']]}) : `${item.title}`
            }</span>
          : item.title === undefined ? <FormattedMessage {...formatMessages[item['key']]} /> : `${item.title}`}
          {!isGroup && isOrder && 
            [<span className={ orderType !== undefined && orderType === 1 ? classnames(styles.orderTriangleUp, orderTriangle) : styles.orderTriangleUp} data-key={item['key']} key={1} onClick={ orderUp }></span>,
            <span className={ orderType !== undefined && orderType === 0 ? classnames(styles.orderTriangleDown, orderTriangle) : styles.orderTriangleDown} data-key={item['key']} key={0} onClick={ orderDown }></span>]}
        </th>
      )
    } )

    let tbodyCon = [];

    const formatDate = function(date){
      const d = new Date(date)
      let hours = d.getHours()
      let mins = d.getMinutes()

      hours = hours < 10 ? '0' + hours : hours
      mins = mins < 10 ? '0' + mins : mins


      return hours + ':' + mins
    }

    // 生成每一列的参数
    const getTds = (item, keys) => {
      let tds = [];
      keys.forEach((key, index) => {
        let data = item[key];
        let td;
        if(sourceOrigin !== 'alertQuery' && index == 0){
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
        if(key == 'lastOccurTime'){
          const date = new Date(data)
          data = formatDate(data)
          td = <td key={key}>{data}</td>
        }
        if(key == 'lastTime'){
          // 如果小于1小时 显示分钟
          const hours = 60*60*1000
          
          if(data < hours){
            
            data = `${+(data/(60*1000)).toFixed(1)}m`
          }else{
            data = `${+(data/hours).toFixed(1)}h`
          }
          td = <td key={key}>{data}</td>
        }
        if(key == 'status'){
          switch (data) {
            case 0:
              data = window['_status']['0']
              break;
            case 40:
              data = window['_status']['40']
              break;
            case 150:
              data = window['_status']['150']
              break;
            case 255:
              data = window['_status']['255']
              break;
            default:
              data
              break;
          }
          td = <td key={key}>{data}</td>
        }
        
        const relieveIcon = classnames(
          'iconfont',
          'icon-zaixian',
          styles.relieveIcon
        )
        if(key == 'name') {
          td = <td key={key} title={data} className={ styles.tdBtn } data-id={item.id} onClick={detailClick} >
            {data}
            {
              sourceOrigin !== 'alertQuery' && item['hasChild'] === true ?
              <span className={relieveIcon} data-all={JSON.stringify(item)} onClick={relieveClick}></span>
              :
              undefined
            }
          </td>
        } else if (key == 'description' || key == 'entityName'){
           td = <td key={key} title={data}>{data}</td>
        } else {
           td = <td key={key}>{data}</td>
        }
        tds.push(td)
      })
      tds.unshift(<td width="20" key='icon-col-td' colSpan={sourceOrigin !== 'alertQuery' ? '1' : '2'} ><LevelIcon extraStyle={sourceOrigin === 'alertQuery' && styles.alertQueryIcon} iconType={item['severity']}/></td>)
      return tds
    }

    // 生成每一列子告警的参数
    const getChildTds = (item, keys) => {
      let tds = [];
      keys.forEach((key, index) => {
        let data = item[key];
        let td;
        if(key == 'lastOccurTime'){
          const date = new Date(data)
          data = formatDate(data)
          td = <td key={key}>{data}</td>
        }
        if(key == 'lastTime'){
          // 如果小于1小时 显示分钟
          const hours = 60*60*1000
          
          if(data < hours){
            
            data = `${+(data/(60*1000)).toFixed(1)}m`
          }else{
            data = `${+(data/hours).toFixed(1)}h`
          }
          
          
          td = <td key={key}>{data}</td>
        }
        if(key == 'status'){
          switch (data) {
            case 0:
              data = window['_status']['0']
              break;
            case 40:
              data = window['_status']['40']
              break;
            case 150:
              data = window['_status']['150']
              break;
            case 255:
              data = window['_status']['255']
              break;
            default:
              data
              break;
          }
          td = <td key={key}>{data}</td>
        }
        if(key == 'name') {
          td = <td key={key} title={data} className={ styles.tdBtn } data-id={item.id} onClick={detailClick} >{data}</td>
        } else if (key == 'description' || key == 'entityName'){
          td = <td key={key} title={data}>{data}</td>
        } else {
          td = <td key={key}>{data}</td>
        }
        tds.push(td)
      })
      tds.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={item['severity']}/></td>)
      tds.unshift(<td key='space-col-td' colSpan="2"></td>)
      return tds
    }

    // 生成子告警行
    const genchildTrs = (childItem, childIndex, keys, item, isGroup) => {
      
      const trKey = 'chTd' + childIndex
      const childTds = getChildTds(childItem, keys)
      
      return (
        <tr key={trKey} className={!item.isSpread ? styles.hiddenChild : !isGroup ? styles.noSpread : styles.groupSpread}>
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
                  {
                    groupBy && groupBy == 'status' ?
                    window['_status'][item.classify]
                    :
                    item.classify ? item.classify : <FormattedMessage {...formatMessages['Unknown']} />
                  }
              </td>
            </tr>)
            :
            (<tr className={styles.trGroup} key={index}>
              <td colSpan={keys.length + 3}>
                <span className={styles.expandIcon} data-classify={item.classify} onClick={noSpreadGroup}>-</span>
                  {
                    groupBy && groupBy == 'status' ?
                    window['_status'][item.classify]
                    :
                    item.classify ? item.classify : <FormattedMessage {...formatMessages['Unknown']} />
                  }
              </td>
            </tr>)

          item.children !== undefined && item.children.forEach( (childItem, index) => {
            
            const tds = getTds(childItem, keys)

            // 如果有子告警
            let childs = []
            if(sourceOrigin !== 'alertQuery' && childItem.childrenAlert && item.isGroupSpread !== false){

              childs = childItem.childrenAlert.map ( (childAlertItem, childIndex) => {

                return genchildTrs(childAlertItem, childIndex, keys, childItem, isGroup)

              })
            }else{
              childs = null
            }

            const trKey = 'td' + index
            const tdKey = 'td' + index
            childtrs.push(
                <tr key={trKey} className={item.isGroupSpread !== undefined && !item.isGroupSpread ? styles.hiddenChild : styles.groupSpread}>
                  {
                    sourceOrigin !== 'alertQuery' ?
                    <td key={tdKey} className={styles.checkstyle}><input type="checkbox" checked={checkAlert[childItem.id].checked} data-id={childItem.id} data-all={JSON.stringify(childItem)} onClick={checkAlertFunc}/></td>
                    :
                    undefined
                  }
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
        if(sourceOrigin !== 'alertQuery' && item.childrenAlert){

          childs = item.childrenAlert.map ( (childItem, childIndex) => {

            return genchildTrs(childItem, childIndex, keys, item, isGroup)

          })
        }else{
          childs = null
        }
        commonTrs.push(
          <tr key={item.id} className={styles.noSpread}>
            {
              sourceOrigin !== 'alertQuery' && Object.keys(checkAlert).length !== 0 ?
              <td key={index} className={styles.checkstyle}><input type="checkbox" checked={checkAlert[item.id].checked} data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlertFunc}/></td>
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
        <Spin spinning={isLoading}>
          <table className={styles.listTable}>
            <thead>
              <tr>
                {
                  sourceOrigin !== 'alertQuery' ?
                  <th key="checkAll" width={48} className={styles.checkstyle}><input type="checkbox" checked={selectedAll} onChange={toggleSelectedAll}/></th>
                  :
                  undefined
                }
                <th width="20" key='space-col'></th>
               
                  <th width='10'></th>
               
                {theads}
              </tr>
            </thead>
            <tbody>
              {
                data.length > 0 ? tbodyCon :
                <tr>
                  <td colSpan={columns.length + 3} style={{textAlign: 'center'}}><FormattedMessage {...formatMessages['noData']} /></td>
                </tr>
              }
            </tbody>
          </table>
        </Spin>
        {isShowMore && <div className={styles.loadMore}><Button onClick={loadMore}><FormattedMessage {...formatMessages['showMore']} /></Button></div>}
      </div>
    )
  }
}

ListTable.defaultProps = {
  sourceOrigin: 'alertMange',
  checkAlertFunc: () => {},
  spreadChild: () => {},
  noSpreadChild: () => {},
  toggleSelectedAll: () => {},
  relieveClick: () => {},
}

ListTable.propTypes = { 
  sourceOrigin: React.PropTypes.string.isRequired,
}

export default injectIntl(ListTable)
