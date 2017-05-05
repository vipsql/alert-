import React, { PropTypes,Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import styles from './index.less'
import { classnames } from '../../utils'
//import CheckList from '../common/checkList/index.js'
import TagsQuery from '../common/tagsQuery/index.js'
import checkStyles from '../common/checkList/index.less'
import dva from 'dva'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const formatMessages = defineMessages({
    set:{
      id: 'alertManage.addTags',
      defaultMessage: '关注设置',
    },
    ok: {
      id: 'alertManage.setModal.ok',
      defaultMessage: '确认',
    },
    reset: {
      id: 'alertManage.setModal.reset',
      defaultMessage: '重置',
    }
})

const AlertSetModal = ({dispatch, alertTagsSet}) => {
    const {
      modalVisible,
      selectedTagsNum,
      tagsNum,
      currentTagsList,
      changSelectTag,
      tagsKeyList,
    } = alertTagsSet;

    const itemSelect = (e) => {
      e.stopPropagation();
      let tagId = e.target.getAttribute('data-id');
      dispatch({
        type: 'alertTagsSet/changSelectTag',
        payload: tagId
      })
    }

    const closeTagsModal = () => {
      dispatch({
        type: 'alertTagsSet/closeModal',
        payload: false
      })
    }

    const tagsQueryProps = {
      tagsKeyList,
      closeOneItem: (e) => {
        e.stopPropagation();
        let tagrget = JSON.parse(e.target.getAttribute('data-id'));
        console.log(tagrget)
        // dispatch({
        //   type: 'alertTagsSet/changSelectTag',
        //   payload: tagId
        // })
      },
      closeAllItem: (e) => {
        e.stopPropagation();
        let tagrget = JSON.parse(e.target.getAttribute('data-id'));
        console.log(tagrget)
      }
    }

    const modalFooter = []
    modalFooter.push(<div key={'0'} className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        dispatch({
          type: 'alertTagsSet/addAlertTags'
        })
      }} ><FormattedMessage {...formatMessages['ok']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        dispatch({
          type: 'alertTagsSet/resetSelected',
        })
      }}><FormattedMessage {...formatMessages['reset']} /></Button>
      </div>
    )

    return (
        <Modal
          title={<FormattedMessage {...formatMessages['set']} />}
          maskClosable="true"
          onCancel={closeTagsModal}
          visible={modalVisible}
          footer={modalFooter}
        >
          <TagsQuery
            {...tagsQueryProps}
          />
        </Modal>


  )
}
export default connect(({alertTagsSet}) => ({alertTagsSet}))(AlertSetModal)

// <CheckList
//   origin={'main'}
//   itemList={ currentTagsList }
//   checkedNum={ selectedTagsNum }
//   isSpreadTags={ true }
//   checkHandler={ itemSelect }
// />
