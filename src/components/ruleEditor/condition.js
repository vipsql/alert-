import React, {PropTypes, Component} from 'react';
import {default as cls} from 'classnames';
import {Select} from 'antd';

import styles from './condition.less';

const Option = Select.Option;
const keyList = [
  {
    name: '告警级别',
    value: 'level'
  }, {
    name: '告警来源',
    value: 'source'
  }, {
    name: '告警状态',
    value: 'status'
  }, {
    name: '持续时间',
    value: 'duration'
  }
];
const optList = [
  {
    name: '等于',
    value: 'equal'
  }, {
    name: '不等于',
    value: 'unequal'
  }, {
    name: '包含',
    value: 'include'
  }, {
    name: '不包含',
    value: 'notinclude'
  }
];
const valueList = [
  {
    name: 'CMDB',
    value: 'CMDB'
  }, {
    name: 'APM',
    value: 'APM'
  }, {
    name: 'Monitor',
    value: 'Monitor'
  }, {
    name: 'ChatOps',
    value: 'ChatOps'
  }
];

class Condition extends Component {
  // 删除条件项
  deleteItem() {
    console.log('[删除]');
  }
  // 创建条件
  createConditionItem() {
    const {_key, opt, value, level} = this.props;
    return (
      <div className={cls(
        styles.conditionItem,
        `treeTag${level}`
      )}>
        <Select className={styles.key} style={{ width: 100 }} defaultValue={_key} placeholder="请选择维度">
          {
            keyList.map(item => (
              <Option key={item.name + item.value} value={item.value}>{item.name}</Option>
            ))
          }
        </Select>
        <Select className={styles.opt} style={{ width: 100 }} defaultValue={opt} placeholder="请选择条件">
          {
            optList.map(item => (
              <Option key={item.name + item.value} value={item.value}>{item.name}</Option>
            ))
          }
        </Select>
        <Select className={styles.value} style={{ width: 130 }} defaultValue={value} placeholder="请选择对应标签">
          {
            valueList.map(item => (
              <Option key={item.name + item.value} value={item.value}>{item.name}</Option>
            ))
          }
        </Select>
        <i className={styles.delete} onClick={this.deleteItem.bind(this)}>X</i>
      </div>
    );
  }
  render() {
    return this.createConditionItem();
  }
}

Condition.defaultProps = {
  _key: undefined,
  opt: undefined,
  value: undefined,
  logic: undefined,
  level: undefined,
};

Condition.propsTypes = {
  _key: PropTypes.string, // 维度
  opt: PropTypes.string, // 操作
  value: PropTypes.string, // 对应标签
  logic: PropTypes.string, // 逻辑
  level: PropTypes.number // 逻辑
};

export default Condition;
