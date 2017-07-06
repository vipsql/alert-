import React, { PropTypes, Component } from 'react'
import { Button, Spin, Popover } from 'antd';
import LevelIcon from '../levelIcon/index.js'
import Animate from 'rc-animate'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import $ from 'jquery'

class ListTable extends Component {
  constructor() {
    super()
  }
  componentDidMount() {
    this._getTotalScrollHeight();
    this._setAutoLoadMore();
    this.scrollHeight = this._getTotalScrollHeight();
  }

  componentDidUpdate() {
    clearTimeout(this.autoLoad);
    setTimeout(() => {
      this.scrollHeight = this._getTotalScrollHeight();
      this.isLoadingMore = false;
    }, 300)
  }

  componentWillUnMount() {
    clearTimeout(this.autoLoad);
    this._cancelAutoLoadMore();
  }

  _setAutoLoadMore() {
    $(this.props.target).scroll((e) => {
      const $target = $(e.target);
      if ($target.scrollTop() + 10 + $target.height() > this.scrollHeight && this.props.isShowMore && !this.isLoadingMore) {
        this.isLoadingMore = true;
        this.autoLoad = setTimeout(() => {
          this.props.loadMore();
        }, 0)
      }
    })
  }

  _cancelAutoLoadMore() {
    $(this.props.target).unbind("scroll");
  }

  // 获取可滚动的区域总高度
  _getTotalScrollHeight() {
    const $target = $(this.props.target);
    let totalHeight = 0;
    $target.children().each((index, ele) => {
      totalHeight += $(ele).context.clientHeight;
    })
    return totalHeight;
  }

