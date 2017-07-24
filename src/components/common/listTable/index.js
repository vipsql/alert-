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
import LeftFixedArea from './leftFixedArea'
import ScrollBar from './scrollBar'
import Table from './table'
import Theads from './theads'

class ListTable extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this._getTotalScrollHeight();
    this._setAutoLoadMore();
    this.scrollHeight = this._getTotalScrollHeight();
  }

  componentDidUpdate(oldProps) {
    clearTimeout(this.autoLoad);
    setTimeout(() => {
      this.scrollHeight = this._getTotalScrollHeight();
      this.isLoadingMore = false;
    }, 300)
    const { columns: newColumns } = this.props;
    const { columns: oldColumns } = oldProps;
    if (oldColumns && oldColumns.length > 0 && newColumns.length > oldColumns.length) {
      $("div.listContainer").scrollLeft(10000);
    }
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
      extraArea,
      topHeight,
      intl: { formatMessage }
    } = this.props

    const fixedColumns = columns.filter((item) => item.isFixed == true);

    const formatMessages = defineMessages({
      showMore: {
        id: 'alertList.showMore',
        defaultMessage: '显示更多',
      }
    })

    return (
      <div>
        <Spin spinning={isLoading}>
          <div className={"listContainer " + styles.listContainer}>
            <ScrollBar sourceOrigin={sourceOrigin} horizonTarget="div.listContainer" />
            <div style={{ display: columns.length > 2?'block':'none' }}>
            <LeftFixedArea
              sourceOrigin={sourceOrigin}
              isGroup={isGroup}
              groupBy={groupBy}
              data={data}
              columns={fixedColumns}
              checkAlertFunc={checkAlertFunc}
              checkAlert={checkAlert}
              detailClick={detailClick}
              spreadChild={spreadChild}
              noSpreadChild={noSpreadChild}
              spreadGroup={spreadGroup}
              noSpreadGroup={noSpreadGroup}
              selectedAll={selectedAll}
              handleSelectAll={handleSelectAll}
              relieveClick={relieveClick}
              orderFlowNumClick={orderFlowNumClick}
              showAlertOrigin={showAlertOrigin}
              isLoading={isLoading}
              orderUp={orderUp}
              orderDown={orderDown}
              orderBy={orderBy}
              orderType={orderType}
              orderByTittle={orderByTittle}
              extraArea={extraArea}
              topHeight={topHeight}
            />
            </div>
            <TopFixedArea parentTarget="div.listContainer"
              theads={
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
              }
              extraArea={extraArea} topHeight={topHeight}
            />
            <Table
              sourceOrigin={sourceOrigin}
              isGroup={isGroup}
              groupBy={groupBy}
              data={data}
              columns={columns}
              checkAlertFunc={checkAlertFunc}
              checkAlert={checkAlert}
              detailClick={detailClick}
              spreadChild={spreadChild}
              noSpreadChild={noSpreadChild}
              spreadGroup={spreadGroup}
              noSpreadGroup={noSpreadGroup}
              selectedAll={selectedAll}
              handleSelectAll={handleSelectAll}
              relieveClick={relieveClick}
              orderFlowNumClick={orderFlowNumClick}
              showAlertOrigin={showAlertOrigin}
              isLoading={isLoading}
              orderUp={orderUp}
              orderDown={orderDown}
              orderBy={orderBy}
              orderType={orderType}
              orderByTittle={orderByTittle}
            />
          </div>
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
