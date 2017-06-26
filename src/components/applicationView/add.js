import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { getUUID } from '../../utils'
import AlertREST from './UYUN_Alert_REST'
import Monitor from './UYUN_Monitor'
import Itsm from './UYUN_Itsm'
import ChatOps from './UYUN_ChatOps'
import VideoMON from './UYUN_VideoMon'
import Trap from './SNMP_Trap'
import NetWork from './UYUN_NetWork'

function Add(props){

    const { currentOperateAppType } = props.alertConfig;

    const createApplication = ({alertConfig, dispatch}) => {
        const { currentOperateAppType, UUID, currentDisplayName, apikey } = alertConfig;
        let targetApplication;
        let hostUrl = 'https://alert.uyun.cn'
        let origin = window.location.protocol + '//' +window.location.host;
        if (origin.indexOf("alert") > -1) {
            // 域名访问
            hostUrl = origin
            window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`
        } else {
            // 顶级域名/Ip访问
            hostUrl = origin + '/alert'
            window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`
        }
        switch (currentOperateAppType.name) {
            case 'UYUN Alert REST API':
                targetApplication = 
                    <AlertREST 
                        route={ props.route }
                        appkey={UUID}
                        builtIn={1}
                        displayName={currentDisplayName}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form, callback) => {
                            let _UUID = getUUID(32);
                            callback(_UUID)
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
            case 'UYUN Monitor':
                targetApplication = 
                    <Monitor 
                        route={ props.route }
                        appkey={UUID}
                        displayName={currentDisplayName}
                        builtIn={1}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form) => {
                            let _UUID = getUUID(32);
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
            case 'UYUN NetWork':
                targetApplication = 
                    <NetWork 
                        route={ props.route }
                        appkey={UUID}
                        displayName={currentDisplayName}
                        builtIn={1}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form) => {
                            let _UUID = getUUID(32);
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
            case 'SNMPTrap':
                targetApplication = 
                    <Trap
                        route={ props.route }
                        dispatch={dispatch}
                        appkey={UUID}
                        displayName={currentDisplayName}
                        builtIn={1}
                        url={hostUrl}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form) => {
                            let _UUID = getUUID(32);
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
            case 'UYUN VideoMon':
                targetApplication = 
                    <VideoMON 
                        route={ props.route }
                        appkey={UUID}
                        displayName={currentDisplayName}
                        builtIn={1}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form) => {
                            let _UUID = getUUID(32);
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
            case 'UYUN ITSM':
                targetApplication = 
                    <Itsm 
                        route={ props.route }
                        appkey={UUID}
                        displayName={currentDisplayName}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form) => {
                            let _UUID = getUUID(32);
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
            case 'UYUN ChatOps':
                targetApplication = 
                    <ChatOps 
                        route={ props.route }
                        appkey={UUID}
                        displayName={currentDisplayName}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form) => {
                            let _UUID = getUUID(32);
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
            default:
                targetApplication = 
                    <AlertREST 
                        route={ props.route }
                        appkey={UUID}
                        builtIn={1}
                        displayName={currentDisplayName}
                        url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
                        onOk={(e, form) => {
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
                        }}
                        keyCreate={(form, callback) => {
                            let _UUID = getUUID(32);
                            callback(_UUID)
                            dispatch({
                                type: 'alertConfig/setUUID',
                                payload: {
                                    UUID: _UUID,
                                    currentDisplayName: form.getFieldsValue().displayName
                                }
                            })
                        }}
                    />
                break;
        }
        return targetApplication
    }

    if (currentOperateAppType !== undefined && Object.keys(currentOperateAppType).length !== 0) {
        return createApplication(props)
    } else {
        return false;
    }
}
Add.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({alertConfig}) => ({alertConfig}))(Add)
