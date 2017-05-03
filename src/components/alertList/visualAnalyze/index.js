import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import VisualAnalyze from './visualAnalyze'
import styles from '../index.less'


const  VisualAnalyzeWrap = ({dispatch, visualAnalyze}) => {
  
  const props = {
    ...visualAnalyze,

    
    handleExpand(e) {
        const target = e.target,
        isExpand = target.getAttribute('data-expand') ? false : true,
        index = target.getAttribute('data-expand') 
        dispatch({
            type: 'visualAnalyze/expandList',
            payload: {
                index,
                isExpand
            }
        })
    },
    tagsClickToRes(e){
        const target = e.target,
            gr2Val = target.getAttribute('data-gr2Val'),
            gr3Val = target.getAttribute('data-gr3Val') 
        dispatch({
            type: 'queryVisualRes',
            payload: {
                gr2Val,
                gr3Val
            }
        })
    },
    gr2Change(value){
        dispatch({
            type: 'queryVisualList',
            payload: {
                gr: 'gr2',
                val: value
            }
        })
    },
    gr3Change(value){
        dispatch({
            type: 'queryVisualList',
            payload: {
                gr: 'gr3',
                val: value
            }
        })
    },
    gr4Change(value){
        dispatch({
            type: 'queryVisualRes',
            payload: {
                gr: 'gr3',
                val: value
            }
        })
    },

    showIncidentGroup(e){
        dispatch({
            type: 'queryVisualList',
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
