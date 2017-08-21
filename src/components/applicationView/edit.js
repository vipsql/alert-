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
import Webhook from './UYUN_Webhook'
import LeaveNotifyModal from '../common/leaveNotifyModal/index'

class Edit extends Component {
  componentDidMount() {
    this.isNeedLeaveCheck = true;
  }
  render() {
    const props = this.props;
    const { currentEditApp } = props.alertConfig;

    const editApplication = ({ alertConfig, dispatch }) => {
      const { currentEditApp, apikey } = alertConfig;
      let targetApplication;
      let hostUrl = 'https://alert.uyun.cn';
      let origin = window.location.protocol + '//' + window.location.host;
      if (origin.indexOf("alert") > -1) {
        // 域名访问
        hostUrl = origin
        window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}` + `&app_key=${currentEditApp.appKey}`
      } else {
        // 顶级域名/Ip访问
        hostUrl = origin + '/alert'
        window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}` + `&app_key=${currentEditApp.appKey}`
      }
      console.log(currentEditApp.applyType.name)
      switch (currentEditApp.applyType.name) {
        case 'UYUN Alert REST API':
          targetApplication =
            <AlertREST
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              builtIn={currentEditApp.builtIn}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
        case 'UYUN Monitor':
          targetApplication =
            <Monitor
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              builtIn={currentEditApp.builtIn}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
        case 'UYUN NetWork':
          targetApplication =
            <NetWork
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              builtIn={currentEditApp.builtIn}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
        case 'SNMPTrap':
          targetApplication =
            <Trap
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              builtIn={currentEditApp.builtIn}
              url={hostUrl}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
        case 'UYUN VideoMon':
          targetApplication =
            <VideoMON
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              builtIn={currentEditApp.builtIn}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
        case 'UYUN ITSM':
          targetApplication =
            <Itsm
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
        case 'UYUN ChatOps':
          targetApplication =
            <ChatOps
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
        case 'UYUN WebHook':
          targetApplication =
            <Webhook
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              builtIn={currentEditApp.builtIn}
              webHook={ currentEditApp.webHook }
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  const webHook = {
                    url: formData.url,
                    timeout: formData.timeout,
                    requestMode: formData.requestMode,
                    fieldMap: formData.fieldMap,
                    replyKey: formData.replyKey,
                    replySuccess: formData.replySuccess
                  }
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData: { ...formData, webHook },
                      resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
            />
          break;
        default:
          targetApplication =
            <AlertREST
              route={props.route}
              appkey={currentEditApp.appKey}
              displayName={currentEditApp.displayName}
              builtIn={currentEditApp.builtIn}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/editApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    }
                  })
                })
              }}
            />
          break;
      }
      return (
        <div>
          {targetApplication}
          <LeaveNotifyModal route={props.route} needLeaveCheck={() => {
            return this.isNeedLeaveCheck;
          }} />
        </div>
      )
    }

    if (currentEditApp !== undefined && Object.keys(currentEditApp).length !== 0) {
      return editApplication(props)
    } else {
      return false;
    }
  }
}
Edit.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({ alertConfig }) => ({ alertConfig }))(Edit)
