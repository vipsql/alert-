import React from 'react';
import { Form, DatePicker } from 'antd';
import styles from '../customField.less'
const FormItem = Form.Item;

export default class CTMDateTime extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;

    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator(item.code, _.merge(
              {
                rules: [
                  {
                    required: item.isRequired === 1 ? true : false,
                    message: window.__alert_appLocaleData.messages['ITSMWrapper.create.select_right'] + item.name
                  }
                ]
              },
              prop
            ))(
              <DatePicker
                disabled={ disabled }
                showTime={ item.formatDate ? false : true }
                format={ item.formatDate ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm" }
                getCalendarContainer={ ()=> {
                  return document.getElementById('content') || document.body
                }}
              />
            )
          }
        </FormItem>
      </div>

    )
  }
}
