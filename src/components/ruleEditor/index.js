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

moment.locale('zh-cn'); // 设定时间国际化

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
  {label: '电子邮件', value: 1},
  {label: '短信息', value: 2},
  {label: '分享到ChatOps私聊窗口', value: 3}
]
const WeekArray = [
  {label: '周一', value: '0'},
  {label: '周二', value: '1'},
  {label: '周三', value: '2'},
  {label: '周四', value: '3'},
  {label: '周五', value: '4'},
  {label: '周六', value: '5'},
  {label: '周日', value: '6'}
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
const makeCondition = node => {
  const { complex = [] } = node;
  node.id = leafTag;
  leafTag += 1;
  for (let i = complex.length - 1; i >= 0; i -= 1) {
    makeCondition(complex[i]);
  }
  return node;
};

class RuleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      insertVars: props.insertVars
    };

    this.email = false;
    this.sms = false;
    this.chatops = false;
    this.recipients = [];
    this.isChecked();
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alertAssociationRules/getUsers'
    });


  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      name: nextProps.name,
      description: nextProps.description,
      type: nextProps.type,
      source: nextProps.source,
      condition: makeCondition(_.cloneDeep(nextProps.condition)),
      action: nextProps.action
    });
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

        <h2>基本信息</h2>
        <div className={styles.baseInfo}>
          <FormItem
            {...itemLayout}
            label="规则名称"
          >
              <Input value={this.state.name} onChange={this.changeField.bind(this, 'name')} placeholder="请输入规则名称" />

          </FormItem>
          <FormItem
            {...desLayout}
            label="规则描述"
          >

              <Input value={this.state.description} onChange={this.changeField.bind(this, 'description')} type="textarea" placeholder="请为规则添加描述" />

          </FormItem>
          <FormItem
            {...desLayout}
            label="执行安排"
          >
            <RadioGroup
              onChange={this.changeType.bind(this)}
              value={this.state.type}
            >
              <Radio value={0}>任意时间均执行</Radio>
              <Radio value={1}>周期性执行</Radio>
              <Radio value={2}>固定时间段执行</Radio>
            </RadioGroup>
            {
              this.state.type === 1 &&
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
                        })} onClick={this.changeTimeCycleType.bind(this, 0)}>每日</span>
                        <span className={cls({
                          'active': time.timeCycle === 1
                        })} onClick={this.changeTimeCycleType.bind(this, 1)}>每周</span>
                        <span className={cls({
                          'active': time.timeCycle === 2
                        })} onClick={this.changeTimeCycleType.bind(this, 2)}>每月</span>
                      </div>
                      <div className={cls(styles.timeCycleBd, `${time.timeCycle.length === 0 ? styles.hidden : ''}`)}>
                        {
                          time.timeCycle !== 0 &&
                          <p>请选择具体执行周期：</p>
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
                  <Input placeholder="请选择定时规则" readOnly value={cycleTimeString} className={styles.selectTime} />
                </Popover>
              </div>
            }
            {
              this.state.type === 2 &&
              <div className={styles.pickTimeWrap}>
                <Popover
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="pickTime"
                  content={(
                    <div className={styles.timeCycle}>
                      <RangeCalendar
                        // defaultSelectedValue={[moment(time.dayStart), moment(time.dayEnd)]}
                        onChange={this.changeDate.bind(this)} dateInputPlaceholder={['请选择起始日期', '请选择结束日期']} className={styles.calendar} locale={zh_CN} renderFooter={() => {
                        return (
                          <div className={styles.timeCycleBd}>
                            <TimeSlider timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
                          </div>
                        );
                      }} />

                    </div>
                  )}
                >
                  <Input placeholder="请选择定时规则" readOnly value={dayTimeString} className={styles.selectTime} />
                </Popover>
              </div>
            }
          </FormItem>
        </div>

        <h2>告警来源</h2>
        <div className={styles.alertSource}>
          <FormItem
            {...itemLayout}
            label="告警来源"
          >
            <Select
              style={{ width: 200 }}
              placeholder="请选择告警来源"
              value={this.state.source === '' ? undefined : this.state.source}
              onChange={this.changeSource.bind(this)}
            >
              <Option value="CMDB">CMDB</Option>
              <Option value="Monitor">Monitor</Option>
              <Option value="APM">APM</Option>
            </Select>
          </FormItem>
        </div>

        <h2>定义条件</h2>
        <div className={styles.defineConditions}>
          {
            this.createAll(condition, treeTag)
          }
        </div>

        <h2>设置动作</h2>
        <div className={styles.setActions}>
          <Tabs className={styles.setActions} animated={false} activeKey={action.type[0].toString()} onChange={this.changeActionType.bind(this)}>

            <TabPane tab="关闭/删除告警" key="1" className={styles.actionDelOrClose}>
              <div>
                <span className={styles.label}>针对符合条件的告警，执行</span>
                <Select
                  style={{ width: 100 }}
                  value={action.actionDelOrClose ? action.actionDelOrClose.operation : undefined}
                  placeholder="请选择操作"
                  onChange={this.changeAction.bind(this, 1)}
                >
                  <Option value="1">删除</Option>
                  <Option value="2">关闭</Option>
                </Select>
                <em>关闭将状态改为已解决，删除从数据库物理删除</em>
              </div>
            </TabPane>
            {
              // <TabPane tab="升级/降级告警" key="2"></TabPane>
            }
            <TabPane tab="告警通知" key="3" className={styles.actionNotification}>
              <div>
                <span className={styles.notificationTabsLabel}>通知方式</span>
                <FormItem
                  {...desLayout}
                  label="通知对象"
                >
                    <Select
                      mode="multiple"
                      style={{ width: 200 }}
                      placeholder="请选择通知对象"
                      onChange={this.changeAction.bind(this, 3)}
                      className={styles.recipients}
                      defaultValue={this.recipients}
                    >
                      {
                        this.props.alertAssociationRules.users.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                      }
                    </Select>
                </FormItem>
                <Tabs animated={false} className={styles.notificationTabs}>
                  <TabPane tab={<div><Checkbox defaultChecked={this.email} value={1} onChange={this.changeAction.bind(this, 3)} /><span>电子邮件</span></div>} key="1">

                    <div>
                      <FormItem
                        label="邮件标题"
                        className={styles.mailTitle}
                      >
                          <Input id="emailTitle"
                            value={action.actionNotification ? action.actionNotification.notificationMode.emailTitle : undefined}
                            onChange={this.changeAction.bind(this, 3)} placeholder="来自告警$(Alert_name)的通知" />

                      </FormItem>
                      <FormItem
                        label="邮件内容"
                        className={styles.msgContent}
                      >
                          <Input id="emailMessage"
                            value={action.actionNotification ? action.actionNotification.notificationMode.emailMessage : undefined}
                            onChange={this.changeAction.bind(this, 3)} type="textarea" placeholder="${serverity}，${entity_name}于{occurtime}发生，具体信息为${description}" />

                        <Popover overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={this.emailVarContent}>
                          <div className={styles.insertVar}>插入变量</div>
                        </Popover>
                      </FormItem>

                    </div>
                  </TabPane>
                  <TabPane tab={<div><Checkbox defaultChecked={this.sms} value={2} onChange={this.changeAction.bind(this, 3)} /><span>短信息</span></div>} key="2">
                    <div>
                      <FormItem
                        label="信息内容"
                        className={styles.msgContent}
                      >
                          <Input id="smsMessage"
                            value={action.actionNotification ? action.actionNotification.notificationMode.smsMessage : undefined}
                            onChange={this.changeAction.bind(this, 3)} type="textarea" placeholder="${serverity}，${entity_name}于{occurtime}发生，具体信息为${description}" />

                          <Popover overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={this.smsVarContent}>
                            <div className={styles.insertVar}>插入变量</div>
                          </Popover>
                      </FormItem>
                    </div>
                  </TabPane>
                  <TabPane tab={<div><Checkbox defaultChecked={this.chatops} value={3} onChange={this.changeAction.bind(this, 3)} /><span>分享到ChatOps私聊窗口</span></div>} key="3" />
                </Tabs>
              </div>
            </TabPane>
            <TabPane tab="告警派单" key="4" className={styles.actionITSM}>
              <div>
                <span>工单类别：</span>
                <Select
                  style={{ width: 100 }}
                  placeholder="请选择类别"
                  value={action.actionITSM ? action.actionITSM.itsmModelId : undefined}
                  onChange={this.changeAction.bind(this, 4)}
                >
                  <Option value="group1">组1</Option>
                  <Option value="group2">组2</Option>
                </Select>
                <em>选择工单类型，派发到ITSM</em>
                <Input className={styles.text} onBlur={this.changeAction.bind(this, 4)}
                  defaultValue={action.actionITSM ? action.actionITSM.param.cesjo : undefined}
                  type="textarea" placeholder="映射配置" />
              </div>
            </TabPane>
            <TabPane tab="抑制告警" key="5" className={styles.actionSuppress}>

            </TabPane>
            <TabPane tab="分享到Chatops" key="6">
              <div>
                <span>ChatOps群组：</span>
                <Select
                  style={{ width: 100 }}
                  value={action.actionChatOps ? action.actionChatOps.chatOpsRoomId : undefined }
                  placeholder="请选择群组"
                  onChange={this.changeAction.bind(this, 6)}
                >
                  <Option value="group1">组1</Option>
                  <Option value="group2">组2</Option>
                </Select>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <span onClick={this.handleSubmit.bind(this)} className={styles.submit}>提交</span>
      </Form>
    );
  }

  isChecked() {
    const _action = _.cloneDeep(this.state.action);
    if (!_action.actionNotification) {
      _action.actionNotification = {
        recipients: [],
        notificationMode: {
          notificationMode: [],
          emailTitle: '',
          emailMessage: '',
          smsMessage: ''
        }
      };
    }
    const mode = _action.actionNotification.notificationMode.notificationMode;
    for (let i = mode.length - 1; i >= 0; i -= 1) {
      if (mode[i] === 1) {
        this.email = true;
      }
      if (mode[i] === 2) {
        this.sms = true;
      }
      if (mode[i] === 3) {
        this.chatops = true;
      }
    }

    this.recipients = _action.actionNotification.recipients.map(item => item.userId);
  }

  // 插入变量的内容
  vars(type) {
    const { insertVars } = this.state;
    return (
      <div className={styles.varList}>
        {insertVars.map(item => <span key={`${'${'}${item}${'}'}`} onClick={this.insertVar.bind(this, type, item)}>{item}</span>)}
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
          emailTitle: '',
          emailMessage: '',
          smsMessage: ''
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
              emailTitle: '',
              emailMessage: '',
              smsMessage: ''
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
        } else if (value.target.type === 'checkbox') { // 通知方式
          if (value.target.checked) { // 选中此通知方式
            mode.notificationMode.push(value.target.value);
            mode.notificationMode = _.uniq(mode.notificationMode);
          } else { // 移除此通知方式
            mode.notificationMode = mode.notificationMode.filter(item => item !== value.target.value);
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
            param: {
              cesjo: undefined
            }
          };
        }
        if (value.target) {
          _action.actionITSM.param.cesjo = value.target.value;
        } else {
          _action.actionITSM.itsmModelId = value;
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
        <label>条件：</label>
        <Select value={logic} placeholder="请选择条件" onChange={this.changeTitleLogic.bind(this, node, level)}>
          <Option value="and">满足全部</Option>
          <Option value="or">满足任意</Option>
          <Option value="not">都不满足</Option>
        </Select>
        <div className={styles.btnWrap}>
          {
            level !== 2 && // 三级条件不显示增加嵌套按钮
            <span onClick={this.addBlock.bind(this, node, level)} className={cls(styles.btn, styles.addBlock)}>+嵌套</span>
          }
          <span onClick={this.addLine.bind(this, node, level)} className={cls(styles.btn, styles.addLine)}>+条件</span>
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
    // debugger
    return content.map((_item, _index) => {
      const { key, opt, value} = _item;
      const itemData = {
        node,
        opt,
        value,
        level,
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
        content[conditionIndex][type] = x;
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
            complex[i].content[conditionIndex][type] = x;
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

  handleSubmit(event) {
    const { dispatch, form, routeParams } = this.props;
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
      case 1: // 周期
        if (_time.timeCycle === 1) { // 每周
          _time.timeCycle = time.timeCycle;
          _time.timeCycleWeek = time.timeCycleWeek;
        }
        if (_time.timeCycle === 2) { // 每月
          _time.timeCycle = time.timeCycle;
          _time.timeCycleMonth = time.timeCycleMonth;
        }
        _time.timeStart = `${hmStart}.000${local}`;
        _time.timeEnd = `${hmEnd}.000${local}`;
        break;
      case 2: // 固定
        _time.dayStart = time.dayStart.replace(time.dayStart.substr(11, 8), hmStart).replace('+', '.000+');
        _time.dayEnd = time.dayEnd.replace(time.dayStart.substr(11, 8), hmEnd).replace('+', '.000+');
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

    const params = {
      ruleId: routeParams.ruleId ? undefined : routeParams.ruleId,
      rule: {
        name,
        description,
        type,
        time: type === 0 ? undefined : _time,
        source,
        condition,
      },
      action: {
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
    dayStart: moment().format(),
    dayEnd: moment().format(),
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
        emailTitle: '',
        emailMessage: '',
        smsMessage: ''
      }
    },
    actionITSM: {
      itsmModelId: undefined,
      param: {
        cesjo: ''
      }
    },
    actionChatOps: {
      chatOpsRoomId: undefined
    }
  },
  insertVars: ['xx','aa','bb','gg']
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
      param: PropTypes.shape({
        cesjo: PropTypes.string
      })
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
