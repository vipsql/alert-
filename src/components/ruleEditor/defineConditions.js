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
    }]
  }]
};

class DefineConditions extends Component {
  constructor(props) {
    super(props);

    this.levelTag = 0; // 当前数据的层级标识
    this.conditionsDom = []; // Virtual Dom List
  }
  // 创建条件头部
  createTitle(item) {
    const { logic } = item;
    return (
      <div className={styles.title}>
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
  createConditionList(item) {
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
  // 对数据进行深度遍历并创建 Dom
  // 深度优先
  createAll(node) {
    const { child = [] } = node;
    const domList = [];
    domList.push(
      this.createTitle(node),
      this.createConditionList(node)
    );
    for (let i = child.length - 1; i >=0; i -= 1) {
      // 先序遍历
      this.createAll(child[i]);
    }
    this.conditionsDom.unshift(domList);
    // console.log(this.conditionsDom)
    return this.conditionsDom;
  }
  // 广度优先：
  // createAll(data) {
  //   const domList = [];
  //   data.map((item, index) => {
  //     const { child = [] } = item;
  //     if (child.length !== 0) {
  //       this.createAll(child);
  //     }
  //     domList.push(
  //       this.createTitle(item, index),
  //       this.createConditionList(item, index)
  //     );
  //   });
  //   this.levelTag += 1;
  //   this.conditionsDom.unshift(domList);
  //   return this.conditionsDom;
  // }
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
