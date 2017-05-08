import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import VisualAnalyze from './visualAnalyze'
import styles from '../index.less'


const  VisualAnalyzeWrap = ({dispatch, visualAnalyze}) => {
  
  const props = {
    ...visualAnalyze,

    showResList(e){
        const target = e.target
        dispatch({
            type: 'visualAnalyze/queryVisualRes',
            payload: {
                gr2Val: target.parentNode.getAttribute('data-gr2Val'),
                gr3Val: target.parentNode.getAttribute('data-gr3Val')
            }
        })
        dispatch({
            type: 'visualAnalyze/queryResInfo',
            payload: {
                res: target.parentNode.getAttribute('data-gr2Val')
            }
        })
        
    },
    detailClick(e) {
      const alertId = e.target.getAttribute('data-id');

      dispatch({
        type: 'alertListTable/clickDetail',
        payload: alertId
      })
    },
    showAlertList(e){
        let target = e.target
        while(target.tagName.toLowerCase() != 'li'){
            target = target.parentNode
        }
        dispatch({
            type: 'visualAnalyze/showAlertList',
            payload: target.getAttribute('data-id')
        })
    },
    handleExpand(e) {
        const target = e.target,
        isExpand = target.getAttribute('data-expand') == 'true' ? false : true,
        index = target.getAttribute('data-index') 
        
        dispatch({
            type: 'visualAnalyze/expandList',
            payload: {
                index,
                isExpand
            }
        })
    },
    redirectTagsList(){
        dispatch({
            type: 'visualAnalyze/redirectTagsList'
        })
    },
    // tagsClickToRes(e){
    //     const target = e.target,
    //         gr2Val = target.getAttribute('data-gr2Val'),
    //         gr3Val = target.getAttribute('data-gr3Val') 
    //     dispatch({
    //         type: 'visualAnalyze/queryVisualRes',
    //         payload: {
    //             gr2Val,
    //             gr3Val
    //         }
    //     })
    // },
    gr2Change(value){
        localStorage.setItem('__alert_visualAnalyze_gr2', value)
        
        dispatch({
            type: 'visualAnalyze/queryVisualList',
            payload: {
                isFirst: false
            }
        })
    },
    gr3Change(value){
        localStorage.setItem('__alert_visualAnalyze_gr3', value)
        dispatch({
            type: 'visualAnalyze/queryVisualList',
            payload: {
                isFirst: false
            }
        })
    },
    gr4Change(value){
        localStorage.setItem('__alert_visualAnalyze_gr4', value)
        dispatch({
            type: 'visualAnalyze/queryVisualRes',
            payload: {
                val: value
            }
        })
    },

    showIncidentGroup(e){
        dispatch({
            type: 'visualAnalyze/queryVisualList',
            payload: e.target.checked
        })
    }
    

  }

  return (
    <VisualAnalyze {...props} />
  )
}
export default connect(
  (state) => {
    return {
      visualAnalyze: {
        ...state.visualAnalyze,
      }
    }
  }
)(VisualAnalyzeWrap)
