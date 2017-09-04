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
    Checkbox,
    Row,
    Col
} from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import Condition from './condition';
import NotificationList from './notificationList';
import CustomField from './customField.js';

//import mockdata from './itsm.js'

import limitField from './formMaterial/limitField.js'
import TimeSlider from './timeSlider';
import LeaveNotifyModal from '../common/leaveNotifyModal/index'

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
    }, {
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
    { label: window.__alert_appLocaleData.messages['ruleEditor.email'], value: 1 },
    { label: window.__alert_appLocaleData.messages['ruleEditor.sms'], value: 2 },
    { label: window.__alert_appLocaleData.messages['ruleEditor.shareChatOps'], value: 3 }
]
const WeekArray = [
    { label: window.__alert_appLocaleData.messages['ruleEditor.mon'], value: '0' },
    { label: window.__alert_appLocaleData.messages['ruleEditor.tue'], value: '1' },
    { label: window.__alert_appLocaleData.messages['ruleEditor.wed'], value: '2' },
    { label: window.__alert_appLocaleData.messages['ruleEditor.thu'], value: '3' },
    { label: window.__alert_appLocaleData.messages['ruleEditor.fri'], value: '4' },
    { label: window.__alert_appLocaleData.messages['ruleEditor.sat'], value: '5' },
    { label: window.__alert_appLocaleData.messages['ruleEditor.sun'], value: '6' }
];
const MonthArray = _.range(31).map(item => {
    return {
        label: item + 1,
        value: item.toString()
    };
});
const arrow = cls(
  'icon',
  'icon-arrowdown',
  'iconfont'
)
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
    peroid1: {
        id: 'ruleEditor.peroid1',
        defaultMessage: '周期性时间点执行'
    },
    fixedTime: {
        id: 'ruleEditor.fixedTime',
        defaultMessage: '固定时间段执行'
    },
    fixedTime1: {
        id: 'ruleEditor.fixedTime1',
        defaultMessage: '固定时间点执行'
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

const initalNotificationMode = {
    notificationMode: [],
    emailTitle: '${entityName}:${name}',
    emailMessage: '${severity},${entityName},${firstOccurTime},${description}',
    smsMessage: '${severity},${entityName},${firstOccurTime},${description}',
    webNotification: {
      title: '${name}',
      message: '${severity},${entityName},${description}',
      playTimeType: 'ONECE', // {string} ONECE --> 一次， TENSEC --> 10s，TIMEOUT --> 直到超时
      voiceType: '01', // {string}
      timeOut: 30 // {number} 秒记，上限 30 分钟
    }
}

const initActions = {
    actionDelOrClose: {
        operation: undefined
    },
    actionNotification: {
        notifyWhenLevelUp: true,
        recipients: [],
        notificationMode: initalNotificationMode
    },
    actionITSM: {
        itsmModelId: undefined,
        itsmModelName: undefined,
        realParam: '',
        viewParam: '' //临时存放数据
    },
    actionChatOps: {
        notifyWhenLevelUp: true,
        chatOpsRoomId: undefined
    },
    actionUpgrade: {
        notificationGroupings: [{
            delay: 15,
            status: [],
            recipients: []
        }],
        notificationMode: {
            notificationMode: [],
            emailTitle: '${entityName}:${name}',
            emailMessage: '${severity},${entityName},${firstOccurTime},${description}',
            smsMessage: '${severity},${entityName},${firstOccurTime},${description}'
        }
    },
    actionSeverity: {
        type: undefined,
        fixedSeverity: undefined
    },
    actionPlugin: {
        uuid: undefined,
        name: undefined,
        realParam: ''
    }
}

class RuleEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // name: props.name,
            // description: props.description,
            /* 时间 */
            type: props.type,
            time: props.time,
            timeStart: props.timeStart,
            timeEnd: props.timeEnd,
            /* 来源 */
            source: props.source,
            /* 条件 */
            condition: makeCondition(_.cloneDeep(props.condition)),
            /* 动作 */
            action: props.action,
            isShareUpgrade: false,
            email: false,
            sms: false,
            chatops: false,
            audio: false,
            recipients: [],
            ITSMParam: {},
            PluginParam: {},
            /* 适用范围 */
            target: props.target,
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'alertAssociationRules/initQuery'
        })
    }
    componentDidMount() {
      this.isNeedLeaveCheck = true;
    }
    componentWillReceiveProps(nextProps, nextState) {
        // 用户模糊查询
        if (nextProps.alertAssociationRules.users !== this.props.alertAssociationRules.users) {
          let state = _.cloneDeep(this.state)
          this.setState({ ...state, recipients: this.state.recipients })
          return;
        }
        if (nextProps.name && nextProps.action !== this.props.action) {
            const {
                dayStart = '',
                dayEnd = '',
                timeCycle = 0,
                timeCycleWeek = '',
                timeCycleMonth = '',
                timeStart = '',
                timeEnd = ''
            } = nextProps.time;

            let _timeStart = {
                    hours: 0,
                    mins: 0
                },
                _timeEnd = {
                    hours: 23,
                    mins: 59
                };
            if (nextProps.time.dayStart && nextProps.time.dayEnd) {
                _timeStart.hours = nextProps.time.dayStart.substr(11, 2);
                _timeStart.mins = nextProps.time.dayStart.substr(14, 2);
                _timeEnd.hours = nextProps.time.dayEnd.substr(11, 2);
                _timeEnd.mins = nextProps.time.dayEnd.substr(14, 2);
            } else if (nextProps.time.timeStart && nextProps.time.timeEnd) {
                _timeStart.hours = nextProps.time.timeStart.substr(0, 2);
                _timeStart.mins = nextProps.time.timeStart.substr(3, 2);
                _timeEnd.hours = nextProps.time.timeEnd.substr(0, 2);
                _timeEnd.mins = nextProps.time.timeEnd.substr(3, 2);
            }

            let result = this.editorRuleAction(nextProps) // action 初始化

            this.setState({
                name: nextProps.name,
                time: {
                    dayStart,
                    dayEnd,
                    timeCycle,
                    timeCycleWeek,
                    timeCycleMonth,
                    timeStart,
                    timeEnd
                },
                description: nextProps.description,
                type: nextProps.type,
                target: nextProps.target,
                source: nextProps.source,
                condition: makeCondition(_.cloneDeep(nextProps.condition)),
                action: result._actions,
                isShareUpgrade: result.isShareUpgrade || false,
                timeStart: _timeStart,
                timeEnd: _timeEnd,
                ITSMParam: nextProps.ITSMParam,
                PluginParam: nextProps.PluginParam
            });
        }
        // ITSMParam
        if (nextProps.alertAssociationRules.ITSMParam !== this.props.alertAssociationRules.ITSMParam) {
            let _ITSMParam = nextProps.alertAssociationRules.ITSMParam;
            this.setState({
              ITSMParam: _ITSMParam
            })
        }
        // PluginParam
        if (nextProps.alertAssociationRules.PluginParam !== this.props.alertAssociationRules.PluginParam) {
            let _pluginParam = nextProps.alertAssociationRules.PluginParam;
            this.setState({
              PluginParam: _pluginParam
            })
        }
        this.isChecked(nextProps);
    }

    editorRuleAction(props) {
        let _action = _.cloneDeep(props.action);
        let _actions = _.cloneDeep(initActions)

        let isShareUpgrade = false;
        let _actionType = _action.type;
        // 不同action的情况
        if (_actionType.includes(3)) {
          _actionType = [3] // 告警升级 + 告警通知
          if(_action.actionUpgrade) {
            isShareUpgrade = true
          }
          _action.type = _actionType
        }
        // inject other actions initvalue
        if (_actionType.length) { // 现阶段只允许一个动作，后期如果有多动作，这里要重新处理
          _actions = {
            ...initActions,
            ..._action
          }
        }

        return {
          _actions,
          isShareUpgrade
        }
    }

    render() {
        conditionsDom = []; // 重置，防止重复 render
        const { time, timeStart, timeEnd, source, condition, action, email, sms, chatops, audio, target, isShareUpgrade } = this.state;

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
        };

        const checkedState = { // 通知方式勾选状态
            email, sms, chatops, audio
        };

        // 时间选择器选择之后的文字信息反馈，用'、'号隔开，同类信息用','隔开
        let cycleDay = '';
        switch (time.timeCycle) {
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

        const cycleTimeString = (() => {
            if (time.timeCycle >= 0) {
                return target === 0
                    ? `${cycleDay}${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")} ~ ${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}`
                    : `${cycleDay}${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")}`;
            } else {
                return '';
            }
        })();
        const dayTimeString = (() => {
            if (time.dayStart && time.dayEnd) {
                return target === 0
                    ? `${moment(time.dayStart).format('YYYY-MM-DD')} ~ ${moment(time.dayEnd).format('YYYY-MM-DD')}、${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")} ~ ${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}`
                    : `${moment(time.dayStart).format('YYYY-MM-DD')} ~ ${moment(time.dayEnd).format('YYYY-MM-DD')}、${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")}`;
            } else {
                return '';
            }
        })();

        //console.info('[state]', this.state);

        this.emailVarContent = this.vars('emailMessage');
        this.smsVarContent = this.vars('smsMessage');
        this.audioVarContent = this.vars('webAudioMessage')

        return (
            <div id="RuleEditor" className="ant-form ant-form-horizontal">

                <h2>{window.__alert_appLocaleData.messages['ruleEditor.baseInfo']}</h2>
                <div className={styles.baseInfo}>
                    <FormItem
                        {...itemLayout}
                        label={window.__alert_appLocaleData.messages['ruleEditor.ruleName']}
                    >
                        <Input style={{ width: 200 }} value={this.state.name} onChange={this.changeField.bind(this, 'name')} placeholder={window.__alert_appLocaleData.messages['ruleEditor.phRuleName']} />

                    </FormItem>
                    <FormItem
                        {...desLayout}
                        label={window.__alert_appLocaleData.messages['ruleEditor.description']}
                    >
                        <Input value={this.state.description} onChange={this.changeField.bind(this, 'description')} type="textarea" placeholder={window.__alert_appLocaleData.messages['ruleEditor.phDescription']} />
                    </FormItem>
                    <FormItem
                        {...desLayout}
                        label={window.__alert_appLocaleData.messages['ruleEditor.target']}
                    >
                        <Select
                            getPopupContainer={() =>document.getElementById("content")}
                            style={{ width: 200 }}
                            onChange={this.changeTarget.bind(this)}
                            value={this.state.target}
                        >
                            <Option value={0}>{window.__alert_appLocaleData.messages['ruleEditor.newTarget']}</Option>
                            <Option value={1}>{window.__alert_appLocaleData.messages['ruleEditor.oldTarget']}</Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        {...desLayout}
                        label={window.__alert_appLocaleData.messages['ruleEditor.excuteTime']}
                    >
                        <RadioGroup
                            onChange={this.changeType.bind(this)}
                            value={this.state.type}
                        >

                            {
                                target === 0 &&
                                <Radio value={0}><FormattedMessage {...formatMessages['anyTime']} /></Radio>
                            }
                            <Radio value={2}>
                                {
                                    target === 0
                                        ? <FormattedMessage {...formatMessages['peroid']} />
                                        : <FormattedMessage {...formatMessages['peroid1']} />
                                }
                            </Radio>
                            <Radio value={1}>
                                {
                                    target === 0
                                        ? <FormattedMessage {...formatMessages['fixedTime']} />
                                        : <FormattedMessage {...formatMessages['fixedTime1']} />
                                }
                            </Radio>
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
                                            <div className={cls(styles.timeCycleBd, {
                                                [styles.hidden]: time.timeCycle && time.timeCycle.length === 0
                                            })}>
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
                                                <TimeSlider target={this.state.target} timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
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
                                                            <TimeSlider target={this.state.target} timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
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
                            getPopupContainer={() =>document.getElementById("content")}
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
                <div>
                    <Tabs className={styles.setActions} animated={false} activeKey={action.type[0].toString()} onChange={this.changeActionType.bind(this)}>
                        {/* 关闭/删除告警 */}
                        <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.closeOrDel']} key="1" className={styles.actionDelOrClose}>
                            <div>
                                <em>{window.__alert_appLocaleData.messages['ruleEditor.word2']}</em>
                                <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word1']}</span>
                                <Select
                                    getPopupContainer={() =>document.getElementById("content")}
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
                        {/* 告警升级/通知 */}
                        <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.upgradeAndNotify']} key="3" className={styles.actionNotification}>
                            {/*通知*/}
                            <div>
                                <FormItem
                                    {...desLayout}
                                    label={window.__alert_appLocaleData.messages['ruleEditor.notifyObj']}
                                >
                                    <Select
                                        getPopupContainer={() =>document.getElementById("content")}
                                        mode="multiple"
                                        labelInValue
                                        style={{ width: 200 }}
                                        filterOption={false}
                                        placeholder={window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj']}
                                        onChange={this.changeAction.bind(this, 3)}
                                        className={styles.recipients_notify}
                                        value={this.state.recipients}
                                        onSearch={
                                          _.debounce( (value) => {
                                            this.userSearch(value)
                                          }, 500)
                                        }
                                    >
                                        {
                                            this.props.alertAssociationRules.users.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                                <div className={styles.NotificationListWrap}>
                                    <div className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.notifyMode']}</div>
                                    <NotificationList
                                        checkedState={checkedState}
                                        changeAction={this.changeAction.bind(this)}
                                        changeActionByAudio={this.changeActionByAudio.bind(this)}
                                        action={action}
                                        smsVarContent={this.smsVarContent}
                                        emailVarContent={this.emailVarContent}
                                        audioVarContent={this.audioVarContent}
                                        alertAssociationRules={this.props.alertAssociationRules}
                                    />
                                </div>
                                {
                                    this.state.target === 0 &&
                                    <div>
                                      <Checkbox className={styles.nLevelUp} checked={action.actionNotification && action.actionNotification.notifyWhenLevelUp} onChange={this.changeNotifyLevelUp.bind(this, 3)}>{window.__alert_appLocaleData.messages['ruleEditor.nLevelUp']}</Checkbox>
                                      <Checkbox className={styles.shareUpgrade} checked={isShareUpgrade} onChange={this.changeShareUpgrade.bind(this)}>{window.__alert_appLocaleData.messages['ruleEditor.isShareUpgrade']}</Checkbox>
                                    </div>
                                }
                            </div>
                            {/*升级*/}
                            {
                                this.state.target === 0 && isShareUpgrade &&
                                <div>
                                    <div className={styles.upgradelabel}>{window.__alert_appLocaleData.messages['ruleEditor.upgradelabel']}</div>
                                    {
                                        action.actionUpgrade.notificationGroupings.map((item, index) => {
                                            if (item) {
                                                return (
                                                    // 此处可能有BUG：数据的key值不是唯一
                                                    <div key={index} className={styles.reclist}>
                                                        <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word9']}</span>
                                                        <Input style={{ width: 50 }} defaultValue={item.delay} onBlur={this.changeUpgrade.bind(this, index)} />
                                                        <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word6']}</span>
                                                        <Select
                                                            // mode="multiple"
                                                            style={{ width: 180 }}
                                                            placeholder={window.__alert_appLocaleData.messages['ruleEditor.word8']}
                                                            onChange={this.changeUpgradeMode.bind(this, index)}
                                                            value={(() => {
                                                                if (item.status.length === 2) {
                                                                    return 0;
                                                                } else if (item.status.length === 1) {
                                                                    return item.status[0] === 255 ? 2 : 1;
                                                                } else {
                                                                    return undefined;
                                                                }
                                                            })()}
                                                        >
                                                            <Option value={0}>{window.__alert_appLocaleData.messages['ruleEditor.s1']}</Option>
                                                            <Option value={1}>{window.__alert_appLocaleData.messages['ruleEditor.s3']}</Option>
                                                            <Option value={2}>{window.__alert_appLocaleData.messages['ruleEditor.s5']}</Option>
                                                            {/* <Option value={255}>{window.__alert_appLocaleData.messages['ruleEditor.s4']}</Option> */}
                                                        </Select>
                                                        <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word7']}</span>
                                                        <Select
                                                            style={{ width: 250 }}
                                                            mode="multiple"
                                                            labelInValue
                                                            filterOption={false}
                                                            placeholder={window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj']}
                                                            onChange={this.changeUpgradeRecipients.bind(this, index)}
                                                            value={item.recipients.map(item => ({key: item.userId, label: item.realName}))}
                                                            onSearch={
                                                              _.debounce( (value) => {
                                                                this.userSearch(value)
                                                              }, 500)
                                                            }
                                                        >
                                                            {
                                                                this.props.alertAssociationRules.users.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                                                            }
                                                        </Select>
                                                        {
                                                            index === 0
                                                                ? <i className={styles.addUper} onClick={this.addNotificationGroup.bind(this)}>+</i>
                                                                : <i className={styles.delUper} onClick={this.delNotificationGroup.bind(this, index)}>X</i>
                                                        }
                                                    </div>
                                                );
                                            } else {
                                                return null;
                                            }

                                        })
                                    }
                                </div>
                            }
                        </TabPane>
                        {/* 告警派单 */}
                        <TabPane disabled={this.props.alertAssociationRules.wos.length === 0 ? true : false} tab={window.__alert_appLocaleData.messages['ruleEditor.ticket']} key="4">
                            <CustomField
                              ref={ node => this.formByItsm = node }
                              titlePlacholder={window.__alert_appLocaleData.messages['ruleEditor.itsmType']}
                              tip={window.__alert_appLocaleData.messages['ruleEditor.word3']}
                              vars={this.props.alertAssociationRules.field || []}
                              types={ this.props.alertAssociationRules.wos }
                              type={ action.actionITSM ? action.actionITSM.itsmModelId : undefined }
                              isNeedVars={true}
                              params={ this.state.ITSMParam }
                              changeType={ this.changeAction.bind(this, 4) }
                            />
                        </TabPane>
                        {/* 抑制告警 */}
                        {
                            this.state.target !== 1 &&
                            <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.suppress']} key="5" className={styles.actionSuppress}>
                                <div>
                                    <span>{window.__alert_appLocaleData.messages['ruleEditor.word5']}</span>
                                </div>
                            </TabPane>
                        }
                        {/* 分享到ChatOps */}
                        {
                            <TabPane disabled={this.props.alertAssociationRules.rooms.length === 0 ? true : false} tab={window.__alert_appLocaleData.messages['ruleEditor.shareChatOps']} key="6">
                                <div style={{marginBottom: '20px'}}>
                                    <span>{window.__alert_appLocaleData.messages['ruleEditor.chatopsGroup']}：</span>
                                    <Select
                                        getPopupContainer={() =>document.getElementById("content")}
                                        style={{ width: 200 }}
                                        value={action.actionChatOps ? action.actionChatOps.chatOpsRoomId : undefined}
                                        placeholder={window.__alert_appLocaleData.messages['ruleEditor.phChatopsGroup']}
                                        onChange={this.changeAction.bind(this, 6)}
                                    >
                                        {
                                            this.props.alertAssociationRules.rooms.map(item => <Option key={item.id}>{item.topic}</Option>)
                                        }
                                    </Select>
                                </div>
                                {
                                    this.state.target === 0 &&
                                    <Row>
                                      <Checkbox className={styles.nLevelUp} style={{left: '0px'}} checked={action.actionChatOps && action.actionChatOps.notifyWhenLevelUp} onChange={this.changeNotifyLevelUp.bind(this, 6)}>{window.__alert_appLocaleData.messages['ruleEditor.nLevelUp']}</Checkbox>
                                    </Row>
                                }
                            </TabPane>
                        }
                        {/* 修改告警级别 */}
                        {
                            <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.actionSeverity']} key="7">
                                <div className={styles.actionSeverity}>
                                  <p>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.severity']}</p>
                                  <div className={styles.content}>
                                    <Select
                                        getPopupContainer={ () => {
                                            return document.getElementById("content") || document.body
                                        } }
                                        style={{ width: 100 }}
                                        placeholder={ window.__alert_appLocaleData.messages['ruleEditor.actionSeverity'] }
                                        value={ action.actionSeverity ? action.actionSeverity.type : undefined }
                                        onChange={ (value) => { this.changeAction(7, { type: value }) } }
                                    >
                                        <Option value='1'>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.fixed']}</Option>
                                        <Option value='2'>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.up']}</Option>
                                        <Option value='3'>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.down']}</Option>
                                    </Select>
                                    {
                                        action.actionSeverity && action.actionSeverity.type === '1' ?
                                        <i className={cls(arrow, styles.arrow)}></i> : undefined
                                    }
                                    {
                                        action.actionSeverity && action.actionSeverity.type === '1' ?
                                        <Select
                                            getPopupContainer={ () => {
                                                return document.getElementById("content") || document.body
                                            } }
                                            style={{ width: 100 }}
                                            placeholder={ window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.fixed'] }
                                            value={ action.actionSeverity ? action.actionSeverity.fixedSeverity : undefined }
                                            onChange={ (value) => { this.changeAction(7, { fixedSeverity: value }) } }
                                        >
                                            <Option value="3" >{window['_severity']['3']}</Option>
                                            <Option value="2" >{window['_severity']['2']}</Option>
                                            <Option value="1" >{window['_severity']['1']}</Option>
                                            <Option value="0" >{window['_severity']['0']}</Option>
                                        </Select>
                                        : undefined
                                    }
                                  </div>
                                </div>
                            </TabPane>
                        }
                        {/* 动作插件 */}
                        {
                            this.props.alertAssociationRules.plugins.length ?
                            <TabPane tab={window.__alert_appLocaleData.messages['ruleEditor.actionPlugin']} key="100">
                                <CustomField
                                  ref={ node => this.formByPlugin = node }
                                  titlePlacholder={window.__alert_appLocaleData.messages['ruleEditor.pluginType']}
                                  vars={this.props.alertAssociationRules.field || []}
                                  types={ this.props.alertAssociationRules.plugins }
                                  type={ action.actionPlugin ? action.actionPlugin.uuid : undefined }
                                  isNeedVars={false}
                                  params={ this.state.PluginParam }
                                  changeType={ this.changeAction.bind(this, 100) }
                                />
                            </TabPane>
                            : []
                        }
                    </Tabs>
                </div>
                <LeaveNotifyModal route={ this.props.route } needLeaveCheck={() => {
                  return this.isNeedLeaveCheck;
                }}/>
                <span onClick={this.handleSubmit.bind(this)} className={styles.submit}>{window.__alert_appLocaleData.messages['ruleEditor.submit']}</span>
            </div>
        );
    }

    userSearch(value) {
      this.props.dispatch({
        type: 'alertAssociationRules/ownerQuery',
        payload: {
          realName: value
        }
      })
    }

    isChecked(props) {
        const _action = _.cloneDeep(props.action);
        let email = false;
        let sms = false;
        let chatops = false;
        let audio = false;
        let recipients = [];
        if (!_action.actionNotification) {
            _action.actionNotification = {
                recipients: [],
                notifyWhenLevelUp: false,
                notificationMode: initalNotificationMode
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
            if (mode[i] === 5) {
                audio = true
            }
        }

        recipients = _action.actionNotification.recipients.map(item => ({key: item.userId, label: item.realName}));
        this.setState({
            email: email,
            sms: sms,
            chatops: chatops,
            audio: audio,
            recipients: recipients
        });
    }

    // 是否需要告警升级
    changeShareUpgrade(event) {
      this.setState({
          isShareUpgrade: event.target.checked
      });
    }

    changeNotifyLevelUp(type, event) {
        const _action = _.cloneDeep(this.state.action);
        switch (type) {
          case 3:
            _action.actionNotification.notifyWhenLevelUp = event.target.checked;
            break;
          case 6:
            _action.actionChatOps.notifyWhenLevelUp = event.target.checked;
            break;
          default:
            break;
        }
        this.setState({
            action: _action
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
                notificationMode: initalNotificationMode
            };
        }
        let mode = _action.actionNotification.notificationMode;
        switch (type) {
          case 'webAudioMessage':
            mode['webNotification']['message'] += '${' + item + '}';
            break;
          default:
            mode[type] += '${' + item + '}';
            break;
        }
        _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
        this.setState({
            action: _action
        });
    }

    changeUpgrade(index, event) {
        const _action = _.cloneDeep(this.state.action);
        _action.actionUpgrade.notificationGroupings[index].delay = event.target.value;
        this.setState({
            action: _action
        });
    }

    changeUpgradeMode(index, value) {
        const _action = _.cloneDeep(this.state.action);
        let val = [];
        switch(value) {
            case 0:
                val = [150, 190]
                break;
            case 1:
                val = [150]
                break;
            case 2:
                val = [255]
                break;
            default:
                break;
        }
        _action.actionUpgrade.notificationGroupings[index].status = val;
        this.setState({
            action: _action
        });
    }

    changeUpgradeRecipients(index, value) {
        const _action = _.cloneDeep(this.state.action);
        const { users } = this.props.alertAssociationRules;
        let empty = [];
        let arr = [].concat(_action.actionUpgrade.notificationGroupings[index].recipients);
        if (arr.length > value.length) {
          // 删除的情况
          arr.forEach((item) => {
            for (let i = value.length; i >= 0; i -= 1) {
                if (value[i] && value[i]['key'] === item.userId ) {
                    empty.push({
                        userId: item.userId,
                        realName: item.realName,
                        mobile: item.mobile,
                        email: item.email
                    });
                }
            }
          });
        } else {
          // 新增的情况
          empty = [].concat(arr)
          users.forEach((item) => {
            if (value[value.length - 1] && value[value.length - 1]['key'] === item.userId ) {
                empty.push({
                    userId: item.userId,
                    realName: item.realName,
                    mobile: item.mobile,
                    email: item.email
                });
            }
          })
        }
        _action.actionUpgrade.notificationGroupings[index].recipients = empty;
        this.setState({
            action: _action
        });
    }
    addNotificationGroup() {
        const _action = _.cloneDeep(this.state.action);
        const item = {
            delay: undefined,
            status: [],
            recipients: []
        };
        _action.actionUpgrade.notificationGroupings.push(item);
        this.setState({
            action: _action
        });
    }

    delNotificationGroup(index) {
        const _action = _.cloneDeep(this.state.action);
        _action.actionUpgrade.notificationGroupings.splice(index, 1, null);
        this.setState({
            action: _action
        });
    }
    changeTarget(value) {
        if (value === 0 && this.state.action.type[0] === 3) { // 如果当前动作是升级告警，则初始化动作
            const _action = _.cloneDeep(this.state.action);
            _action.actionUpgrade.notificationGroupings = [{
                delay: 15,
                status: [],
                recipients: []
            }];
            this.setState({
                action: _action,
                target: value
            });
        } else {
            if (this.state.action.type[0] === 5) {
                const _action = _.cloneDeep(this.state.action);
                _action.type[0] = 1;
                this.setState({
                    action: _action
                });
            }
            if (this.state.type === 0) {
                this.setState({
                    target: value,
                    type: 2
                });
            } else {
                this.setState({
                    target: value
                });
            }
        }
    }
    changeActionByAudio(type, value) {
        const { dispatch } = this.props;
        const _action = _.cloneDeep(this.state.action);
        if (!_action.actionNotification) {
            _action.actionNotification = {
                recipients: [],
                notificationMode: initalNotificationMode
            };
        }
        let mode = _action.actionNotification.notificationMode;
        mode.webNotification[type] = value;
        _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
        this.setState({
          action: _action
        })
    }
    changeAction(type, value) {
        const { dispatch } = this.props;
        const _action = _.cloneDeep(this.state.action);
        switch (type) {
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
                        notificationMode: initalNotificationMode
                    };
                }
                let mode = _action.actionNotification.notificationMode;
                const { users } = this.props.alertAssociationRules;
                if (_.isArray(value)) { // 通知对象
                    let empty = [];
                    let arr = [].concat(_action.actionNotification.recipients);
                    if (arr.length > value.length) {
                      // 删除的情况
                      arr.forEach((item, index) => {
                        for (let i = value.length; i >= 0; i -= 1) {
                            if (value[i] && value[i]['key'] === item.userId ) {
                                empty.push({
                                    userId: item.userId,
                                    realName: item.realName,
                                    mobile: item.mobile,
                                    email: item.email
                                });
                            }
                        }
                      });
                    } else {
                      // 新增的情况
                      empty = [].concat(arr)
                      users.forEach((item, index) => {
                        if (value[value.length - 1] && value[value.length - 1]['key'] === item.userId ) {
                            empty.push({
                                userId: item.userId,
                                realName: item.realName,
                                mobile: item.mobile,
                                email: item.email
                            });
                        }
                      })
                    }
                    _action.actionNotification.recipients = empty;
                    this.setState({
                        recipients: empty.map(item => ({key: item.userId, label: item.realName}))
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
                    switch (value.target.id) {
                      case 'audioTitle':
                        mode['webNotification']['title'] = value.target.value;
                        break;
                      case 'audioMessage':
                        mode['webNotification']['message'] = value.target.value;
                        break;
                      default:
                        mode[value.target.id] = value.target.value;
                        break;
                    }
                }
                _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
                break;
            case 4: // 告警派单
                  if (!_action.actionITSM) {
                      _action.actionITSM = {
                          itsmModelId: undefined,
                          itsmModelName: undefined,
                          realParam: '',
                          viewParam: ''
                      };
                  }
                  _action.actionITSM.itsmModelId = value;
                  dispatch({
                      type: 'alertAssociationRules/getshowITSMParam',
                      payload: {
                          id: value
                      }
                  })
                break;
            case 5: // 抑制告警
                break;
            case 6: // 分享到Chatops
                _action.actionChatOps = {
                    chatOpsRoomId: ''
                };
                _action.actionChatOps.chatOpsRoomId = value;
                break;
            case 7: // 修改告警级别
                if (!_action.actionSeverity) {
                    _action.actionSeverity = {
                        type: undefined,
                        fixedSeverity: undefined
                    };
                }
                if (value.type) {
                    _action.actionSeverity.type = value.type
                } else {
                    _action.actionSeverity.fixedSeverity = value.fixedSeverity
                }
                break;
            case 100: // 动作插件
                if (!_action.actionPlugin) {
                    _action.actionPlugin = {
                        uuid: undefined,
                        name: undefined,
                        realParam: ''
                    };
                }
                _action.actionPlugin.uuid = value;
                dispatch({
                    type: 'alertAssociationRules/getshowPluginParam',
                    payload: {
                        id: value
                    }
                })
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
            <div className={cls(styles.title, 'treeTag' + level)}>
                <Select getPopupContainer={() =>document.getElementById("content")} value={logic} placeholder={window.__alert_appLocaleData.messages['ruleEditor.selectLogic']} onChange={this.changeTitleLogic.bind(this, node, level)}>
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
            const { key, opt, value } = _item;
            const itemData = {
                node,
                opt,
                value,
                level,
                classCode: this.props.alertAssociationRules.classCode || [],
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
        let { content = [], complex = [] } = node;
        if (node.id === item.id) { // 一级嵌套（增）一级条件（增、删）
            type === 'addBlock' && complex.push(x);
            type === 'addLine' && content.push(x);
            type === 'deleteLine' && content.splice(x, 1);
            if (type === 'changeLogic') {
                node.logic = x;
            }
            if (/key|opt|value/.test(type)) {
                if (type === 'key') {
                    content[conditionIndex]['opt'] = undefined
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
                            complex[i].content[conditionIndex]['opt'] = undefined
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
                let _day = momentArray[i].format('YYYY-MM-DDTHH:mmZ'); // 当前日历组件选择的时间
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
        const { name, description, type, source, condition, time, timeStart, timeEnd, action, target, isShareUpgrade } = this.state;
        event.preventDefault();
        let _time = {};
        let hmStart = `${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")}`;
        let hmEnd = `${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}`;
        let local = moment().format().substr(19, 6);
        /* 动作 */
        let _actionType = action.type;
        let _actionDelOrClose = undefined;
        let _actionNotification = undefined;
        let _actionITSM = undefined;
        let _actionSuppress = undefined;
        let _actionChatOps = undefined;
        let _actionUpgrade = undefined;
        let _actionPlugin = undefined;
        let _actionSeverity = undefined;

        switch (type) {
            case 2: // 周期
                if (time.timeCycle === 1) { // 每周
                    _time.timeCycle = time.timeCycle;
                    _time.timeCycleWeek = time.timeCycleWeek;
                }
                if (time.timeCycle === 2) { // 每月
                    _time.timeCycle = time.timeCycle;
                    _time.timeCycleMonth = time.timeCycleMonth;
                }
                if (time.timeCycle === 0) { // 每日
                    _time.timeCycle = time.timeCycle;
                }
                _time.timeStart = `${hmStart}${local}`;
                _time.timeEnd = `${hmEnd}${local}`;
                break;
            case 1: // 固定
                _time.dayStart = time.dayStart.replace(time.dayStart.substr(11, 5), hmStart);
                _time.dayEnd = time.dayEnd.replace(time.dayStart.substr(11, 5), hmEnd);
                break;
            default:
                break;
        }
        switch (_actionType[0]) {
            case 1:
                _actionDelOrClose = action.actionDelOrClose;
                break;
            case 2:
                break;
            case 3:
                // 告警通知和升级合并
                if (!Number(target) && isShareUpgrade) {
                    _actionNotification = action.actionNotification;
                    // ---------------------------------------------
                    _actionUpgrade = action.actionUpgrade;
                    _actionUpgrade.notificationMode = action.actionNotification.notificationMode
                    _actionUpgrade.notificationGroupings = action.actionUpgrade.notificationGroupings.filter(item => item);
                    _actionType = [2, 3] // 升级type
                } else {
                    _actionNotification = action.actionNotification;
                    _actionType = [3]
                }
                break;
            case 4:
                this.formByItsm.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return
                  }
                  let params = this.formByItsm.getFieldsValue()
                  let viewForm, viewExecutors = {}
                  let form, executors = {}
                  Object.keys(params).filter(key => params[key]).forEach(key => {
                    if (key.indexOf(limitField.PREFIX_EXECUTOR) === 0) {
                      executors = {
                        ...executors,
                        [key.slice(limitField.PREFIX_EXECUTOR.length)]: params[key]
                      }
                      viewExecutors = {
                        ...viewExecutors,
                        [key.slice(limitField.PREFIX_EXECUTOR.length)]: params[key]
                      }
                    } else {
                        if (key.indexOf(limitField.PREFIX_USERTYPE) === 0) {
                          form = { ...form, [key.slice(limitField.PREFIX_USERTYPE.length)]: params[key].map(i => i.key) }
                          viewForm = { ...viewForm, [key.slice(limitField.PREFIX_USERTYPE.length)]: params[key] }
                        } else {
                          form = { ...form, [key]: params[key] }
                          viewForm = { ...viewForm, [key]: params[key] }
                        }
                    }
                  })
                  _actionITSM = action.actionITSM;
                  _actionITSM.itsmModelName = this.props.alertAssociationRules.wos.filter(item => {
                      return item.id === _actionITSM.itsmModelId;
                  })[0]['name'];
                  _actionITSM.realParam = JSON.stringify({form, executors}, null, 2).replace(/\s|\n/g, "");
                  _actionITSM.viewParam = JSON.stringify({form: viewForm, executors: viewExecutors}, null, 2)
                })
                break;
            case 5:
                _actionSuppress = action.actionSuppress;
                break;
            case 6:
                _actionChatOps = action.actionChatOps;
                _actionChatOps.chatOpsRoomName = this.props.alertAssociationRules.rooms.filter(item => {
                    return item.id === _actionChatOps.chatOpsRoomId;
                })[0]['topic'];
                break;
            case 7:
                _actionSeverity = action.actionSeverity;
                break;
            case 100:
                this.formByPlugin.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return
                  }
                  let params = this.formByPlugin.getFieldsValue()
                  let form = {}
                  Object.keys(params).filter(key => params[key]).forEach(key => {
                    form = { ...form, [key]: params[key] }
                  })
                  _actionPlugin = action.actionPlugin;
                  _actionPlugin.name = this.props.alertAssociationRules.plugins.filter(item => {
                      return item.id === _actionPlugin.uuid;
                  })[0]['name'];
                  _actionPlugin.realParam = JSON.stringify({ form }, null, 2);
                })
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
                target,
                time: type === 0 ? undefined : _time,
                source,
                condition: __condition,
            },
            action: {
                id: _.isEmpty(alertAssociationRules.currentEditRule) ? undefined : alertAssociationRules.currentEditRule.action.id,
                tenant: undefined,
                type: _actionType,
                actionDelOrClose: _actionDelOrClose,
                actionNotification: _actionNotification,
                actionITSM: _actionITSM,
                actionSuppress: _actionSuppress,
                actionChatOps: _actionChatOps,
                actionUpgrade: _actionUpgrade,
                actionPlugin: _actionPlugin,
                actionSeverity: _actionSeverity
            }
        };
        dispatch({
            type: 'alertAssociationRules/createRule',
            payload: {
                ...params,
                resolve: (result) => {
                  this.isNeedLeaveCheck = !result;
                }
            }
        });
    }
}

RuleEditor.defaultProps = {
    name: '',
    description: '',
    type: 0,
    target: 0,
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
    timeStart: {
        hours: 0,
        mins: 0
    },
    timeEnd: {
        hours: 23,
        mins: 59
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
        ...initActions
    },
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
            notifyWhenLevelUp: PropTypes.bool,
            recipients: PropTypes.array.isRequired,
            notificationMode: PropTypes.shape({
                // EMAIL(1，"电子邮件")，SMS(2，"短信")，CHATOPS_PRIVATE(3，"Chatops私聊")，webNotification(4, '声音通知') 多选
                notificationMode: PropTypes.array.isRequired,
                emailTitle: PropTypes.string.isRequired,
                emailMessage: PropTypes.string.isRequired,
                smsMessage: PropTypes.string.isRequired,
                webNotification: PropTypes.shape({
                  title: PropTypes.string.isRequired,
                  message: PropTypes.string.isRequired,
                  playTimeType: PropTypes.string.isRequired,
                  timeOut: PropTypes.number.isRequired,
                  voiceType: PropTypes.string.isRequired,
                })
            })
        }),
        actionITSM: PropTypes.shape({
            itsmModelId: PropTypes.string,
            itsmModelName: PropTypes.string,
            realParam: PropTypes.string,
            viewParam: PropTypes.string
        }),
        actionChatOps: PropTypes.shape({
            notifyWhenLevelUp: PropTypes.bool,
            chatOpsRoomId: PropTypes.string
        }),
        // 动作升级
        actionUpgrade: PropTypes.shape({
            notificationGroupings: PropTypes.array.isRequired,
            notificationMode: PropTypes.shape({
                notificationMode: PropTypes.array,
                emailTitle: PropTypes.string,
                emailMessage: PropTypes.string,
                smsMessage: PropTypes.string
            })
        }),
        // 修改告警等级
        actionSeverity: PropTypes.shape({
            type: PropTypes.string,
            fixedSeverity: PropTypes.string
        }),
        // 动作插件
        actionPlugin: PropTypes.shape({
            uuid: PropTypes.string,
            name: PropTypes.string,
            realParam: PropTypes.string
        }),
    })
};

export default RuleEditor;
