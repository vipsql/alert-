import React, { PropTypes,Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import styles from './index.less'
import { classnames } from '../../utils'
import CheckList from '../common/checkList/index.js'
import checkStyles from '../common/checkList/index.less'
import dva from 'dva'


const AlertSetModal = ({dispatch, alertTagsSet}) => {
  const {
    modalVisible,
    selectedTagsNum,
    tagsNum,
    currentTagsList,
    changSelectTag
  } = alertTagsSet

    const itemSelect = (e) => {
      let tagId = e.target.getAttribute('data-id');
      dispatch({
        type: 'alertTagsSet/changSelectTag',
        payload: tagId
      })
    }

    const closeTagsModal = () => {
      dispatch({
        type: 'alertTagsSet/toggleTagsModal',
        payload: false
      })
      dispatch({
        type: 'alertTagsSet/clear',
      })
    }

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        dispatch({
          type: 'alertTagsSet/addAlertTags'
        })
      }} >确认</Button>
      <Button type="ghost" onClick={ () => {
        dispatch({
          type: 'alertTagsSet/resetSelected',
        })
      }}>重置</Button>
      </div>
    )

    return (
        <Modal
          title="关注设置"
          maskClosable="true"
          onCancel={closeTagsModal}
          visible={modalVisible}
          footer={modalFooter}
        >
          <CheckList 
            itemList={ currentTagsList }
            checkedNum={ selectedTagsNum }
            isSpreadTags={ true }
            checkHandler={ itemSelect }
          />
        </Modal>


  )
}
export default connect(({alertTagsSet}) => ({alertTagsSet}))(AlertSetModal)
