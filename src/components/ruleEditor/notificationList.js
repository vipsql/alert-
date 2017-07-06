import React, { PropTypes, Component } from 'react';
import { default as cls } from 'classnames';
import {
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Tabs,
    Popover,
    Checkbox,
    Row,
    Col,
    Button
} from 'antd';

import styles from './notificationList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

function saveref(name, component) {
    this[name] = component
}

function switchVideoSouce(type = '3') {
    let _source = 'Recovery.wav';
    switch (type) {
      case '3':
        _source = 'Critical.wav';
        break;
      case '2':
        _source = 'Warning.wav';
        break;
      case '1':
        _source = 'Information.wav';
        break;
      case '0':
        _source = 'Recovery.wav';
        break;
      default:
        break;
    }
    return _source;
}

class NotificationList extends Component {

    constructor(props) {
        super(props)
        this.saveAudioRef = saveref.bind(this, 'audioInstance')
        this.switchVideoSouce = switchVideoSouce.bind(this)
        this.state = {
            _audio: null
        }
    }

    changeAction(type, value) {
        const {
            changeAction,
            changeActionByAudio
        } = this.props;

        if (typeof type === 'string') {
          changeActionByAudio(type, value)
        } else {
          changeAction(type, value);
        }
    }

    createVideo(event) {
        event.stopPropagation();
        event.preventDefault();
        const _videoType = this.props.action && this.props.action.actionNotification.notificationMode.webNotification.voiceType;
        if (this.audioInstance && this.audioInstance.src.indexOf(this.switchVideoSouce(_videoType)) > 0) {
          if (this.audioInstance.paused) {
              this.audioInstance.play();
          }else{
              this.audioInstance.currentTime = 0
          }
        }
        const _videoComponent = React.cloneElement(<audio id="audition"/>, {
          ref: this.saveAudioRef,
          src: this.switchVideoSouce(_videoType),
          autoPlay: true,
        })
        this.setState({ _audio: _videoComponent })
    }

