import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import ListTimeTable from './listTimeTable'
import styles from '../index.less'


// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const ListTimeTableWrap = ({ dispatch, alertListTable, userInfo, selectedTime, isNeedCheckOwner }) => {
  const props = {
    ...alertListTable,
    selectedTime,
    isNeedCheckOwner,
    userInfo,
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
        payload: { checked, isNeedCheckOwner }
      });
    },
    // 解除告警
    relieveClick(e) {
      e.stopPropagation();
      const obj = JSON.parse(e.target.getAttribute('data-id'));
      let relieve = null
      if (alertListTable.isGroup) {
        alertListTable.data.forEach( (group) => {
          if (group.classify == obj.classify) {
            group.children.forEach(item => {
              if (item.id == obj.id) {
                relieve = {
                  ...item
                }
              }
            })
          }
        })
      } else {
          alertListTable.data.forEach(item => {
            if (item.id == obj.id) {
              relieve = {
                ...item
              }
            }
          })
      }
      dispatch({
        type: 'alertOperation/openRelieveModalByButton',
        payload: relieve
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
      selectedTime: state.alertManage.selectedTime,
      userInfo: state.app && state.app.userInfo
    }
  }
)(ListTimeTableWrap)
