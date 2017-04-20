import React, {
  PropTypes,
  Component
} from 'react';
import { default as cls } from 'classnames';
import moment from 'moment';
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
  child: [{
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
    child: [{
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
    child: [{
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


class RuleEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type,
      time: props.time,
      timeStart: {
        hours: 0,
        mins: 0
      },
      timeEnd: {
        hours: 0,
        mins: 0
      }
    };
  }
  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { name, type, description } = this.props;
    setFieldsValue({ // 此处对表单进行赋值，会造成 render 两次
      name,
      type,
      description,
    });
  }
  render() {
    conditionsDom = []; // 重置，防止重复 render
    const { time, timeStart, timeEnd } = this.state;
    const { getFieldDecorator } = this.props.form;
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
      case '1':
        const timeCycleWeekArr = time.timeCycleWeek.split(',');
        let _timeCycleWeekArr = timeCycleWeekArr.map(item => {
          return item.replace(/\d/g, matchs => {
            return WeekArray[matchs].label;
          });
        });
        _.remove(_timeCycleWeekArr, item => item === '');
        cycleDay = `${_timeCycleWeekArr}${_timeCycleWeekArr.length === 0 ? '' : '、'}`;
        break;
      case '2':
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
    const cycleTimeStart = `${timeStart.hours}:${timeStart.mins}`;
    const cycleTimeEnd = `${timeEnd.hours}:${timeEnd.mins}`;
    // console.log(moment(cycleTimeStart, 'H:mm').format("HH:mm"))
    const timeString = `${cycleDay}${moment(cycleTimeStart, 'H:mm').format("HH:mm")} ~ ${moment(cycleTimeEnd, 'H:mm').format("HH:mm")}`;

    // console.info('[props]', this.props);
    console.info('[state]', this.state);

    return (
      <Form id="RuleEditor" onSubmit={this.submit}>

        <h2>基本信息</h2>
        <div className={styles.baseInfo}>
          <FormItem
            {...itemLayout}
            label="规则名称"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                message: '规则名称不能为空'
              }],
            })(
              <Input placeholder="请输入规则名称" />
            )}
          </FormItem>
          <FormItem
            {...desLayout}
            label="规则描述"
          >
            {getFieldDecorator('description', {
              rules: [],
            })(
              <Input type="textarea" placeholder="请为规则添加描述" />
            )}
          </FormItem>
          <FormItem
            {...desLayout}
            label="规则类型"
          >
            {getFieldDecorator('type', {
              rules: [],
            })(
              <RadioGroup
                onChange={this.changeType.bind(this)}
              >
                <Radio value='0'>任意时间均执行</Radio>
                <Radio value='1'>周期性执行</Radio>
                <Radio value='2'>固定时间段执行</Radio>
              </RadioGroup>
            )}

            {
              this.state.type === '1' &&
              <div className={styles.pickTimeWrap}>
                <Popover
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="pickTime"
                  content={(
                    <div className={styles.timeCycle}>
                      <div className={styles.timeCycleHd}>
                        <span className={cls({
                          'active': time.timeCycle === '0'
                        })} onClick={this.changeTimeCycleType.bind(this, '0')}>每日</span>
                        <span className={cls({
                          'active': time.timeCycle === '1'
                        })} onClick={this.changeTimeCycleType.bind(this, '1')}>每周</span>
                        <span className={cls({
                          'active': time.timeCycle === '2'
                        })} onClick={this.changeTimeCycleType.bind(this, '2')}>每月</span>
                      </div>
                      <div className={styles.timeCycleBd}>
                        {
                          time.timeCycle !== '0' &&
                          <p>请选择具体执行周期：</p>
                        }
                        { // 每周
                          time.timeCycle === '1' &&
                          <CheckboxGroup options={WeekArray} defaultValue={time.timeCycleWeek.split(',')} className="weekCycle" onChange={this.changeTimeCycle.bind(this, 'timeCycleWeek')} />
                        }
                        { // 每月
                          time.timeCycle === '2' &&
                          <CheckboxGroup options={MonthArray} defaultValue={time.timeCycleMonth.split(',')} onChange={this.changeTimeCycle.bind(this, 'timeCycleMonth')} />
                        }
                        <TimeSlider timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
                      </div>
                    </div>
                  )}
                >
                  <Input placeholder="请选择定时规则" readOnly value={timeString} className={styles.selectTime} />
                </Popover>
              </div>
            }
            {
              this.state.type === '2' &&
              <div className={styles.pickTimeWrap}>
                <Popover
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="pickTime"
                  content={(
                    <div className={styles.timeCycle}>
                      <RangeCalendar onChange={this.changeDate.bind(this)} dateInputPlaceholder={['请选择起始日期', '请选择结束日期']} className={styles.calendar} locale={zh_CN} renderFooter={() => {
                        return (
                          <div className={styles.timeCycleBd}>
                            <TimeSlider />
                          </div>
                        );
                      }} />

                    </div>
                  )}
                >
                  <Input placeholder="请选择定时规则" readOnly className={styles.selectTime} />
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
            {getFieldDecorator('source', {
              rules: [{
                required: true,
                message: '告警来源不能为空'
              }]
            })(
              <Select
                // showSearch
                // optionFilterProp="children"
                style={{ width: 200 }}
                placeholder="请选择告警来源"
                // getPopupContainer={() => document.querySelector('#xxx')}
                // filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="CMDB">CMDB</Option>
                <Option value="Monitor">Monitor</Option>
                <Option value="APM">APM</Option>
              </Select>
            )}
          </FormItem>
        </div>

        <h2>定义条件</h2>
        <div className={styles.defineConditions}>
          {
            this.createAll(this.props.condition, treeTag)
          }
        </div>

        <h2>设置动作</h2>
        <div className={styles.setActions}>
          <Tabs animated={false} defaultActiveKey={this.props.tab}>
            <TabPane tab="关闭/删除告警" key="1">
              <div>
                <span>针对符合条件的告警，执行</span>
                <Select
                  style={{ width: 100 }}
                  defaultValue={this.props.action}
                >
                  <Option value="delete">删除</Option>
                  <Option value="close">关闭</Option>
                </Select>
                <em>关闭将状态改为已解决，删除从数据库物理删除</em>
              </div>
            </TabPane>
            {
              // <TabPane tab="升级/降级告警" key="2"></TabPane>
            }
            <TabPane tab="告警通知" key="3">

            </TabPane>
            <TabPane tab="告警派单" key="4">
              <div>
                <span>工单类别：</span>
                <Select
                  style={{ width: 100 }}
                  defaultValue={this.props.itsm}
                >
                  <Option value="group1">组1</Option>
                  <Option value="group2">组2</Option>
                </Select>
                <em>选择工单类型，派发到ITSM</em>
              </div>
            </TabPane>
            <TabPane tab="抑制告警" key="5">

            </TabPane>
            <TabPane tab="分享到Chatops" key="6">
              <div>
                <span>Chatops群组：</span>
                <Select
                  style={{ width: 100 }}
                  defaultValue={this.props.chatops}
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

  // 创建条件头
  createTitle(item, level) {
    const { logic } = item;
    return (
      <div className={cls(
          styles.title,
          `treeTag${level}`
        )}
      >
        <label>条件：</label>
        <Select placeholder="请选择条件">
          <Option value="and">满足全部</Option>
          <Option value="or">满足任意</Option>
          <Option value="not">都不满足</Option>
        </Select>
        <div className={styles.btnWrap}>
          <span className={cls(styles.btn, styles.addBlock)}>+嵌套</span>
          <span className={cls(styles.btn, styles.addLine)}>+条件</span>
        </div>
      </div>
    );
  }
  // 创建条件内容
  createConditionList(item, level) {
    const { content } = item;
    return content.map((_item, _index) => {
      const { key, opt, value} = _item;
      const itemData = {
        _key: key,
        opt,
        value,
        level
      };
      return <Condition {...itemData} />
    });
  }
  // 对数据进行深度遍历并创建 Dom
  // 深度优先
  createAll(node, treeTag) {
    const { child = [] } = node;
    const domList = [];
    domList.push(
      this.createTitle(node, treeTag),
      this.createConditionList(node, treeTag)
    );
    for (let i = child.length - 1; i >= 0; i -= 1) {
      // 先序遍历，treeTag + 1 是当前值 + 1，不会改变自身的值
      this.createAll(child[i], treeTag + 1);
    }
    conditionsDom.unshift(domList);
    return conditionsDom;
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

  // 更改固定时间段, event 为一个数组，包含起始时间和结束时间
  changeDate(event) {
    // const _time = _.cloneDeep(this.state.time);
    // const { timeStart, timeEnd } = this.state;
    // console.log(moment(event[0]), _time)
    // for (let i = 0, len = event.length; i < len; i += 1) {
    //   let _day = moment(event[i]).format();
    //   let _dayTime = _day.substr(11, 8);

    //   if (i === 0) {
    //     _time['dayStart'] = _day.replace(_dayTime, `${_time['dayStart'].hours}:${_time['dayStart'].mins}`);
    //   } else {
    //     _time['dayEnd'] = _day.replace(_dayTime, `${_time['dayEnd'].hours}:${_time['dayEnd'].mins}`);
    //   }
    // }

    // console.log(moment(event[0]), _time)
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.warn('[表单错误]', errors);
        return false;
      }
    });
  }
}