    render() {
        const {
            checkedState,
            action,
            emailVarContent,
            smsVarContent,
            audioVarContent
        } = this.props;
        return (
            <Tabs animated={false} className={styles.notificationTabs}>
                <TabPane tab={
                    <div>
                        <Checkbox
                            id="email"
                            checked={checkedState.email}
                            value={1}
                            onChange={this.changeAction.bind(this, 3)}
                        />
                        <span>{window.__alert_appLocaleData.messages['ruleEditor.email']}</span>
                    </div>
                } key="1">

                    <div>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.emailTitle']}
                            className={styles.msgTitle}
                        >
                            <Input id="emailTitle"
                                value={action.actionNotification ? action.actionNotification.notificationMode.emailTitle : '${entityName}:${name}'}
                                onChange={this.changeAction.bind(this, 3)}
                            />
                        </FormItem>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.emailCon']}
                            className={styles.msgContent}
                        >
                            <Input id="emailMessage"
                                value={action.actionNotification ? action.actionNotification.notificationMode.emailMessage : '${severity}, ${entityName}, ${firstOccurTime}, ${description}'}
                                onChange={this.changeAction.bind(this, 3)} type="textarea"
                            />
                            <Popover overlayStyle={{ width: '44%' }} overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={emailVarContent}>
                                <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                            </Popover>
                        </FormItem>
                    </div>
                </TabPane>
                <TabPane tab={
                    <div>
                        <Checkbox
                            id="sms"
                            checked={checkedState.sms}
                            value={2}
                            onChange={this.changeAction.bind(this, 3)}
                        />
                        <span>{window.__alert_appLocaleData.messages['ruleEditor.sms']}</span>
                    </div>
                } key="2">
                    <div>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.smsCon']}
                            className={styles.msgContent}
                        >
                            <Input id="smsMessage"
                                value={action.actionNotification ? action.actionNotification.notificationMode.smsMessage : '${severity}, ${entityName}, ${firstOccurTime}, ${description}'}
                                onChange={this.changeAction.bind(this, 3)} type="textarea" />

                            <Popover overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={smsVarContent}>
                                <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                            </Popover>
                        </FormItem>
                    </div>
                </TabPane>
                {
                    window.__alert_appLocaleData.locale === 'zh-cn' &&
                    <TabPane disabled={this.props.alertAssociationRules.rooms.length === 0 ? true : false} tab={
                        <div>
                            <Checkbox
                                disabled={this.props.alertAssociationRules.rooms.length === 0 ? true : false}
                                id="chatops"
                                checked={checkedState.chatops}
                                value={3}
                                onChange={this.changeAction.bind(this, 3)}
                            />
                            <span>{window.__alert_appLocaleData.messages['ruleEditor.chatops']}</span>
                        </div>
                    } key="3" />
                }
                <TabPane tab={
                    <div>
                        <Checkbox
                            id="audio"
                            checked={checkedState.audio}
                            value={4}
                            onChange={this.changeAction.bind(this, 3)}
                        />
                        <span>{window.__alert_appLocaleData.messages['ruleEditor.audio']}</span>
                    </div>
                } key="4">
                    <div>
                        <p className={styles.msgType}>{window.__alert_appLocaleData.messages['ruleEditor.tipInfo']}</p>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.audioTitle']}
                            className={styles.msgTitle}
                        >
                            <Input id="audioTitle"
                                value={action.actionNotification ? action.actionNotification.notificationMode.webNotification.title : '${name}'}
                                onChange={this.changeAction.bind(this, 3)}
                            />
                        </FormItem>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.audioCon']}
                            className={styles.msgContent}
                        >
                            <Input id="audioMessage"
                                value={action.actionNotification ? action.actionNotification.notificationMode.webNotification.message : '${severity},${entityName},${description}'}
                                onChange={this.changeAction.bind(this, 3)} type="textarea"
                            />
                            <Popover overlayStyle={{ width: '44%' }} overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={audioVarContent}>
                                <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                            </Popover>
                        </FormItem>
                        <p className={styles.msgType}>{window.__alert_appLocaleData.messages['ruleEditor.audioInfo']}</p>
                        <Row>
                            <Col span={6}>
                              <FormItem
                                label={window.__alert_appLocaleData.messages['ruleEditor.playTimeType']}
                                className={styles.playerTime}
                              >
                                <Select
                                  id="playTimeType"
                                  getPopupContainer={() =>document.getElementById("content")}
                                  value={action.actionNotification ? action.actionNotification.notificationMode.webNotification.playTimeType : 'ONECE'}
                                  onChange={this.changeAction.bind(this, 'playTimeType')}
                                >
                                  <Option value="ONECE">{window.__alert_appLocaleData.messages['ruleEditor.playTime.once']}</Option>
                                  <Option value="TENSEC">{window.__alert_appLocaleData.messages['ruleEditor.playTime.ten']}</Option>
                                  <Option value="TIMEOUT">{window.__alert_appLocaleData.messages['ruleEditor.playTime.out']}</Option>
                                </Select>
                              </FormItem>
                            </Col>
                            <Col span={6}>
                              <FormItem
                                label={window.__alert_appLocaleData.messages['ruleEditor.playTimeOut']}
                                className={styles.timeOut}
                              >
                                <InputNumber id="timeOut" max={1800} step={10}
                                  value={action.actionNotification ? action.actionNotification.notificationMode.webNotification.timeOut : 30}
                                  onChange={this.changeAction.bind(this, 'timeOut')}
                                />
                                <span style={{fontSize: '13px'}}>s</span>
                              </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                              <FormItem
                                  label={window.__alert_appLocaleData.messages['ruleEditor.voiceType']}
                                  className={styles.playerType}
                              >
                                  <Select
                                    id="voiceType"
                                    getPopupContainer={() =>document.getElementById("content")}
                                    value={action.actionNotification ? action.actionNotification.notificationMode.webNotification.voiceType : '3'}
                                    onChange={this.changeAction.bind(this, 'voiceType')}
                                  >
                                    <Option value="3">{window['_severity']['3']}</Option>
                                    <Option value="2">{window['_severity']['2']}</Option>
                                    <Option value="1">{window['_severity']['1']}</Option>
                                    <Option value="0">{window['_severity']['0']}</Option>
                                  </Select>
                              </FormItem>
                            </Col>
                            <Button type="primary" onClick={ this.createVideo.bind(this) }>{window.__alert_appLocaleData.messages['ruleEditor.audition']}</Button>
                            { this.state._audio }
                        </Row>
                    </div>
                </TabPane>
            </Tabs>
        );
    }
}

NotificationList.defaultProps = {};

NotificationList.propsTypes = {};

export default NotificationList;
