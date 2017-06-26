import React, { PropTypes, Component } from 'react'
import { Modal, Button, Checkbox, Form, Input, Select, Row, Col } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const localMessage = defineMessages({
  modal_cancel: {
    id: 'modal.cancel',
    defaultMessage: '取消'
  },
  modal_reassign: {
    id: 'modal.reassign',
    defaultMessage: '转派',
  },
  modal_reassignTitle: {
    id: 'modal.reassignTitle',
    defaultMessage: '转派指定人员'
  },
  modal_specificUser: {
    id: 'modal.specificUser',
    defaultMessage: '指定人员'
  }

})
class ReassignModal extends Component {

  constructor(props) {
    super(props)

  }

  render() {
    const { isShowReassingModal, handleOk, handleCancel, reassignUsers, intl: { formatMessage } } = this.props;
    const footer = (
      <div className={styles.footer}>
        <Button type="primary" onClick={handleOk}><FormattedMessage {...localMessage['modal_reassign']} /></Button>
        <Button type="primary" onClick={handleCancel}><FormattedMessage {...localMessage['modal_cancel']} /></Button>
      </div>
    )
    // const itemProps = {
    //   label: formatMessage({ ...localMessage['modal_specificUser'] }),
    //   labelCol: { span: 4 },
    //   wrapperCol: { span: 20 }
    // }
    const selectProps = {
      // mode: 'tags',
      size: 'large',
      style: {width: '100%'}
    }
    const users = reassignUsers.map(user => {
      return (
        <Select.Option key={user.id}>{user.name}</Select.Option>
      )
    })

    return (
      <Modal
        title={formatMessage({ ...localMessage['modal_reassignTitle'] })}
        visible={isShowReassingModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={footer}
      >
        {/*<Form>
          <Form.Item {...itemProps}>
            <Input />
          </Form.Item>
        </Form>*/}
        <Row>
          <Col span='4' style={{lineHeight: '32px'}}>{formatMessage({ ...localMessage['modal_specificUser'] }) + ': '}</Col>
          <Col span='20'>
            <Select {...selectProps}>{users}</Select>
          </Col>
        </Row>

      </Modal>
    )
  }
}

ReassignModal.propTypes = {

}

export default injectIntl(ReassignModal);
