import React, { PropTypes, Component } from 'react'
import { Button, Table } from 'antd';
import styles from './index.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { classnames } from '../../../utils'
import $ from 'jquery'

class AlertOriginSlider extends Component {
  componentWillMount() {
    this.headerHeight = 30;
    this.totalTipHeight = 31;
    this.paginationHeight = 51;
    this.thHeight = 80;
  }

  componentDidMount() {
    this.tableContentHeight = this._computerTableContentHeight();
    this._setAutoHide();
    this._setAutoTableHeight();
  }

  componentWillReceiveProps() {
    this.tableContentHeight = this._computerTableContentHeight();
  }
  
  componentWillUnmount() {
    this._cancelAutoHide();
  }

  // 窗口改变大小后自动设置Table可视高度
  _setAutoTableHeight() {
    $(window).resize(() => {
      console.log("onresize")
      this.tableContentHeight = this._computerTableContentHeight();
      this.setState({});
    })
  }

  _cancelAutoTableHeight() {
    $(window).unbind("resize");
  }

  // 动态计算表格应该占据的高度
  _computerTableContentHeight() {
    const ele = document.getElementById("alertOriginSlider");
    if(ele) {
      const totalHeight = ele.offsetHeight;
      const tableContentHeight = totalHeight - this.headerHeight - this.totalTipHeight - this.paginationHeight - this.thHeight;
      return tableContentHeight;
    } else {
      return 0;
    }
  }

  // 设置当鼠标点击不处于本区域时隐藏右侧滑动栏的全局事件
  _setAutoHide() {
      $(window.document.body).on("click", (e) => {
        const $target = $(e.target);
        const $toCloseSlider = $target.closest("div#alertOriginSlider");

        // 如果点击的组件补上下拉框选项或者不在弹出框上或者不在右侧滑动栏上，则隐藏右侧滑动栏
        if($toCloseSlider.length == 0 && this.props.visible) {
            this.props.onClose();
        }
      })
  }

  // 接触当鼠标点击不处于本区域时隐藏右侧滑动栏的全局事件
  _cancelAutoHide() {
      $(window.document.body).unbind("click");
  }

  render() {
    const { onClose, alertOrigin, currentAlertDetail={}, onPageChange, visible, loading, intl: {formatMessage} } = this.props;
    const localeMessage = defineMessages({
      occurTime: {
        id: "alertList.title.occurTime",
        defaultMessage: "发生时间"
      },
      entityName: {
        id: "alertList.title.enityName",
        defaultMessage: "对象"
      },
      entityAddress: {
        id: "alertList.title.entityAddr",
        defaultMessage: "IP地址"
      },
      description: {
        id: "alertList.title.description",
        defaultMessage: "告警描述"
      },
      alertTimesDescription: {
        id: "alertList.detailHistory.alertTimesDescription",
        defaultMessage: "累计发生告警次数{ times }次"
      }
    })

    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux',
      styles.close
    )

    const pagination = alertOrigin.pagination || {};
    const sorter = alertOrigin.sorter || {};

    const period = alertOrigin.period;
    const times = pagination.total;
    const records = alertOrigin.records;
    const name = alertOrigin.alertName;
    const columns = [
      {
        title: formatMessage({ ...localeMessage['occurTime'] }),
        dataIndex: 'occurTime',
        key: 'occurTime',
        // sorter: () => {
        //   onPageChange(undefined, undefined, { sortKey: 'occurTime', sortType: sorter.sortType == undefined?1:(sorter.sortType > 0?0:1)})
        // },
        sorter: true,
        sortOrder: sorter.sortKey == 'occurTime'?(sorter.sortType > 0?'ascend':'descend'):true,
        width: "25%"
      },
      {
        title: formatMessage({ ...localeMessage['entityName'] }),
        dataIndex: 'entityName',
        key: 'entityName',
        width: "25%"
      },
      {
        title: formatMessage({ ...localeMessage['entityAddress'] }),
        dataIndex: 'entityAddr',
        key: 'entityAddr',
        width: "25%"
      },
      {
        title: formatMessage({ ...localeMessage['description'] }),
        dataIndex: 'description',
        key: 'description',
        width: "25%"
      },
    ]

    return (
      <div id="alertOriginSlider" className={ classnames(styles.alertOriginSlider, visible?styles.show:'') }>
        <div className={ styles.main }>
          <div className={ styles.header }>
            <p>{ name || '-' }</p>
            <i onClick={ onClose } className={ shanchuClass }/>
          </div>
          <hr className={ styles.line }/>
          <div className={ styles.totalTip }>
            <p> 
              <FormattedMessage {...localeMessage['alertTimesDescription'] } 
                  values={{
                    times: <span className={styles.totalNum}><b>{times}</b></span>
                  }}
              /> 
            </p>
          </div>
          <div className={ styles.tableContent }>
            <Table size="middle" scroll={{y: this.tableContentHeight}} columns={ columns } dataSource={ records } onChange={onPageChange} pagination={{
              showQuickJumper: true,
              current: pagination.pageNo,
              pageSize: pagination.pageSize,
              total: pagination.total,
              loading: loading
            }}/>
          </div>
        </div>
      </div>
      
    )
  }
}


AlertOriginSlider.defaultProps = {
  onClose: () => {},
  onPageChange: () => {},
  visible: false,
  alertOrigin: {}
}

AlertOriginSlider.PropTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  onPageChange: PropTypes.func,
  alertOrigin: PropTypes.shape({
    pagination: PropTypes.shape({
      pageNo: PropTypes.number,
      pageSize: PropTypes.number,
      totalPage: PropTypes.number,
      total: PropTypes.number,
    }),
    period: PropTypes.string,
    records: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      occurTime: PropTypes.string,
      entityName: PropTypes.string,
      entityAddress: PropTypes.string,
      description: PropTypes.string
    }))
  })
}

export default AlertOriginSlider;
