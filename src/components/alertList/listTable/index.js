import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import ListTable from './ListTable'
import styles from '../index.less'

// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const  ListTableWrap = ({dispatch, alertListTable}) => {
  const props = {
    ...alertListTable,
    showMore(){
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
    showMore(){
      dispatch({
        type: 'alertListTable/showMore'
      })
    }

  }

  return (
    <ListTable {...props} />
  )
}
export default connect(({alertListTable}) => ({alertListTable}))(ListTableWrap)
