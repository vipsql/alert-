import React, {
  PropTypes,
  Component
} from 'react';
import { Tabs, Select } from 'antd';
import { default as cls } from 'classnames';

import styles from './setActions.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const SetActions = (props) => {
  return (
    <div className="setActions">
      <h2>设置动作</h2>
      <Tabs animated={false} defaultActiveKey={props.tab}>
        <TabPane tab="关闭/删除告警" key="1">
          <div>
            <span>针对符合条件的告警，执行</span>
            <Select
              style={{ width: 100 }}
              defaultValue={props.action}
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
              defaultValue={props.itsm}
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
              defaultValue={props.chatops}
            >
              <Option value="group1">组1</Option>
              <Option value="group2">组2</Option>
            </Select>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

SetActions.defaultProps = {
  tab: null,
  action: 'close',
  itsm: 'group1',
  chatops: 'group1'
};

SetActions.propTypes = {
  tab: PropTypes.string,
  action: PropTypes.string,
  itsm: PropTypes.string,
  chatops: PropTypes.string
};

export default SetActions;
