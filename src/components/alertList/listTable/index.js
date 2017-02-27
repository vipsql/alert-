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
        type: 'alertListTable/loadMore'
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
    checkAlert(e){
      const alertInfo = JSON.parse(e.target.getAttribute('data-all'))

      dispatch({
        type: 'alertListTableCommon/updateCheckAlert',
        payload: alertInfo
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
