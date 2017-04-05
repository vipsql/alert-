import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import Detail from './detail'
import { getUUID } from '../../utils'
import AlertREST from './UYUN_Alert_REST'
import Monitor from './UYUN_Monitor'
import Itsm from './UYUN_Itsm'
import ChatOps from './UYUN_ChatOps'
import VideoMON from './UYUN_VideoMon'

function Edit(props){
    const { currentEditApp } = props.alertConfig;

    const editApplication = ({alertConfig, dispatch}) => {
        const { currentEditApp, UUID, apikey } = alertConfig;
        let targetApplication;
        let hostUrl = 'https://alert.uyun.cn'
        if (window.location.origin.indexOf("alert") > -1) {
            // 域名访问
            hostUrl = window.location.origin
            window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`
        } else {
            // 顶级域名/Ip访问
            hostUrl = window.location.origin + '/alert'
            window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`
        }
        switch (currentEditApp.name) {
            case 'UYUN Alert REST API':
                targetApplication = 
                    <AlertREST 
                        appkey={UUID}
                        displayName={currentEditApp.displayName}
                        builtIn={currentEditApp.builtIn}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                    />
                break;
            case 'UYUN Monitor':
                targetApplication = 
                    <Monitor 
                        appkey={UUID}
                        displayName={currentEditApp.displayName}
                        builtIn={currentEditApp.builtIn}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                    />
                break;
            case 'UYUN VideoMON':
                targetApplication = 
                    <VideoMON 
                        appkey={UUID}
                        displayName={currentEditApp.displayName}
                        builtIn={currentEditApp.builtIn}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                    />
                break;
            case 'UYUN Itsm':
                targetApplication = 
                    <Itsm 
                        appkey={UUID}
                        displayName={currentEditApp.displayName}
                        onOk={(e, form) => {
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
                        }}
                    />
                break;
            case 'UYUN ChatOps':
                targetApplication = 
                    <ChatOps 
                        appkey={UUID}
                        displayName={currentEditApp.displayName}
                        onOk={(e, form) => {
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
                        }}
                    />
                break;
            default:
                targetApplication = 
                    <AlertREST 
                        appkey={UUID}
                        displayName={currentEditApp.displayName}
                        builtIn={currentEditApp.builtIn}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                    />
                break;
        }
        return targetApplication
    }

    if (currentEditApp !== undefined && Object.keys(currentEditApp).length !== 0) {
        return editApplication(props)
    } else {
        return false;
    }
    
}
Edit.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({alertConfig}) => ({alertConfig}))(Edit)
