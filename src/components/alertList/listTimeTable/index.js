import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import ListTimeTable from './listTimeTable'
import styles from '../index.less'


// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const ListTimeTableWrap = ({ dispatch, alertListTable, selectedTime }) => {
  const props = {
    ...alertListTable,
    selectedTime,
    loadMore() {
      dispatch({
        type: 'alertListTable/loadMore'
      })
    },

    setTimeLineWidth(gridWidth, minuteToWidth, lineW) {
      dispatch({
        type: 'alertListTable/setTimeLineWidth',
        payload: {
          gridWidth,
          minuteToWidth,
          lineW
        }
      })
    },

    checkAlertFunc(e) {

      const alertId = e.target.getAttribute('data-id');
      dispatch({
        type: 'alertListTable/handleCheckboxClick',
        payload: { alertId }
      })
    },
    detailClick(e) {
      const alertId = e.target.getAttribute('data-id');

      dispatch({
        type: 'alertDetail/openDetailModal',
        payload: {
          alertId
        }
      })
    },
    // children展开
    spreadChild(e) {
      const alertId = e.target.getAttribute('data-id');

      dispatch({
        type: 'alertListTable/spreadChild',
        payload: alertId
      })
    },
    noSpreadChild(e) {
      const alertId = e.target.getAttribute('data-id');

      dispatch({
        type: 'alertListTable/noSpreadChild',
        payload: alertId
      })
    },
    // 分组展开
    spreadGroup(e) {
      const groupClassify = e.target.getAttribute('data-classify')

      dispatch({
        type: 'alertListTable/spreadGroup',
        payload: groupClassify
      })
    },
    noSpreadGroup(e) {
      const groupClassify = e.target.getAttribute('data-classify')

      dispatch({
        type: 'alertListTable/noSpreadGroup',
        payload: groupClassify
      })
    },
    // toggleSelectedAll(e) {
    //   dispatch({
    //     type: 'alertListTable/toggleSelectedAll'
    //   })
    // },
    handleSelectAll(e) {
      const checked = e.target.checked;
      dispatch({
        type: 'alertListTable/handleSelectAll',
        payload: { checked }
      });
    },
    // 解除告警
    relieveClick(e) {
      e.stopPropagation();
      const alertInfo = JSON.parse(e.target.getAttribute('data-all'));

      dispatch({
        type: 'alertOperation/openRelieveModalByButton',
        payload: alertInfo
      })
    }

  }

  return (
    <ListTimeTable {...props} />
  )
}
export default connect(
  (state) => {
    return {
      alertListTable: state.alertListTable,
      selectedTime: state.alertManage.selectedTime
    }
  }
)(ListTimeTableWrap)
