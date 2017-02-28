import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import ListTimeTable from './ListTimeTable'
import styles from '../index.less'

// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const  ListTimeTableWrap = ({dispatch, alertListTimeTable}) => {
  const props = {
    ...alertListTimeTable,

    loadMore(){
      dispatch({
        type: 'alertListTableCommon/loadMore'
      })
    },
    
    setTimeLineWidth(gridWidth, minuteToWidth){
      dispatch({
        type: 'alertListTimeTable/setTimeLineWidth',
        payload: {
          gridWidth,
          minuteToWidth
        }
      })
    },

  }

  return (
    <ListTimeTable {...props} />
  )
}
export default connect(
  (state) => {
    return {
      alertListTimeTable: {
        ...state.alertListTimeTable,
        ...state.alertListTableCommon
      }
    }
  }
)(ListTimeTableWrap)
