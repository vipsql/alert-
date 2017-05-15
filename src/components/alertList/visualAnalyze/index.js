import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import VisualAnalyze from './visualAnalyze'
import styles from '../index.less'
import $ from 'jquery'

const  VisualAnalyzeWrap = ({dispatch, visualAnalyze}) => {
  
  const props = {
    ...visualAnalyze,
    
    showResList(e){
        const target = e.target,
              parentNode = target.parentNode,
              gr2Val = parentNode.getAttribute('data-gr2Val'),
              gr3Val = parentNode.getAttribute('data-gr3Val')

              localStorage.setItem('__alert_visualAnalyze_gr2Val',gr2Val)
              localStorage.setItem('__alert_visualAnalyze_gr3Val',gr3Val)
        const $_parentNode = $(parentNode),
              offset = $_parentNode.offset(),
              left = offset.left,
              width = $_parentNode.width()/2,
              top = offset.top
        
        const cloneNode = $('<div/>')
        cloneNode.addClass('tagsGroupAnimation').css({
            left: left + width,
            top: top
        }).appendTo('body')
        const targetEle = $('#visualGr2'),
              targetLeft =  targetEle.offset().left,
              targetTop =  targetEle.offset().top
              
        cloneNode.animate({
            left: targetLeft + 90,
            top: targetTop
        },300,() => {
            cloneNode.remove()
             dispatch({
                type: 'visualAnalyze/queryVisualRes'
            })
            dispatch({
                type: 'visualAnalyze/queryResInfo',
                payload: {
                    res: parentNode.getAttribute('data-gr3Val')
                }
            })
        })
       
        
    },
    detailClick(e) {
      const alertId = e.target.getAttribute('data-id')
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
        window.__uyun_showAlertList = setTimeout(() => {
            dispatch({
                type: 'visualAnalyze/showAlertList',
                payload: target.getAttribute('data-id')
            })
        },300)
        
    },
    cancelShowAlertList(){
        clearTimeout(window.__uyun_showAlertList)
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
            type: 'visualAnalyze/queryVisualRes'
        })
    },

    showIncidentGroup(e){
        const checked = e.target.checked
        dispatch({
            type: 'visualAnalyze/queryVisualList',
            payload: {
                isFirst: false,
                showIncidentGroup: checked
            }
        })
        dispatch({
            type: 'visualAnalyze/updateIncidentGroup',
            payload: checked
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
