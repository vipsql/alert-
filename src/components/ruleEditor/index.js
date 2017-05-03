import React, {
  PropTypes,
  Component
} from 'react';
import { default as cls } from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';
import _ from 'lodash';
import {
  Form,
  Input,
  Radio,
  Select,
  Tabs,
  Popover,
  Checkbox
} from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import Condition from './condition';
import TimeSlider from './timeSlider';

import styles from './index.less';
import '../../../node_modules/rc-calendar/assets/index.css';
import en_US from 'rc-calendar/lib/locale/en_US';
import zh_CN from 'rc-calendar/lib/locale/zh_CN';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

if (window.__alert_appLocaleData.locale === 'en-us') { // 设定时间国际化
  moment.locale('en_US');
} else {
  moment.locale('zh-cn');
}


const conditionData = { // 模拟数据
  // 一级条件
  logic: 'or',
  content: [{
    key: 'level',
    opt: 'equal',
    value: 'CMDB',
  }, {
    key: 'source',
    opt: 'equal',
    value: 'CMDB',
  }],
  // 二级条件（一级条件的补充条件）
  complex: [{
    logic: 'and',
    content: [{
      key: 'source',
      opt: 'equal',
      value: 'Monitor',
    }, {
      key: 'duration',
      opt: 'equal',
      value: 'APM',
    }],
    // 三级条件
    complex: [{
      logic: 'not',
      content: [{
        key: 'duration',
        opt: 'equal',
        value: 'Monitor',
      }, {
        key: 'level',
        opt: 'equal',
        value: 'Monitor',
      }]
    }, {
      logic: 'not',
      content: [{
        key: 'level',
        opt: 'equal',
        value: 'CMDB',
      }, {
        key: 'status',
        opt: 'equal',
        value: 'Monitor',
      }]
    }]
  },{
    // 二级条件（一级条件的补充条件）
    logic: 'and',
    content: [{
      key: 'source',
      opt: 'equal',
      value: 'APM',
    }, {
      key: 'duration',
      opt: 'equal',
      value: 'APM',
    }],
    // 三级条件
    complex: [{
      logic: 'not',
      content: [{
        key: 'duration',
        opt: 'equal',
        value: 'Monitor',
      }, {
        key: 'level',
        opt: 'equal',
        value: 'Monitor',
      }]
    }, {
      logic: 'not',
      content: [{
        key: 'level',
        opt: 'equal',
        value: 'Monitor',
      }, {
        key: 'status',
        opt: 'equal',
        value: 'CMDB',
      }]
    }, {
      logic: 'and',
      content: [{
        key: 'level',
        opt: 'equal',
        value: 'APM',
      }, {
        key: 'status',
        opt: 'equal',
        value: 'APM',
      }]
    }]
  }]
};

const NotificationModeArr = [
  {label: window.__alert_appLocaleData.messages['ruleEditor.email'], value: 1},
  {label: window.__alert_appLocaleData.messages['ruleEditor.sms'], value: 2},
  {label: window.__alert_appLocaleData.messages['ruleEditor.shareChatOps'], value: 3}
]
const WeekArray = [
  {label: window.__alert_appLocaleData.messages['ruleEditor.mon'], value: '0'},
  {label: window.__alert_appLocaleData.messages['ruleEditor.tue'], value: '1'},
  {label: window.__alert_appLocaleData.messages['ruleEditor.wed'], value: '2'},
  {label: window.__alert_appLocaleData.messages['ruleEditor.thu'], value: '3'},
  {label: window.__alert_appLocaleData.messages['ruleEditor.fri'], value: '4'},
  {label: window.__alert_appLocaleData.messages['ruleEditor.sat'], value: '5'},
  {label: window.__alert_appLocaleData.messages['ruleEditor.sun'], value: '6'}
];
const MonthArray = _.range(31).map(item => {
  return {
    label: item + 1,
    value: item.toString()
  };
});
let conditionsDom = []; // 元素列表
let treeTag = 0; // 当前数据的层级标识
let leafTag = 0; // 叶子 id

// 处理条件数据，给每一条数据加上唯一 id
const makeCondition = (node, type = true) => {
  const { complex = [] } = node;
  if (type) {
    node.id = leafTag;
  } else {
    delete node.id;
  }
  leafTag += 1;
  for (let i = complex.length - 1; i >= 0; i -= 1) {
    makeCondition(complex[i]);
  }
  return node;
};

const formatMessages = defineMessages({
    baseInfo: {
      id: 'ruleEditor.baseInfo',
      defaultMessage: '基本信息'
    },
    anyTime: {
      id: 'ruleEditor.anyTime',
      defaultMessage: '任意时间均执行'
    },
    peroid: {
      id: 'ruleEditor.peroid',
      defaultMessage: '周期性执行'
    },
    fixedTime: {
      id: 'ruleEditor.fixedTime',
      defaultMessage: '固定时间段执行'
    },
    schedule: {
      id: 'ruleEditor.schedule',
      defaultMessage: '请选择定时规则'
    },
    daily: {
      id: 'ruleEditor.daily',
      defaultMessage: '每日'
    },
    weekly: {
      id: 'ruleEditor.weekly',
      defaultMessage: '每周'
    },
    monthly: {
      id: 'ruleEditor.monthly',
      defaultMessage: '每月'
    },
    ruleName: {
      id: 'ruleEditor.ruleName',
      defaultMessage: '规则名称',
    },
    description: {
      id: 'ruleEditor.description',
      defaultMessage: '规则描述'
    },
    excuteTime: {
      id: 'ruleEditor.excuteTime',
      defaultMessage: '执行安排'
    },
    source: {
      id: 'ruleEditor.source',
      defaultMessage: '告警来源'
    },


})


class RuleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // name: props.name,
      // description: props.description,
      /* 时间 */
      type: props.type,
      time: props.time,
      timeStart: {
        hours: 0,
        mins: 0
      },
      timeEnd: {
        hours: 23,
        mins: 59
      },
      /* 来源 */
      source: props.source,
      /* 条件 */
      condition: makeCondition(_.cloneDeep(props.condition)),
      /* 动作 */
      action: props.action,
      email: false,
      sms: false,
      chatops: false,
      recipients: [],
      ITSMParam: '',
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alertAssociationRules/getUsers'
    });
    dispatch({
      type: 'alertAssociationRules/querySource'
    });
    dispatch({
      type: 'alertAssociationRules/queryAttributes'
    });
    dispatch({
      type: 'alertAssociationRules/getField'
    });
    dispatch({
      type: 'alertAssociationRules/getRooms'
    });
    dispatch({
      type: 'alertAssociationRules/getWos'
    });
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.name !== nextProps.name) {
      this.setState({
        name: nextProps.name,
        time: nextProps.time,
        description: nextProps.description,
        type: nextProps.type,
        source: nextProps.source,
        condition: makeCondition(_.cloneDeep(nextProps.condition)),
        action: nextProps.action,
        ITSMParam: nextProps.action.actionITSM
          ? JSON.stringify(JSON.parse(nextProps.action.actionITSM.param), null, 2)
          : ''
      });

    }

    if (nextProps.alertAssociationRules.ITSMParam) {
      let _ITSMParam = nextProps.alertAssociationRules.ITSMParam;
      this.changeAction(4, {
        target: {
          value: _ITSMParam
        }
      });
      this.setState({
        // action: nextProps.action,
        ITSMParam: JSON.stringify(JSON.parse(_ITSMParam), null, 2)
      })
    }
    this.isChecked();
  }

  render() {
    conditionsDom = []; // 重置，防止重复 render
    const { time, timeStart, timeEnd, source, condition, action } = this.state;
    const itemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 4 }
    };
    const desLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 10 }
    };
    const itsmLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }

    // 时间选择器选择之后的文字信息反馈，用'、'号隔开，同类信息用','隔开
    let cycleDay = '';
    switch(time.timeCycle) {
      case 1:
        const timeCycleWeekArr = time.timeCycleWeek.split(',');
        let _timeCycleWeekArr = timeCycleWeekArr.map(item => {
          return item.replace(/\d/g, matchs => {
            return WeekArray[matchs].label;
          });
        });
        _.remove(_timeCycleWeekArr, item => item === '');
        cycleDay = `${_timeCycleWeekArr}${_timeCycleWeekArr.length === 0 ? '' : '、'}`;
        break;
      case 2:
        const timeCycleMonthArr = time.timeCycleMonth.split(',');
        let _timeCycleMonthArr = timeCycleMonthArr.map(item => {
          if (item !== '') {
            return (parseInt(item) + 1).toString();
          } else {
            return '';
          }
        });
        _.remove(_timeCycleMonthArr, item => item === '');
        cycleDay = `${_timeCycleMonthArr}${_timeCycleMonthArr.length === 0 ? '' : '、'}`;
        break;
      default:
        cycleDay = '';
    }
    this.cycleTimeStart = `${timeStart.hours}:${timeStart.mins}`;
    this.cycleTimeEnd = `${timeEnd.hours}:${timeEnd.mins}`;

    const cycleTimeString = time.timeCycle >= 0 ? `${cycleDay}${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")} ~ ${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}` : '';
    const dayTimeString = time.dayStart && time.dayEnd ? `${moment(time.dayStart).format('YYYY-MM-DD')} ~ ${moment(time.dayEnd).format('YYYY-MM-DD')}、${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")} ~ ${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}` : '';

    console.info('[state]', this.state);

    this.emailVarContent = this.vars('emailMessage');
    this.smsVarContent = this.vars('smsMessage');

    return (
      <Form id="RuleEditor" onSubmit={this.submit} hideRequiredMark={false}>

        <h2>{window.__alert_appLocaleData.messages['ruleEditor.baseInfo']}</h2>
        <div className={styles.baseInfo}>
          <FormItem
            {...itemLayout}
            label={window.__alert_appLocaleData.messages['ruleEditor.ruleName']}
          >
              <Input value={this.state.name} onChange={this.changeField.bind(this, 'name')} placeholder={window.__alert_appLocaleData.messages['ruleEditor.phRuleName']} />

          </FormItem>
          <FormItem
            {...desLayout}
            label={window.__alert_appLocaleData.messages['ruleEditor.description']}
          >

              <Input value={this.state.description} onChange={this.changeField.bind(this, 'description')} type="textarea" placeholder={window.__alert_appLocaleData.messages['ruleEditor.phDescription']} />

          </FormItem>
          <FormItem
            {...desLayout}
            label={window.__alert_appLocaleData.messages['ruleEditor.excuteTime']}
          >
            <RadioGroup
              onChange={this.changeType.bind(this)}
              value={this.state.type}
            >
              <Radio value={0}><FormattedMessage {...formatMessages['anyTime']} /></Radio>
              <Radio value={2}><FormattedMessage {...formatMessages['peroid']} /></Radio>
              <Radio value={1}><FormattedMessage {...formatMessages['fixedTime']} /></Radio>
            </RadioGroup>
            {
              this.state.type === 2 &&
              <div className={styles.pickTimeWrap}>
                <Popover
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="pickTime"
                  content={(
                    <div className={styles.timeCycle}>
                      <div className={styles.timeCycleHd}>
                        <span className={cls({
                          'active': time.timeCycle === 0
                        })} onClick={this.changeTimeCycleType.bind(this, 0)}>{window.__alert_appLocaleData.messages['ruleEditor.daily']}</span>
                        <span className={cls({
                          'active': time.timeCycle === 1
                        })} onClick={this.changeTimeCycleType.bind(this, 1)}>{window.__alert_appLocaleData.messages['ruleEditor.weekly']}</span>
                        <span className={cls({
                          'active': time.timeCycle === 2
                        })} onClick={this.changeTimeCycleType.bind(this, 2)}>{window.__alert_appLocaleData.messages['ruleEditor.monthly']}</span>
                      </div>
                      <div className={cls(styles.timeCycleBd, `${time.timeCycle.length === 0 ? styles.hidden : ''}`)}>
                        {
                          time.timeCycle !== 0 &&
                          <p>{window.__alert_appLocaleData.messages['ruleEditor.excutionCycle']}：</p>
                        }
                        { // 每周
                          time.timeCycle === 1 &&
                          <CheckboxGroup options={WeekArray} defaultValue={time.timeCycleWeek.split(',')} className="weekCycle" onChange={this.changeTimeCycle.bind(this, 'timeCycleWeek')} />
                        }
                        { // 每月
                          time.timeCycle === 2 &&
                          <CheckboxGroup options={MonthArray} defaultValue={time.timeCycleMonth.split(',')} onChange={this.changeTimeCycle.bind(this, 'timeCycleMonth')} />
                        }
                        <TimeSlider timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
                      </div>
                    </div>
                  )}
                >
                  <Input placeholder={window.__alert_appLocaleData.messages['ruleEditor.schedule']} readOnly value={cycleTimeString} className={styles.selectTime} />
                </Popover>
              </div>
            }
            {
              this.state.type === 1 &&
              <div className={styles.pickTimeWrap}>
                <Popover
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="pickTime"
                  content={(
                    <div className={styles.timeCycle}>
                      <RangeCalendar
                        // defaultSelectedValue={[moment(time.dayStart), moment(time.dayEnd)]}
                        onChange={this.changeDate.bind(this)} dateInputPlaceholder={[window.__alert_appLocaleData.messages['ruleEditor.startDate'], window.__alert_appLocaleData.messages['ruleEditor.endDate']]} className={styles.calendar} renderFooter={() => {
                        return (
                          <div className={styles.timeCycleBd}>
                            <TimeSlider timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
                          </div>
                        );
                      }} />

                    </div>
                  )}
                >
                  <Input placeholder={window.__alert_appLocaleData.messages['ruleEditor.schedule']} readOnly value={dayTimeString} className={styles.selectTime} />
                </Popover>
              </div>
            }
          </FormItem>
        </div>

        <h2>{window.__alert_appLocaleData.messages['ruleEditor.source']}</h2>
        <div className={styles.alertSource}>
          <FormItem
            {...itemLayout}
            label={window.__alert_appLocaleData.messages['ruleEditor.source']}
          >
            <Select
              style={{ width: 200 }}
              value={this.state.source === '' ? '' : this.state.source}
              onChange={this.changeSource.bind(this)}
            >
              <Option value="">{window.__alert_appLocaleData.messages['ruleEditor.phSource']}</Option>
              {
                this.props.alertAssociationRules.source.map(item => <Option key={item.key}>{item.value}</Option>)
              }
            </Select>
          </FormItem>
        </div>

        <h2>{window.__alert_appLocaleData.messages['ruleEditor.defineRule']}</h2>
        <div className={styles.defineConditions}>
          {
            this.createAll(condition, treeTag)
          }
        </div>

        <h2>{window.__alert_appLocaleData.messages['ruleEditor.setAct']}</h2>
        <div className={styles.setActions}>
          <Tabs className={styles.setActions} animated={false} activeKey={action.type[0].toString()} onChange={this.changeActionType.bind(this)}>

            <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.closeOrDel']} key="1" className={styles.actionDelOrClose}>
              <div>
                <em>{window.__alert_appLocaleData.messages['ruleEditor.word2']}</em>
                <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word1']}</span>
                <Select
                  style={{ width: 150 }}
                  value={action.actionDelOrClose ? action.actionDelOrClose.operation : undefined}
                  placeholder={window.__alert_appLocaleData.messages['ruleEditor.phCloseOrDel']}
                  onChange={this.changeAction.bind(this, 1)}
                >
                  <Option value={1}>{window.__alert_appLocaleData.messages['ruleEditor.del']}</Option>
                  <Option value={2}>{window.__alert_appLocaleData.messages['ruleEditor.close']}</Option>
                </Select>
                <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word4']}</span>
              </div>
            </TabPane>
            {
              // <TabPane tab="升级/降级告警" key="2"></TabPane>
            }
            <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.notify']} key="3" className={styles.actionNotification}>
              <div>
                <span className={styles.notificationTabsLabel}>{window.__alert_appLocaleData.messages['ruleEditor.notifyMode']}</span>
                <FormItem
                  {...desLayout}
                  label={window.__alert_appLocaleData.messages['ruleEditor.notifyObj']}
                >
                    <Select
                      mode="multiple"
                      style={{ width: 200 }}
                      placeholder={window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj']}
                      onChange={this.changeAction.bind(this, 3)}
                      className={styles.recipients}
                      value={this.state.recipients}
                    >
                      {
                        this.props.alertAssociationRules.users.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                      }
                    </Select>
                </FormItem>
                <Tabs animated={false} className={styles.notificationTabs}>
                  <TabPane tab={<div><Checkbox id="email" checked={this.state.email} value={1} onChange={this.changeAction.bind(this, 3)} /><span>{window.__alert_appLocaleData.messages['ruleEditor.email']}</span></div>} key="1">

                    <div>
                      <FormItem
                        label={window.__alert_appLocaleData.messages['ruleEditor.emailTitle']}
                        className={styles.mailTitle}
                      >
                          <Input id="emailTitle"
                            value={action.actionNotification ? action.actionNotification.notificationMode.emailTitle : undefined}
                            onChange={this.changeAction.bind(this, 3)} placeholder={window.__alert_appLocaleData.messages['ruleEditor.phTitle']} />

                      </FormItem>
                      <FormItem
                        label={window.__alert_appLocaleData.messages['ruleEditor.emailCon']}
                        className={styles.msgContent}
                      >
                          <Input id="emailMessage"
                            value={action.actionNotification ? action.actionNotification.notificationMode.emailMessage : undefined}
                            onChange={this.changeAction.bind(this, 3)} type="textarea" placeholder={window.__alert_appLocaleData.messages['ruleEditor.phBody']} />

                        <Popover overlayStyle={{ width: '45%' }} overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={this.emailVarContent}>
                          <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                        </Popover>
                      </FormItem>

                    </div>
                  </TabPane>
                  <TabPane tab={<div><Checkbox id="sms" checked={this.state.sms} value={2} onChange={this.changeAction.bind(this, 3)} /><span>{window.__alert_appLocaleData.messages['ruleEditor.sms']}</span></div>} key="2">
                    <div>
                      <FormItem
                        label={window.__alert_appLocaleData.messages['ruleEditor.smsCon']}
                        className={styles.msgContent}
                      >
                          <Input id="smsMessage"
                            value={action.actionNotification ? action.actionNotification.notificationMode.smsMessage : undefined}
                            onChange={this.changeAction.bind(this, 3)} type="textarea" placeholder={window.__alert_appLocaleData.messages['ruleEditor.phBody']} />

                          <Popover overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={this.smsVarContent}>
                            <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                          </Popover>
                      </FormItem>
                    </div>
                  </TabPane>
                  {
                    window.__alert_appLocaleData.locale === 'zh-cn' &&
                    <TabPane tab={<div><Checkbox id="chatops" checked={this.state.chatops} value={3} onChange={this.changeAction.bind(this, 3)} /><span>{window.__alert_appLocaleData.messages['ruleEditor.chatops']}</span></div>} key="3" />
                  }
                </Tabs>
              </div>
            </TabPane>
            <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.ticket']} key="4" className={styles.actionITSM}>
              <div>
                <FormItem
                  {...itsmLayout}
                  label={window.__alert_appLocaleData.messages['ruleEditor.itsmType']}
                >
                  <Select
                    style={{ width: 100 }}
                    placeholder={window.__alert_appLocaleData.messages['ruleEditor.phItsmType']}
                    value={action.actionITSM ? action.actionITSM.itsmModelId : undefined}
                    onChange={this.changeAction.bind(this, 4)}
                  >
                    {
                      this.props.alertAssociationRules.wos.map(item => <Option key={item.id}>{item.name}</Option>)
                    }
                  </Select>
                  <em className={styles.tip}>{window.__alert_appLocaleData.messages['ruleEditor.word3']}</em>
                </FormItem>
                <FormItem
                  {...itsmLayout}
                  label={window.__alert_appLocaleData.messages['ruleEditor.fm']}
                >
                  <Input className={cls(styles.text, {
                    // 'hidden': !(action.actionITSM && action.actionITSM.itsmModelId)
                  })} onChange={this.changeAction.bind(this, 4)}
                    value={this.state.ITSMParam}
                    type="textarea" placeholder={window.__alert_appLocaleData.messages['ruleEditor.fm']} />
                </FormItem>

              </div>
            </TabPane>
            <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.suppress']} key="5" className={styles.actionSuppress}>
              <div>
                <span>{window.__alert_appLocaleData.messages['ruleEditor.word5']}</span>
              </div>
            </TabPane>
            {
              window.__alert_appLocaleData.locale === 'zh-cn' &&
              <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.shareChatOps']} key="6">
                <div>
                  <span>{window.__alert_appLocaleData.messages['ruleEditor.chatopsGroup']}：</span>
                  <Select
                    style={{ width: 200 }}
                    value={action.actionChatOps ? action.actionChatOps.chatOpsRoomId : undefined }
                    placeholder={window.__alert_appLocaleData.messages['ruleEditor.phChatopsGroup']}
                    onChange={this.changeAction.bind(this, 6)}
                  >
                    {
                      this.props.alertAssociationRules.rooms.map(item => <Option key={item.id}>{item.topic}</Option>)
                    }
                  </Select>
                </div>
              </TabPane>
            }
          </Tabs>
        </div>
        <span onClick={this.handleSubmit.bind(this)} className={styles.submit}>{window.__alert_appLocaleData.messages['ruleEditor.submit']}</span>
      </Form>
    );
  }

  isChecked() {
    const _action = _.cloneDeep(this.state.action);
    let email = false;
    let sms = false;
    let chatops = false;
    let recipients = [];
    if (!_action.actionNotification) {
      _action.actionNotification = {
        recipients: [],
        notificationMode: {
          notificationMode: [],
          emailTitle: '${entityName}:${name}',
          emailMessage: '${severity}, ${entityName}, ${firstOccurTime}, ${description}',
          smsMessage: '${severity}, ${entityName}, ${firstOccurTime}, ${description}'
        }
      };
    }
    const mode = _action.actionNotification.notificationMode.notificationMode;
    for (let i = mode.length - 1; i >= 0; i -= 1) {
      if (mode[i] === 1) {
        email = true;
      }
      if (mode[i] === 2) {
        sms = true;
      }
      if (mode[i] === 3) {
        chatops = true;
      }
    }

    recipients = _action.actionNotification.recipients.map(item => item.userId);
    // debugger
    this.setState({
      email: email,
      sms: sms,
      chatops: chatops,
      recipients: recipients
    });
  }

  // 插入变量的内容
  vars(type) {
    const { field = [] } = this.props.alertAssociationRules;
    return (
      <div className={styles.varList}>
        {field.map(item => <span key={`${'${'}${item}${'}'}`} onClick={this.insertVar.bind(this, type, item)}>{item}</span>)}
      </div>
    );
  }

  // 插入变量
  insertVar(type, item, event) {
    const _action = _.cloneDeep(this.state.action);
    if (!_action.actionNotification) {
      _action.actionNotification = {
        recipients: [],
        notificationMode: {
          notificationMode: [],
          emailTitle: '${entityName}:${name}',
          emailMessage: '${severity}, ${entityName}, ${firstOccurTime}, ${description}',
          smsMessage: '${severity}, ${entityName}, ${firstOccurTime}, ${description}'
        }
      };
    }
    let mode = _action.actionNotification.notificationMode;
    mode[type] += '${' + item + '}';
    _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
    this.setState({
      action: _action
    });
  }

  changeAction(type, value) {
    const { dispatch } = this.props;
    const _action = _.cloneDeep(this.state.action);
    switch(type) {
      case 1: // 关闭/删除告警
        _action.actionDelOrClose = {
          operation: ''
        };
        _action.actionDelOrClose.operation = parseInt(value, 10);
        break;
      case 2: // 升级/降级告警
        break;
      case 3: // 告警通知
        if (!_action.actionNotification) {
          _action.actionNotification = {
            recipients: [],
            notificationMode: {
              notificationMode: [],
              emailTitle: '${entityName}:${name}',
              emailMessage: '${severity}, ${entityName}, ${firstOccurTime}, <1>description</1>',
              smsMessage: '${severity}, ${entityName}, ${firstOccurTime}, <1>description</1>'
            }
          };
        }
        let mode = _action.actionNotification.notificationMode;
        if (_.isArray(value)) { // 通知对象
          const { users } = this.props.alertAssociationRules;
          let arr = [];
          users.forEach((item, index) => {
            for (let i = value.length; i >= 0; i -= 1) {
              if (value[i] === item.userId) {
                arr.push({
                  userId: item.userId,
                  realName: item.realName,
                  mobile: item.mobile,
                  email: item.email
                }) ;
              }
            }
          });
          _action.actionNotification.recipients = arr;
          this.setState({
            recipients: arr.map(item => item.userId)
          });
        } else if (value.target.type === 'checkbox') { // 通知方式
          if (value.target.checked) { // 选中此通知方式
            mode.notificationMode.push(value.target.value);
            mode.notificationMode = _.uniq(mode.notificationMode);
            this.setState({
              [value.target.id]: true
            });
          } else { // 移除此通知方式
            mode.notificationMode = mode.notificationMode.filter(item => item !== value.target.value);
            this.setState({
              [value.target.id]: false
            });
          }
        } else { // 文本
          mode[value.target.id] = value.target.value;
        }
        _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
        break;
      case 4: // 告警派单
        if (!_action.actionITSM) {
          _action.actionITSM = {
            itsmModelId: undefined,
            param: undefined
          };
        }
        if (value.target) {
          _action.actionITSM.param = value.target.value.replace(/\s|\n/g, "");
          let _ITSMParam = value.target.value;
          console.log(_action.actionITSM.param)

          this.setState({
            ITSMParam: _ITSMParam
          });
        } else {
          _action.actionITSM.itsmModelId = value;
          // debugger;
          dispatch({
            type: 'alertAssociationRules/getshowITSMParam',
            payload: {
              id: value
            }
          });
        }
        break;
      case 5: // 抑制告警
        break;
      case 6: // 分享到Chatops
        _action.actionChatOps = {
          chatOpsRoomId: ''
        };
        _action.actionChatOps.chatOpsRoomId = value;
        break;
      default:
        throw new Error('未指定动作类型');
    }
    this.setState({
      action: _action
    });
  }

  // 更改动作类型
  changeActionType(value) {
    const _action = _.cloneDeep(this.state.action);
    _action.type = [parseInt(value, 10)];
    this.setState({
      action: _action
    });
  }

  // 创建条件头
  createTitle(node, level) {
    const { logic } = node;
    return (
      <div className={cls(
          styles.title,
          `treeTag${level}`
        )}
      >
        <Select value={logic} placeholder={window.__alert_appLocaleData.messages['ruleEditor.selectLogic']} onChange={this.changeTitleLogic.bind(this, node, level)}>
          <Option value="and">{window.__alert_appLocaleData.messages['ruleEditor.and']}</Option>
          <Option value="or">{window.__alert_appLocaleData.messages['ruleEditor.or']}</Option>
          <Option value="not">{window.__alert_appLocaleData.messages['ruleEditor.not']}</Option>
        </Select>
        <div className={styles.btnWrap}>
          {
            level !== 2 && // 三级条件不显示增加嵌套按钮
            <span onClick={this.addBlock.bind(this, node, level)} className={cls(styles.btn, styles.addBlock)}>{window.__alert_appLocaleData.messages['ruleEditor.addRow']}</span>
          }
          <span onClick={this.addLine.bind(this, node, level)} className={cls(styles.btn, styles.addLine)}>{window.__alert_appLocaleData.messages['ruleEditor.addCon']}</span>
        </div>
        {
          level !== 0 && // 一级条件不显示删除按钮
          <i className={styles.delete} onClick={this.deleteBlock.bind(this, node, level)}>X</i>
        }
      </div>
    );
  }

  changeField(type, event) {
    this.setState({
      [type]: event.target.value
    });
  }

  changeSource(value) {
    this.setState({
      source: value
    });
  }

  // 创建条件内容
  createConditionList(node, level) {
    const { content } = node;
    return content.map((_item, _index) => {
      const { key, opt, value} = _item;
      const itemData = {
        node,
        opt,
        value,
        level,
        source: this.props.alertAssociationRules.source || [],
        attributes: this.props.alertAssociationRules.attributes || {},
        _key: key,
        _this: this,
        index: _index,
        deleteLine: this.deleteLine,
        changeConditionContent: this.changeConditionContent
      };
      return <Condition {...itemData} />
    });
  }
  // 对数据进行深度遍历并创建 Dom
  // 深度优先
  createAll(node, treeTag) {
    const { complex = [] } = node;
    const domList = [];
    domList.push(
      this.createTitle(node, treeTag),
      this.createConditionList(node, treeTag)
    );
    for (let i = complex.length - 1; i >= 0; i -= 1) {
      // 先序遍历，treeTag + 1 是当前值 + 1，不会改变自身的值
      this.createAll(complex[i], treeTag + 1);
    }
    conditionsDom.unshift(domList);
    return conditionsDom;
  }

  // 修改条件头逻辑
  changeTitleLogic(item, level, value) {
    let _condition = _.cloneDeep(this.state.condition);
    this.treeControl('changeLogic', _condition, item, value);
    this.setState({
      condition: _condition
    });
  }

  // 修改条件内容
  changeConditionContent(item, index, contentType, value) {
    let _condition = _.cloneDeep(this.state.condition);
    this.treeControl(contentType, _condition, item, value, index);
    this.setState({
      condition: _condition
    });
  }

  /**
   * x 默认为为新建项
   * deleteLine 时，x 为索引
   * changeLogic 时，x 为逻辑值
   * conditionIndex 为条件 content 索引
   */
  treeControl(type, node, item, x, conditionIndex = null) {
    let { content = [] ,complex = [] } = node;
    if (node.id === item.id) { // 一级嵌套（增）一级条件（增、删）
      type === 'addBlock' && complex.push(x);
      type === 'addLine' && content.push(x);
      type === 'deleteLine' && content.splice(x, 1);
      if (type === 'changeLogic') {
        node.logic = x;
      }
      if (/key|opt|value/.test(type)) {
        if (type === 'key') {
          content[conditionIndex]['value'] = undefined;
        }
        if (x.target) {
          content[conditionIndex][type] = x.target.value;
        } else {
          content[conditionIndex][type] = x;
        }
      }
    } else { // 二、三级嵌套（增、删）二、三级条件（增、删）
      for (let i = complex.length - 1; i >= 0; i -= 1) {
        if (item.id === complex[i].id) {
          type === 'deleteBlock' && complex.splice(i, 1);
          type === 'addBlock' && complex[i].complex.push(x);
          type === 'deleteLine' && complex[i].content.splice(i, 1);
          type === 'addLine' && complex[i].content.push(x);
          if (type === 'changeLogic') {
            complex[i].logic = x;
          }
          if (/key|opt|value/.test(type)) {
            if (type === 'key') {
              complex[i].content[conditionIndex]['value'] = undefined;
            }
            if (x.target) {
              complex[i].content[conditionIndex][type] = x.target.value;
            } else {
              complex[i].content[conditionIndex][type] = x;
            }
          }
        } else {
          this.treeControl(type, complex[i], item, x, conditionIndex);
        }
      }
    }
  }

  // 删除嵌套
  deleteBlock(item, level, event) {
    const _condition = _.cloneDeep(this.state.condition);
    this.treeControl('deleteBlock', _condition, item);
    this.setState({
      condition: _condition
    });
  }

  // 增加嵌套
  addBlock(item, level, event) {
    const _condition = _.cloneDeep(this.state.condition);
    const newBlock = {
      id: leafTag,
      content: [],
      complex: [],
      logic: undefined
    };
    leafTag += 1;
    this.treeControl('addBlock', _condition, item, newBlock);
    this.setState({
      condition: _condition
    });
  }

  // 删除条件
  deleteLine(item, level, index, event) {
    console.log(this);
    const _condition = _.cloneDeep(this.state.condition);
    this.treeControl('deleteLine', _condition, item, index);
    this.setState({
      condition: _condition
    });
  }

  // 增加条件
  addLine(item, level, event) {
    const _condition = _.cloneDeep(this.state.condition);
    const newLine = {
      key: undefined,
      opt: undefined,
      value: undefined
    };
    this.treeControl('addLine', _condition, item, newLine);
    this.setState({
      condition: _condition
    });
  }

  // 更改规则类型
  changeType(event) {
    this.setState({
      type: event.target.value,
    });
  }

  // 更改时间周期类型
  changeTimeCycleType(type, event) {
    const _time = _.cloneDeep(this.state.time);
    _time.timeCycle = type;
    this.setState({
      time: _time
    });
  }


  // 更改时间周期
  changeTimeCycle(name, options) {
    console.log(options);
    const _time = _.cloneDeep(this.state.time);
    _.remove(options, item => item === '');
    _time[name] = _.uniq(options).sort((pre, next) => pre - next).join(',');
    this.setState({
      time: _time
    });
  }

  // 更改执行时间
  changeTime(name, type, value) {
    const _time = _.cloneDeep(this.state[name]);
    _time[type] = value;
    if (name === 'timeStart') {
      this.setState({
        timeStart: _time
      });
    } else {
      this.setState({
        timeEnd: _time
      });
    }
  }

  // 更改固定时间段, momentArray 为一个数组，包含起始时间和结束时间
  changeDate(momentArray) {
    if (momentArray.length >= 2) {
      const _time = _.cloneDeep(this.state.time);
      for (let i = 0, len = momentArray.length; i < len; i += 1) {
        let _day = moment(momentArray[i]).format().toString(); // 当前日历组件选择的时间
        i === 0
          ? _time['dayStart'] = _day
          : _time['dayEnd'] = _day;
      }
      this.setState({
        time: _time
      });
    }
  }

  handleSubmit(event) {
    const { dispatch, form, alertAssociationRules } = this.props;
    const { name, description, type, source, condition, time, timeStart, timeEnd, action } = this.state;

    event.preventDefault();

    let _time = {};
    let hmStart = `${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")}:00`;
    let hmEnd = `${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}:00`;
    let local = moment().format().substr(19, 6);
    /* 动作 */
    let _actionDelOrClose = undefined;
    let _actionNotification = undefined;
    let _actionITSM = undefined;
    let _actionSuppress = undefined;
    let _actionChatOps = undefined;

    switch(type) {

      case 2: // 周期
        if (_time.timeCycle === 1) { // 每周
          _time.timeCycle = time.timeCycle;
          _time.timeCycleWeek = time.timeCycleWeek;
        }
        if (_time.timeCycle === 2) { // 每月
          _time.timeCycle = time.timeCycle;
          _time.timeCycleMonth = time.timeCycleMonth;
        }
        _time.timeStart = `${hmStart}${local}`;
        _time.timeEnd = `${hmEnd}${local}`;
        break;
      case 1: // 固定
        _time.dayStart = time.dayStart.replace(time.dayStart.substr(11, 8), hmStart).replace('+', '+');
        _time.dayEnd = time.dayEnd.replace(time.dayStart.substr(11, 8), hmEnd).replace('+', '+');
        break;
      default:
        break;
    }
    switch(action.type[0]) {
      case 1:
        _actionDelOrClose = action.actionDelOrClose;
        break;
      case 3:
        _actionNotification = action.actionNotification;
        break;
      case 4:
        _actionITSM = action.actionITSM;
        break;
      case 5:
        _actionSuppress = action.actionSuppress;
        break;
      case 6:
        _actionChatOps = action.actionChatOps;
        break;
      default:
        break;
    }

    let __condition = makeCondition(condition, false);
    const params = {
      rule: {
        id: _.isEmpty(alertAssociationRules.currentEditRule) ? undefined : alertAssociationRules.currentEditRule.rule.id,
        name,
        description,
        type,
        time: type === 0 ? undefined : _time,
        source,
        condition: __condition,
      },
      action: {
        id: _.isEmpty(alertAssociationRules.currentEditRule) ? undefined : alertAssociationRules.currentEditRule.action.id,
        tenant: undefined,
        type: action.type,
        actionDelOrClose: _actionDelOrClose,
        actionNotification: _actionNotification,
        actionITSM: _actionITSM,
        actionSuppress: _actionSuppress,
        actionChatOps: _actionChatOps
      }
    };
    dispatch({
      type: 'alertAssociationRules/createRule',
      payload: {
        ...params
      }
    });

  }
}

