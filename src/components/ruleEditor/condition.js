import React, {PropTypes, Component} from 'react';
import {default as cls} from 'classnames';
import {Select} from 'antd';

import styles from './condition.less';

const Option = Select.Option;
const keyList = [
  {
    name: '请选择维度',
    value: ''
  }, {
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
    name: '请选择对应标签',
    value: ''
  }, {
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
  render() {
    const {key, opt, value} = this.props;
    return (
      <div className="condition">
        <Select style={{ width: 100 }} defaultValue={key}>
          {
            keyList.map(item => (
              <Option value={item.value}>{item.name}</Option>
            ))
          }
        </Select>
        <Select style={{ width: 70 }} defaultValue={opt}>
          {
            optList.map(item => (
              <Option value={item.value}>{item.name}</Option>
            ))
          }
        </Select>
        <Select style={{ width: 130 }} defaultValue={value}>
          {
            valueList.map(item => (
              <Option value={item.value}>{item.name}</Option>
            ))
          }
        </Select>
      </div>
    );
  }
}

Condition.defaultProps = {
  key: '',
  opt: 'equal',
  value: ''
};

Condition.propsTypes = {
  key: PropTypes.string.isRequired, // 维度
  opt: PropTypes.string.isRequired, // 逻辑操作
  value: PropTypes.string.isRequired // 对应标签
};

export default Condition;
