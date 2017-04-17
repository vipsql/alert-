import React, {
  PropTypes,
  Component
} from 'react';
import { default as cls } from 'classnames';
import { Form, Input, Radio, Select, Tabs } from 'antd';
import Condition from './condition';

import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
        value: 'Monitor',
      }, {
        key: 'status',
        opt: 'equal',
        value: 'CMDB',
      }]
    }]
  }]
};

let treeTag = 0; // 当前数据的层级标识
let conditionsDom = []; // 元素列表

class RuleEditor extends Component {
  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { name, type, description } = this.props;
    setFieldsValue({ // 此处会造成 render 两次
      name,
      type,
      description,
    });
  }

  createTitle(item, level) {
    const { logic } = item;
    return (
      <div className={cls(
          styles.title,
          `treeTag${level}`
        )}
      >
        <label>条件：</label>
        <Select defaultValue={logic}>
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

  render() {
    conditionsDom = []; // 重置，防止重复 render

    const { getFieldDecorator } = this.props.form;
    const itemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 4 }
    };
    const desLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 10 }
    }
    console.log(this.props);

    return (
      <Form id="RuleEditor">
        <div className={styles.baseInfo}>
          <h2>基本信息</h2>
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
              <RadioGroup>
                <Radio value={1}>非周期性规则</Radio>
                <Radio value={2}>周期性规则</Radio>
                <Radio value={3}>固定时间窗规则</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </div>

        <div className={styles.alertSource}>
          <h2>告警来源</h2>
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
                showSearch
                optionFilterProp="children"
                style={{ width: 200 }}
                // placeholder="请选择告警来源"
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="">请选择告警来源</Option>
                <Option value="CMDB">CMDB</Option>
                <Option value="Monitor">Monitor</Option>
                <Option value="APM">APM</Option>
              </Select>
            )}
          </FormItem>
        </div>

        <div className={styles.defineConditions}>
          <h2>定义条件</h2>
          <div className={styles.conditionList}>
            {
              this.createAll(this.props.conditionData, treeTag)
            }
          </div>
        </div>

        <div className={styles.setActions}>
          <h2>设置动作</h2>
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
            <TabPane tab="升级/降级告警" key="2">

            </TabPane>
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
      </Form>
    );
  }
}

RuleEditor.defaultProps = {
  name: '',
  type: 1,
  description: '',
  conditionData: conditionData,
};

RuleEditor.propTypes = {
  name: PropTypes.string.isRequired, // 规则名称
  type: PropTypes.number.isRequired, // 规则类型
  description: PropTypes.string, // 规则描述
  conditionData: PropTypes.object, // 条件数据，最多3级
};

export default Form.create()(RuleEditor);