  render() {
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
    let colsKey = []
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

    columns.forEach((item) => {
      const isOrder = item.order || false
      //const width = item.width || 'auto'
      const orderTriangle = orderBy !== undefined && item['key'] == orderBy ? styles['orderTriang-active'] : undefined
      const orderTh_active = orderBy !== undefined && item['key'] == orderBy ? styles['orderTh-active'] : undefined

      colsKey.push(item['key'])

      theads.push(
        <th key={item.key}>
          {
            !isGroup && isOrder ?
              <span className={orderType !== undefined ? classnames(styles.orderTh, orderTh_active) : styles.orderTh} data-key={item['key']} onClick={orderByTittle}>
                {item.title === undefined ? formatMessage({ ...formatMessages[item['key']] }) : `${item.title}`}
              </span>
              : item.title === undefined ? <FormattedMessage {...formatMessages[item['key']]} /> : `${item.title}`
          }
          {
            !isGroup && isOrder &&
            [
              <span className={orderType !== undefined && orderType === 1 ? classnames(styles.orderTriangleUp, orderTriangle) : styles.orderTriangleUp} data-key={item['key']} key={1} onClick={orderUp}></span>,
              <span className={orderType !== undefined && orderType === 0 ? classnames(styles.orderTriangleDown, orderTriangle) : styles.orderTriangleDown} data-key={item['key']} key={0} onClick={orderDown}></span>
            ]
          }
        </th>
      )
    })

    let tbodyCon = [];

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
    const getTds = (item, keys, target = 'parent') => {
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
            <td key='sourceAlert'>
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
            td = (<td key={key} title={data} className={styles.tdBtn} data-id={item.id} onClick={detailClick} >
              {data}
              {
                sourceOrigin !== 'alertQuery' && item['hasChild'] === true && target === 'parent' ?
                  <span className={relieveIcon} data-all={JSON.stringify(item)} onClick={relieveClick}></span>
                  :
                  undefined
              }
            </td>)
            break;
          case 'orderFlowNum':
            if (typeof item['itsmDetailUrl'] != 'undefined') {
              td = <td key={key} title={data}><a target='_blank' href={item['itsmDetailUrl']}>{data}</a></td>
            } else {
              td = <td key={key} title={data}><a href='javascript:;' onClick={orderFlowNumClick} data-flow-num={data} data-id={item['id']}>{data}</a></td>
            }
            break;
          case 'notifyList':
            if (item['isNotify'] && data && data.length > 0) {
              let temp = data.map((key) => {
                return window.__alert_appLocaleData.messages[`alertList.notifyList.${key}`]
              })
              data = temp.join(' / ')
            }
            td = <td key={key}>{data}</td>
            break;
          case 'firstOccurTime':
            td = <td key={key}>{formatDate(new Date(data))}</td>
            break;
          case 'lastOccurTime':
            td = <td key={key}>{formatDate(new Date(data))}</td>
            break;
          case 'lastTime':
            // 如果小于1小时 显示分钟
            let hours = 60 * 60 * 1000
            if (data < hours) {
              td = <td key={key}>{`${+(data / (60 * 1000)).toFixed(1)}m`}</td>
            } else {
              td = <td key={key}>{`${+(data / hours).toFixed(1)}h`}</td>
            }
            break;
          case 'status':
            td = <td key={key}>{window['_status'][Number(data)] || data}</td>
            break;
          case 'tags':
            if (data && data.length > 0) {
              td = <td key={key} className={styles.tagsKey}>
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
              td = <td key={key}>{data}</td>
            }
            break;
          case 'count':
            td = <td key={key} title={data}><a href="javascript:;" data-id={item.id} data-name={item.name} onClick={showAlertOrigin}>{data}</a></td>
            break;
          default:
            td = <td key={key} title={data}>{data}</td>
            break;
        }
        tds.push(td)
      })
      if (target === 'parent') {
        tds.unshift(<td width="20" key='icon-col-td' colSpan={sourceOrigin !== 'alertQuery' ? '1' : '2'} ><LevelIcon extraStyle={sourceOrigin === 'alertQuery' && styles.alertQueryIcon} iconType={item['severity']} /></td>)
      } else {
        tds.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={item['severity']} /></td>)
        tds.unshift(<td key='space-col-td' colSpan="2"></td>)
      }
      return tds
    }

    // 生成子告警行
    const getchildTrs = (childItem, childIndex, keys, item, isGroup) => {

      const trKey = childItem.id || 'chTd' + childIndex
      const childTds = getTds(childItem, keys, 'child')

      return (
        <tr key={trKey} className={!item.isSpread ? styles.hiddenChild : !isGroup ? styles.noSpread : styles.groupSpread}>
          {childTds}
        </tr>
      )
    }

    if (isGroup) {
      data.forEach((item, index) => {
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
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][item.classify]
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
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][item.classify]
                    :
                    item.classify ? item.classify : <FormattedMessage {...formatMessages['Unknown']} />
              }
            </td>
          </tr>)

        item.children !== undefined && item.children.forEach((childItem, itemIndex) => {

          const tds = getTds(childItem, keys)

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
            <tr key={trKey} className={item.isGroupSpread !== undefined && !item.isGroupSpread ? styles.hiddenChild : styles.groupSpread}>
              {
                sourceOrigin !== 'alertQuery' ?
                  <td key={tdKey} className={styles.checkstyle}><input type="checkbox" checked={checkAlert[childItem.id].checked} data-id={childItem.id} data-all={JSON.stringify(childItem)} onClick={checkAlertFunc} /></td>
                  :
                  undefined
              }
              {tds}
            </tr>
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
          <tr key={item.id} className={styles.noSpread}>
            {
              sourceOrigin !== 'alertQuery' && Object.keys(checkAlert).length !== 0 ?
                <td key={index} className={styles.checkstyle}>
                  <input type="checkbox" checked={checkAlert[item.id].checked} data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlertFunc} />
                </td>
                :
                undefined
            }
            {tds}
          </tr>
        )

        tbodyCon.push(commonTrs, childs)
      })

    }

    // const loadingIcon = classnames({})

    return (
      <div>
        <Spin spinning={isLoading}>
          <table className={styles.listTable}>
            <thead>
              <tr>
                {
                  sourceOrigin !== 'alertQuery' ?
                    <th key="checkAll" width={48} className={styles.checkstyle}><input type="checkbox" onClick={handleSelectAll} checked={selectedAll} /></th>
                    :
                    undefined
                }
                <th width="20" key='space-col'></th>

                <th width='10'></th>

                {theads}
              </tr>
            </thead>
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
                  <tr>
                    <td colSpan={columns.length + 3} style={{ textAlign: 'center' }}><FormattedMessage {...formatMessages['noData']} /></td>
                  </tr>
              }
            </Animate>
          </table>
        </Spin>
        {isShowMore && <Spin size="large" spinning={isLoading}><div className={styles.loadMore}><Button onClick={loadMore}><FormattedMessage {...formatMessages['showMore']} /></Button></div></Spin>}
      </div>
    )
  }
}

ListTable.defaultProps = {
  sourceOrigin: 'alertMange',
  target: 'div#topMain', // 用于设置参考对象
  checkAlertFunc: () => { },
  spreadChild: () => { },
  noSpreadChild: () => { },
  handleSelectAll: () => { },
  relieveClick: () => { },
  orderFlowNumClick: () => { }
}

ListTable.propTypes = {
  sourceOrigin: React.PropTypes.string.isRequired,
}

export default injectIntl(ListTable)
