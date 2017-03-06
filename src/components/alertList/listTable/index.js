import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import ListTable from './ListTable'
import styles from '../index.less'

// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const  ListTableWrap = ({dispatch, alertListTable}) => {
  const props = {
    ...alertListTable,
    loadMore(){
      dispatch({
        type: 'alertListTableCommon/loadMore'
      })
    },
    setTimeLineWidth(gridWidth, minuteToWidth){
      dispatch({
        type: 'alertListTable/setTimeLineWidth',
        payload: {
          gridWidth,
          minuteToWidth
        }
      })
    },
    checkAlertFunc(e){
      const alertInfo = JSON.parse(e.target.getAttribute('data-all'));

      dispatch({
        type: 'alertListTableCommon/changeCheckAlert',
        payload: alertInfo
      })
    },
    detailClick(e) {
      const alertId = JSON.parse(e.target.getAttribute('data-id'));

      dispatch({
        type: 'alertListTableCommon/clickDetail',
        payload: alertId
      })
    },
    // children展开
    spreadChild(e) {
      const alertId = JSON.parse(e.target.getAttribute('data-id'));

      dispatch({
        type: 'alertListTable/spreadChild',
        payload: alertId
      })
    },
    noSpreadChild(e) {
      const alertId = JSON.parse(e.target.getAttribute('data-id'));

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
    }

  }

  return (
    <ListTable {...props} />
  )
}
export default connect(
  (state) => {
    return {
      alertListTable: {
        ...state.alertListTable,
        ...state.alertListTableCommon
      }
    }
  }
)(ListTableWrap)
