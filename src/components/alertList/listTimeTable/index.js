import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import ListTimeTable from './ListTimeTable'
import styles from '../index.less'

// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const  ListTimeTableWrap = ({dispatch, alertListTimeTable}) => {
  const props = {
    ...alertListTimeTable,
    showMore(){
      dispatch({
        type: 'alertListTimeTable/loadMore'
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
    showMore(){
      dispatch({
        type: 'alertListTimeTable/showMore'
      })
    }

  }

  return (
    <ListTimeTable {...props} />
  )
}
export default connect(({alertListTimeTable}) => ({alertListTimeTable}))(ListTimeTableWrap)
