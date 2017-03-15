import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import ListTable from '../common/listTable'

// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const  ListTableWrap = ({dispatch, alertQuery}) => {
  const props = {
    ...alertQuery,
    loadMore(){
      dispatch({
        type: 'alertQuery/loadMore'
      })
    },

    detailClick(e) {
      const alertId = JSON.parse(e.target.getAttribute('data-id'));

      dispatch({
        type: 'alertQuery/clickDetail',
        payload: alertId
      })
    },
    // 分组展开
    spreadGroup(e) {
      const groupClassify = e.target.getAttribute('data-classify')
      
      dispatch({
        type: 'alertQuery/spreadGroup',
        payload: groupClassify
      })
    },
    noSpreadGroup(e) {
      const groupClassify = e.target.getAttribute('data-classify')
      
      dispatch({
        type: 'alertQuery/noSpreadGroup',
        payload: groupClassify
      })
    },
    // 升序
    orderUp(e) {
      const orderKey = e.target.getAttribute('data-key');
      
      dispatch({
        type: 'alertQuery/orderList',
        payload: {
          orderBy: orderKey,
          orderType: 1
        }
      })
    },
    // 降序
    orderDown(e) {
      const orderKey = e.target.getAttribute('data-key');
      
      dispatch({
        type: 'alertQuery/orderList',
        payload: {
          orderBy: orderKey,
          orderType: 0
        }
      })
    },
    orderByTittle(e) {
      const orderKey = e.target.getAttribute('data-key');

      dispatch({
        type: 'alertQuery/orderByTittle',
        payload: orderKey
      })
    }
  }

  return (
    <ListTable sourceOrigin='alertQuery' {...props} />
  )
}
export default connect(
  (state) => {
    return {
      alertQuery: {
        ...state.alertQuery,
      }
    }
  }
)(ListTableWrap)
