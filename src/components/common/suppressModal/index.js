import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const suppressModal = ({suppressTime, isShowSuppressModal, onOk, onCancel}) => {

    const localeMessage = defineMessages({
        suppress: {
            id: 'modal.suppress',
            defaultMessage: '抑制'
        },
        cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        suppress_title: {
            id: 'modal.suppressIncident',
            defaultMessage: '抑制告警'
        },
        suppressMessage: {
            id: 'modal.suppress.message',
            defaultMessage: '您确定要{time}分钟内不再提醒吗',
            values: {
                time: suppressTime
            }
        }
    })

    const modalFooter = []
    modalFooter.push(<div key={1} className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        onOk(suppressTime)
      }} ><FormattedMessage {...localeMessage['suppress']} /></Button>
      <Button type="primary" onClick={ () => {
        onCancel()
      }}><FormattedMessage {...localeMessage['cancel']} /></Button>
      </div>
    )

    return (
        <Modal
          title={<FormattedMessage {...localeMessage['suppress_title']} />}
          maskClosable="true"
          onCancel={ onCancel }
          visible={ isShowSuppressModal }
          footer={ modalFooter }
        >
            <div className={styles.suppressMain}>
                <p><FormattedMessage {...localeMessage['suppressMessage']} /></p>
            </div>
        </Modal>
    )
}

suppressModal.propTypes = {

}

export default injectIntl(suppressModal);