import React, {
  PropTypes,
  Component
} from 'react';
import {
  default as cls
} from 'classnames';
import {
  Select
} from 'antd';
import Condition from './condition';

import styles from './defineConditions.less';

const Option = Select.Option;
const conditionData = [{ // 模拟数据
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
        value: 'Monitor',
      }]
    }]
  }]
}];

class DefineConditions extends Component {
  constructor(props) {
    super(props);

    this.levelTag = 0; // 当前数据的层级标识
    this.conditionsDom = []; // Virtual Dom List
  }
  // 创建条件头部
  createTitle(item, index) {
    const { logic } = item;
    return (
      <div key={'conditionTitle_' + index} className={styles.title}>
        <Select defaultValue={logic}>
          <Option value="and">满足全部</Option>
          <Option value="or">满足任意</Option>
          <Option value="not">都不满足</Option>
        </Select>
        <div className={styles.btnWrap}>
          <span className={cls(styles.btn, styles.addBlock)}> + 嵌套</span>
          <span className={cls(styles.btn, styles.addLine)}> + 条件</span>
        </div>
      </div>
    );
  }
  // 创建条件内容
  createConditionList(item, index) {
    const { content } = item;
    return content.map((_item, _index) => {
      const { key, opt, value} = _item;
      const itemData = {
        _key: key,
        opt,
        value
      };
      return <Condition {...itemData} />
    });
  }
  // 合并创建
  createAll(data) {
    const domList = [];
    data.map((item, index) => {
      const { child = [] } = item;
      // if (child.length !== 0) {
      //   this.createAll(child);
      // }
      if (this.levelTag === 0) {
        this.createAll(child);
      }
      domList.push(
        this.createTitle(item, index),
        this.createConditionList(item, index)
      );
    });
    this.levelTag += 1;
    this.conditionsDom.unshift(domList);
    return this.conditionsDom;
  }
  render() {
    return (
      <div className={styles.defineConditions}>
        <h2>定义条件</h2>
        {
          this.createAll(conditionData)
        }
      </div>
    );
  }
}

export default DefineConditions;