RuleEditor.defaultProps = {
  name: '',
  description: '',
  type: 0,
  time: {
    // dayStart: moment().format(),
    // dayEnd: moment().format(),
    dayStart: '',
    dayEnd: '',
    timeCycle: 0,
    timeCycleWeek: '',
    timeCycleMonth: '',
    timeStart: '',
    timeEnd: ''
  },
  source: '',
  condition: {
    content: [
      {
        key: undefined,
        opt: undefined,
        value: undefined
      }
    ],
    complex: [],
    logic: undefined
  },
  // condition: conditionData,
  action: {
    tenant: '',
    type: [1],
    actionDelOrClose: {
      operation: undefined
    },
    actionNotification: {
      recipients: [],
      notificationMode: {
        notificationMode: [],
        emailTitle: '${entityName}:${name}',
        emailMessage: '${severity}, ${entityName}, ${firstOccurTime}, ${description}',
        smsMessage: '${severity}, ${entityName}, ${firstOccurTime}, ${description}'
      }
    },
    actionITSM: {
      itsmModelId: undefined,
      param: ''
    },
    actionChatOps: {
      chatOpsRoomId: undefined
    }
  },
  insertVars: []
};

RuleEditor.propTypes = {
  /* 基本信息 */
  // 规则名称
  name: PropTypes.string.isRequired,
  // 规则描述
  description: PropTypes.string.isRequired,
  // 规则类型（0:任意时间执行；1:周期性执行；2:固定时间段执行）
  type: PropTypes.number.isRequired,
  time: PropTypes.shape({
    // 固定时间段执行必填（在未来确定的某一时间段执行一次）
    dayStart: PropTypes.string,
    dayEnd: PropTypes.string,

    // 周期性执行必填（0：每天；1：每周；2：每月）
    timeCycle: PropTypes.number,
    // 时间周期为每周必填（0～6：周一～周日）
    timeCycleWeek: PropTypes.string,
    // 时间周期为每月必填（0～30:1号～31号）
    timeCycleMonth: PropTypes.string,
    timeStart: PropTypes.string,
    timeEnd: PropTypes.string
  }),

  /* 告警来源 */
  source: PropTypes.string,

  /* 定义条件 */
  condition: PropTypes.shape({
    content: PropTypes.array.isRequired,
    complex: PropTypes.array.isRequired,
    logic: PropTypes.string
  }),

  /* 设定动作 */
  action: PropTypes.shape({
    tenant: PropTypes.string.isRequired, // 租户 id
    //DELETE_OR_CLOSE(1, "关闭/删除告警"),
    //UPGRADE_OR_DEGRADE(2, "升级/降级告警"),
    //NOTIFICATION(3, "告警通知"),
    //ITSM_TICKET(4, "告警派单"),
    //SUPPRESS(5, "抑制告警"),
    //CHATOPS_GROUP(6, "分享到Chatops"); 下同
    type: PropTypes.array.isRequired, // 目前动作类型只支持单选，防止需求变更，用数组来存
    actionDelOrClose: PropTypes.shape({
      //具体动作:
      //DELETE(1, "删除"),
      //CLOSE(2, "关闭"),
      //UPGRADE(3, "升级"),
      //DEGRADE(4, "降级");
      operation: PropTypes.number
    }),
    actionNotification: PropTypes.shape({
      recipients: PropTypes.array.isRequired,
      notificationMode: PropTypes.shape({
        // EMAIL(1，"电子邮件")，SMS(2，"短信")，CHATOPS_PRIVATE(3，"Chatops私聊")，多选
        notificationMode: PropTypes.array.isRequired,
        emailTitle: PropTypes.string.isRequired,
        emailMessage: PropTypes.string.isRequired,
        smsMessage: PropTypes.string.isRequired
      })
    }),
    actionITSM: PropTypes.shape({
      itsmModelId: PropTypes.string,
      param: PropTypes.string
    }),
    actionChatOps: PropTypes.shape({
      chatOpsRoomId: PropTypes.string
    }),
  })
};

export default RuleEditor;
// export default Form.create()(RuleEditor);
// export default Form.create({
//   mapPropsToFields: (props) => {
//     return {
//       name: {
//         value: props.name
//       },
//       description: {
//         value: props.description
//       }
//     }
//   }
// })(RuleEditor);
