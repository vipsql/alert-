import React, {
  PropTypes,
  Component
} from 'react';
import { default as cls } from 'classnames';
import { Form, Select } from 'antd';

import styles from './alertSource.less';

const FormItem = Form.Item;
const Option = Select.Option;

class AlertSource extends Component {
  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { source } = this.props;
    setFieldsValue({
      source
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="AlertSource">
        <h2>告警来源</h2>
        <Form>
          <FormItem
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
        </Form>
      </div>
    );
  }
}

AlertSource.defaultProps = {
  source: ''
};

AlertSource.propTypes = {
  source: PropTypes.string.isRequired, // 规则类型
};

export default Form.create()(AlertSource);
