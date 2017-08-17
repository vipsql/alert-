import React from 'react';
import { Form, Radio } from 'antd';
import styles from '../itsmMapper.less'
import classnames from 'classnames'
import _ from 'lodash'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class CTUrgentLevel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;

    return (
      <div className={classnames(styles.fullWidth, styles.wrapper)}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator('urgentLevel', _.merge(
              {
                rules: [
                  {
                    required: item.isRequired === 1 ? true : false,
                    message: window.__alert_appLocaleData.messages['ITSMWrapper.create.select_priority']
                  }
                ],
                onChange: ()=>{}//不要删除onChange，单选和下拉多选会偶发出现onChange报错
              },
              prop
            ))(
              <RadioGroup
                disabled={disabled}
              >
                <Radio key={item.code + "1"} value="1">{window.__alert_appLocaleData.messages['ITSMWrapper.create.radio_none']}</Radio>
                <Radio key={item.code + "2"} value="2">{window.__alert_appLocaleData.messages['ITSMWrapper.create.radio_low']}</Radio>
                <Radio key={item.code + "3"} value="3">{window.__alert_appLocaleData.messages['ITSMWrapper.create.radio_normal']}</Radio>
                <Radio key={item.code + "4"} value="4">{window.__alert_appLocaleData.messages['ITSMWrapper.create.radio_high']}</Radio>
                <Radio key={item.code + "5"} value="5">{window.__alert_appLocaleData.messages['ITSMWrapper.create.radio_urgent']}</Radio>
              </RadioGroup>
            )
          }
        </FormItem>
      </div>
    )
  }
}
