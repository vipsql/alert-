import React, { Component } from 'react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal/index'
import { Form, Input } from 'antd'

const localeMessages = defineMessages({
  saveFilter: {
    id: 'alertQueryFilter.saveFilter',
    defaultMessage: '保存过滤条件'
  },
  savePlaceholder: {
    id: 'alertQueryFilter.savePlaceholder',
    defaultMessage: '请输入当前过滤条件的名称'
  }
})

const FilterSaveModal = ({ dispatch, form, intl: { formatMessage }, isShowSaveModal }) => {
  const { getFieldDecorator, getFieldsValue } = form;
  const okProps = {
    onClick: () => {
      const formData = form.getFieldsValue();
      dispatch({
        type: 'alertQueryFilter/saveFilter',
        payload: {
          name: formData.name
        }
      })
    }
  }

  const cancelProps = {
    onClick: () => {
      dispatch({
        type: 'alertQueryFilter/closeSaveModal'
      })
    }
  }
  return (
    <CommonModal
      title={formatMessage({ ...localeMessages['saveFilter'] })}
      isShow={isShowSaveModal}
      okProps={ okProps }
      cancelProps={ cancelProps }
    >
      <Form>
        {getFieldDecorator('name', {
          initialValue: '',
          rules: {
            required: true
          }
        })(
          <Input placeholder={ formatMessage({ ...localeMessages['savePlaceholder'] }) } />
        )}
      </Form>
    </CommonModal>
  )
}

export default injectIntl(Form.create({
  mapPropsToFields: (props) => {
    return { name: '' }
  }
})(FilterSaveModal));

