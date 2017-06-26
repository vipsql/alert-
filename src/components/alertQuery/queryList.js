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
      const alertId = e.target.getAttribute('data-id');
      
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
    },
    orderFlowNumClick(e) {
      const orderFlowNum = e.target.getAttribute('data-flow-num');
      const id = e.target.getAttribute('data-id');
      dispatch({
        type: 'alertQuery/orderFlowNumClick',
        payload: {orderFlowNum, id}
      })
    },
    showAlertOrigin(e) {
      const alertId = e.target.getAttribute('data-id');
      const alertName = e.target.getAttribute('data-name');
      dispatch({
        type: 'alertOrigin/toggleVisible',
        payload: {
          visible: true
        }
      })

      dispatch({
        type: 'alertOrigin/queryAlertOrigin',
        payload: {
          alertId,
          alertName
        }
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
