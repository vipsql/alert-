import React, {
  PropTypes,
  Component
} from 'react';
import { default as cls } from 'classnames';
import { Form, Input, Radio } from 'antd';

import styles from './baseInfo.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class BaseInfo extends Component {
  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { name, type, description } = this.props;
    setFieldsValue({
      name,
      type,
      description,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.baseInfo}>
        <h2>基本信息</h2>
        <Form>
          <FormItem
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
            label="规则描述"
          >
            {getFieldDecorator('description', {
              rules: [],
            })(
              <Input type="textarea" placeholder="请为规则添加描述" />
            )}
          </FormItem>
          <FormItem
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
        </Form>
      </div>
    );
  }
}

BaseInfo.defaultProps = {
  name: '',
  type: 1,
  description: '',
};

BaseInfo.propTypes = {
  name: PropTypes.string.isRequired, // 规则名称
  type: PropTypes.number.isRequired, // 规则类型
  description: PropTypes.string, // 规则描述
};

export default Form.create()(BaseInfo);
