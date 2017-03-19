import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import Detail from './detail'
import AppConfigInfo from './appConfigInfo.json'
import { getUUID } from '../../utils'

function Edit({dispatch, alertConfig}){
  const { currentEditApp, UUID } = alertConfig;
    let appTypeInfo = {};
    
    // 用于不同的type匹配不同的页面message
    if (currentEditApp.type == 0 ) {
        AppConfigInfo['transferIn']['children'].forEach( (app) => {
            if (app.name == currentEditApp['applyType'].name) {
                appTypeInfo = app.pageInfo
            }
        })
    } else if (currentEditApp.type == 1 ) {
        AppConfigInfo['transferOut']['children'].forEach( (app) => {
            if (app.name == currentEditApp['applyType'].name) {
                appTypeInfo = app.pageInfo
            }
        })
    }
    
    const editProps = {
        type: currentEditApp.type,
        iconType: currentEditApp['applyType'].name, // 用于确定Icon
        headerName: currentEditApp['applyType'].name,
        displayName: currentEditApp.displayName,
        appkey: UUID,
        ...appTypeInfo,

        onOk: (e, form) => {
            e.preventDefault();
            
            form.validateFieldsAndScroll( (errors, values) => {
                if (!!errors) {
                    return;
                }
                const formData = form.getFieldsValue()
                dispatch({
                    type: 'alertConfig/editApplication',
                    payload: formData
                })
            })
        },
        keyCreate: () => {
            dispatch({
                type: 'alertConfig/setUUID',
                payload: getUUID(32)
            })
        }
    }
    
    return (
        <Detail {...editProps}/>
    )
}
Edit.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({alertConfig}) => ({alertConfig}))(Edit)
