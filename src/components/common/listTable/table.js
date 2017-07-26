import React, { PropTypes, Component } from 'react'
import { Button, Spin, Popover, Checkbox } from 'antd';
import LevelIcon from '../levelIcon/index.js'
import Animate from 'rc-animate'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import $ from 'jquery'
import WrapableTr from './wrapableTr'
import TopFixedArea from './topFixedArea'
import ScrollBar from './scrollBar'
import Theads from './theads.js'

class Table extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {

  }

  componentDidUpdate(oldProps) {

  }

  componentWillUnMount() {
    clearTimeout(this.autoLoad);
    this._cancelAutoLoadMore();
  }

  render() {
    const {
      sourceOrigin,
      isGroup,
      groupBy,
      data,
      columns,
      checkAlertFunc,
      checkAlert,
      detailClick,
      spreadChild,
      noSpreadChild,
      spreadGroup,
      noSpreadGroup,
      selectedAll,
      handleSelectAll,
      relieveClick,
      orderFlowNumClick,
      showAlertOrigin,
      isLoading,
      orderUp,
      orderDown,
      orderBy,
      orderType,
      orderByTittle,
      intl: { formatMessage }
    } = this.props
    let colsKey = columns.map((item) => item['key'])
    let theads = []

    const formatMessages = defineMessages({
      entityName: {
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
      status: {
        id: 'alertList.title.status',
        defaultMessage: '告警状态',
      },
      description: {
        id: 'alertList.title.description',
        defaultMessage: '告警描述',
      },
      count: {
        id: 'alertList.title.count',
        defaultMessage: '次数',
      },
      classCode: {
        id: 'alertList.title.classCode',
        defaultMessage: '资源类型',
      },
      tags: {
        id: 'alertList.title.tags',
        defaultMessage: '标签',
      },
      lastTime: {
        id: 'alertList.title.lastTime',
        defaultMessage: '持续时间',
      },
      lastOccurTime: {
        id: 'alertList.title.lastOccurTime',
        defaultMessage: '最后发送时间',
      },
      firstOccurTime: {
        id: 'alertList.title.firstOccurTime',
        defaultMessage: '首次发生时间',
      },
      entityAddr: {
        id: 'alertList.title.entityAddr',
        defaultMessage: 'IP地址',
      },
      orderFlowNum: {
        id: 'alertList.title.orderFlowNum',
        defaultMessage: '关联工单',
      },
      notifyList: {
        id: 'alertList.title.notifyList',
        defaultMessage: '是否分享',
      },
      suppressionFlag: {
        id: 'alertList.title.suppressionFlag',
        defaultMessage: '是否被抑制'
      },
      suppressionYesFlag: {
        id: 'alertList.title.suppressionFlag.yes',
        defaultMessage: '已被抑制'
      },
      showMore: {
        id: 'alertList.showMore',
        defaultMessage: '显示更多',
      },
      noData: {
        id: 'alertList.noListData',
        defaultMessage: '暂无数据',
      },
      owner: {
        id: 'alertDetail.owner',
        defaultMessage: '负责人'
      },
      Unknown: {
        id: 'alertList.unknown',
        defaultMessage: '未知',
      }
    })

    let tbodyCon = [];
    let fixedTbodyCon = [];
    const formatDate = function (time) {
      const d = new Date(time);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let date = d.getDate();
      let hours = d.getHours();
      let mins = d.getMinutes();

      hours = hours < 10 ? '0' + hours : hours
      mins = mins < 10 ? '0' + mins : mins


      return year + '/' + month + '/' + date + ' ' + hours + ':' + mins
    }

    // 生成每一列的参数
    // 生成一行
    const getTds = (item, keys, target = 'parent', classify) => {
      let tds = [];
      const relieveIcon = classnames(
        'iconfont',
        'icon-zaixian',
        styles.relieveIcon
      )
      keys.forEach((key, index) => {
        let data = item[key];
        let td;
        if (sourceOrigin !== 'alertQuery' && target === 'parent' && index == 0) {
          tds.push(
            <td key='sourceAlert' className={styles.moreLittle}>
              {
                item['hasChild'] === true
                  ? item['isSpread'] === true
                    ? <span className={styles.triangleUp} data-id={item.id} onClick={noSpreadChild}></span>
                    : <span className={styles.triangleDown} data-id={item.id} onClick={spreadChild}></span>
                  : undefined
              }
            </td>
          )
        }
        switch (key) {
          case 'name':
            td = (<td key={key} title={data} className={styles.tdBtn} data-id={item.id} data-no-need-wrap={true} onClick={detailClick} >
              {data}
              {
                sourceOrigin !== 'alertQuery' && item['hasChild'] === true && target === 'parent' ?
                  <span className={relieveIcon} data-id={classify ? JSON.stringify({classify: classify, id: item.id}) : JSON.stringify({id: item.id})} onClick={relieveClick}></span>
                  :
                  undefined
              }
            </td>)
            break;
          case 'orderFlowNum':
            if (typeof item['itsmDetailUrl'] != 'undefined') {
              td = <td key={key} title={data} style={{ width: item.isFixed?'150px': undefined }}><a target='_blank' href={item['itsmDetailUrl']}>{data}</a></td>
            } else {
              td = <td key={key} title={data} style={{ width: item.isFixed?'150px': undefined }}><a href='javascript:;' onClick={orderFlowNumClick} data-flow-num={data} data-id={item['id']}>{data}</a></td>
            }
            break;
          case 'owner':
            const ownerName = item['ownerName'];
            td = <td key={key} title={ownerName} style={{ width: item.isFixed?'150px': undefined }}>{ownerName}</td>
            break;
          case 'notifyList':
            if (item['isNotify'] && data && data.length > 0) {
              let temp = data.map((key) => {
                return window.__alert_appLocaleData.messages[`alertList.notifyList.${key}`]
              })
              data = temp.join(' / ')
            }
            td = <td key={key} style={{ width: item.isFixed?'150px': undefined }}>{data}</td>
            break;
          case 'firstOccurTime':
            td = <td key={key} style={{ width: item.isFixed?'150px': undefined }}>{formatDate(new Date(data))}</td>
            break;
          case 'lastOccurTime':
            td = <td key={key} style={{ width: item.isFixed?'150px': undefined }}>{formatDate(new Date(data))}</td>
            break;
          case 'lastTime':
            // 如果小于1小时 显示分钟
            let hours = 60 * 60 * 1000
            if (data < hours) {
              td = <td key={key} style={{ width: item.isFixed?'150px': undefined }}>{`${+(data / (60 * 1000)).toFixed(1)}m`}</td>
            } else {
              td = <td key={key} style={{ width: item.isFixed?'150px': undefined }}>{`${+(data / hours).toFixed(1)}h`}</td>
            }
            break;
          case 'status':
            td = <td key={key} style={{ width: item.isFixed?'150px': undefined }}>{window['_status'][Number(data)] || data}</td>
            break;
          case 'tags':
            if (data && data.length > 0) {
              td = <td key={key} className={styles.tagsKey} style={{ width: item.isFixed?'200px': undefined }}>
                {/*<Popover placement='top' overlayClassName={styles.popover} trigger="hover" mouseEnterDelay={0.5} content={
                        <div>
                          {data.map( (item, index) => { return <p key={item.key}>{`${item.keyName}${item.value ? ` : ${item.value}` : undefined}`}</p>})}
                        </div>
                      } >*/}
                {
                  data.map(tag => {
                    const { key, keyName, value } = tag;
                    if (key == 'severity' || key == 'status') {
                      return <span key={JSON.stringify({ key, value })} className={styles.tag}>{`${keyName} : ` + window[`_${key}`][value]}</span>
                    } else if (value == '') {
                      return <span key={JSON.stringify({ key, value })} className={styles.tag}>{keyName}</span>
                    } else {
                      return <span key={JSON.stringify({ key, value })} className={styles.tag}>{`${keyName} : ${value}`}</span>
                    }
                  })
                }
                {/*</Popover>*/}
              </td>
            } else {
              td = <td key={key} style={{ width: item.isFixed?'150px': undefined }}>{data}</td>
            }
            break;
          case 'count':
            td = <td key={key} title={data} style={{ width: item.isFixed?'150px': undefined }}><a href="javascript:;" data-id={item.id} data-no-need-wrap={true} data-name={item.name} onClick={showAlertOrigin}>{data}</a></td>
            break;
          case 'suppressionFlag':
            td = <td key={key} title={data} style={{ width: item.isFixed?'150px': undefined }}>{data ? <FormattedMessage { ...(formatMessages['suppressionYesFlag']) } /> : ''}</td>
            break;
          default:
            td = <td key={key} title={data} style={{ width: item.isFixed?'150px': undefined }}>{data}</td>
            break;
        }
        tds.push(td)
      })
      if (target === 'parent') {
        tds.unshift(<td className={sourceOrigin !== 'alertQuery' ? styles.moreLittle : styles.little} style={{ width: item.isFixed?'20px': undefined }} width="20" key='icon-col-td' colSpan={sourceOrigin !== 'alertQuery' && !isGroup ? '1' : '2'} ><LevelIcon extraStyle={sourceOrigin === 'alertQuery' && styles.alertQueryIcon} iconType={item['severity']} /></td>)
      } else {
        tds.unshift(<td className={styles.moreLittle} width="20" style={{ width: item.isFixed?'25px': undefined }} key='icon-col-td'><LevelIcon iconType={item['severity']} /></td>)
        tds.unshift(<td className={styles.moreLittle} style={{ width: item.isFixed?'25px': undefined }} key='space-col-td'></td>)
      }
      return tds
    }

    // 生成子告警行
    const getchildTrs = (childItem, childIndex, keys, item, isGroup) => {

      const trKey = childItem.id || 'chTd' + childIndex
      const childTds = getTds(childItem, keys, 'child')

      return (
        <WrapableTr trId={trKey} key={trKey} className={!item.isSpread ? styles.hiddenChild : !isGroup ? styles.noSpread : styles.groupSpread}>
          {childTds}
        </WrapableTr>
      )
    }

    if (isGroup) {
      data.forEach((item, index) => {
        const keys = colsKey
        let childtrs = []
        //console.log(trKey, "isGroup");
        let groupTitle = item.isGroupSpread === false ?
          (<WrapableTr className={styles.trGroup} key={index}>
            <td colSpan={keys.length + 3}>
              <span className={styles.expandIcon} data-classify={item.classify} onClick={spreadGroup}>+</span>
              {
                groupBy && groupBy == 'status' ?
                  window['_status'][item.classify]
                  :
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][item.classify]
                    :
                    item.classify ? item.classify : <FormattedMessage {...formatMessages['Unknown']} />
              }
            </td>
          </WrapableTr>)
          :
          (<WrapableTr className={styles.trGroup} key={index}>
            <td colSpan={keys.length + 3}>
              <span className={styles.expandIcon} data-classify={item.classify} onClick={noSpreadGroup}>-</span>
              {
                groupBy && groupBy == 'status' ?
                  window['_status'][item.classify]
                  :
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][item.classify]
                    :
                    item.classify ? item.classify : <FormattedMessage {...formatMessages['Unknown']} />
              }
            </td>
          </WrapableTr>)

        item.children !== undefined && item.children.forEach((childItem, itemIndex) => {

          const tds = getTds(childItem, keys, _, item.classify)

          // 如果有子告警
          let childs = []
          if (sourceOrigin !== 'alertQuery' && childItem.childrenAlert && item.isGroupSpread !== false) {

            childs = childItem.childrenAlert.map((childAlertItem, childIndex) => {

              return getchildTrs(childAlertItem, childIndex, keys, childItem, isGroup)

            })
          } else {
            childs = null
          }
          const trKey = childItem.id || `tr_${index}_${itemIndex}`
          const tdKey = childItem.id || `td_${index}_${itemIndex}`
          childtrs.push(
            <WrapableTr key={trKey} className={item.isGroupSpread !== undefined && !item.isGroupSpread ? styles.hiddenChild : styles.groupSpread}>
              {
                //<input type="checkbox" checked={checkAlert[childItem.id].checked} data-id={childItem.id} data-all={JSON.stringify(childItem)} onClick={checkAlertFunc} />
                sourceOrigin !== 'alertQuery' ?
                  <td key={tdKey} className={classnames(styles.checkstyle, styles.little)}><Checkbox checked={checkAlert[childItem.id].checked} data-id={childItem.id} data-no-need-wrap={true} onClick={checkAlertFunc} /></td>
                  :
                  undefined
              }
              {tds}
            </WrapableTr>
          )
          childtrs.push(childs)
        })
        childtrs.unshift(groupTitle)
        tbodyCon.push(childtrs)

      })

    } else {

      data.length > 0 && data.children === undefined && data.forEach((item, index) => {

        const keys = colsKey
        const tds = getTds(item, keys)
        let commonTrs = []

        // 如果有子告警
        let childs = []
        if (sourceOrigin !== 'alertQuery' && item.childrenAlert) {

          childs = item.childrenAlert.map((childItem, childIndex) => {

            return getchildTrs(childItem, childIndex, keys, item, isGroup)

          })
        } else {
          childs = null
        }

        commonTrs.push(
          <WrapableTr trId={ item.id } key={item.id} className={classnames(styles.noSpread)}>
            {
              //<input type="checkbox" checked={checkAlert[item.id].checked} data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlertFunc} />
              sourceOrigin !== 'alertQuery' && Object.keys(checkAlert).length !== 0 ?
                <td className={classnames(styles.checkstyle, styles.little)} style={{ width: item.isFixed?'50px': undefined }}>
                  <Checkbox checked={checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} />
                </td>
                :
                undefined
            }
            {tds}
          </WrapableTr>
        )

        tbodyCon.push(commonTrs, childs)
      })

    }

    // const loadingIcon = classnames({})

    return (
      <table className={styles.listTable}>
        <Theads columns={columns}
          sourceOrigin={sourceOrigin}
          isGroup={isGroup}
          columns={columns}
          selectedAll={selectedAll}
          handleSelectAll={handleSelectAll}
          orderUp={orderUp}
          orderDown={orderDown}
          orderBy={orderBy}
          orderType={orderType}
          orderByTittle={orderByTittle}
        />
        <Animate
          transitionName="fade"
          component='tbody'
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {
            data.length > 0 ?
              tbodyCon
              :
              <WrapableTr>
                <td colSpan={columns.length + 3} style={{ textAlign: 'center' }}>{ this.props.isShowNoDataTip?<FormattedMessage {...formatMessages['noData']} />:undefined }</td>
              </WrapableTr>
          }
        </Animate>
      </table >
    )
  }
}

Table.defaultProps = {
  target: 'div#topMain', // 用于设置参考对象
  isShowNoDataTip: true, // 是否显示“无数据”状态的提示
  checkAlertFunc: () => { },
  spreadChild: () => { },
  noSpreadChild: () => { },
  handleSelectAll: () => { },
  relieveClick: () => { },
  orderFlowNumClick: () => { }
}

Table.propTypes = {
  sourceOrigin: PropTypes.string.isRequired
}

export default injectIntl(Table)