RuleEditor.defaultProps = {
  name: '',
  description: '',
  type: '0',
  time: {
    dayStart: '',
    dayEnd: '',
    timeCycle: '0',
    timeCycleWeek: '',
    timeCycleMonth: '',
    timeStart: '',
    timeEnd: ''
  },
  source: '',
  condition: {
    content: [],
    child: [],
    logic: ''
  },
  // condition: conditionData,
};

RuleEditor.propTypes = {
  /* 基本信息 */
  // 规则名称
  name: PropTypes.string.isRequired,
  // 规则描述
  description: PropTypes.string.isRequired,
  // 规则类型（0:任意时间执行；1:周期性执行；2:固定时间段执行）
  type: PropTypes.string.isRequired,
  time: PropTypes.shape({
    // 固定时间段执行必填（在未来确定的某一时间段执行一次）
    dayStart: PropTypes.string.isRequired,
    dayEnd: PropTypes.string.isRequired,

    // 周期性执行必填（0：每天；1：每周；2：每月）
    timeCycle: PropTypes.string.isRequired,
    // 时间周期为每周必填（0～6：周一～周日）
    timeCycleWeek: PropTypes.string.isRequired,
    // 时间周期为每月必填（0～30:1号～31号）
    timeCycleMonth: PropTypes.string.isRequired,
    timeStart: PropTypes.string.isRequired,
    timeEnd: PropTypes.string.isRequired
  }),

  /* 告警来源 */
  source: PropTypes.string.isRequired,

  /* 定义条件 */
  condition: PropTypes.shape({
    content: PropTypes.array.isRequired,
    child: PropTypes.array.isRequired,
    logic: PropTypes.string.isRequired
  }),

  /* 设定动作 */
  // 动作类型
  tab: PropTypes.string,
  action: PropTypes.string,
  itsm: PropTypes.string,
  chatops: PropTypes.string,

};

export default Form.create()(RuleEditor);
