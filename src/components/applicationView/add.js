import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import Detail from './detail'
import AppConfigInfo from './appConfigInfo.json'
import { getUUID } from '../../utils'

function Add({alertConfig, dispatch}){

    const { currentOperateAppType, UUID, currentDisplayName } = alertConfig;
    let appTypeInfo = {};
    
    // 用于不同的type匹配不同的页面message
    if (currentOperateAppType.type == 0 ) {
        AppConfigInfo['transferIn']['children'].forEach( (app) => {
            if (app.name == currentOperateAppType.name) {
                appTypeInfo = app.pageInfo
            }
        })
    } else if (currentOperateAppType.type == 1 ) {
        AppConfigInfo['transferOut']['children'].forEach( (app) => {
            if (app.name == currentOperateAppType.name) {
                appTypeInfo = app.pageInfo
            }
        })
    }
    
    const addProps = {
        type: currentOperateAppType.type,
        iconType: currentOperateAppType.name, // 用于确定Icon
        headerName: currentOperateAppType.name,
        displayName: currentDisplayName,
        appkey: UUID,
        builtIn: 1,
        ...appTypeInfo,

        onOk: (e, form) => {
            e.preventDefault();
            
            form.validateFieldsAndScroll( (errors, values) => {
                if (!!errors) {
                    return;
                }
                const formData = form.getFieldsValue()
                dispatch({
                    type: 'alertConfig/addApplication',
                    payload: formData
                })
            })
        },
        keyCreate: (form) => {
            let _UUID = getUUID(32);
            dispatch({
                type: 'alertConfig/setUUID',
                payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                }
            })
        }
    }
    
    return (
        <Detail {...addProps}/>
    )
}
Add.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({alertConfig}) => ({alertConfig}))(Add)
