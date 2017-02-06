import React, { PropTypes,Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import styles from './index.less'
import dva from 'dva'


const AlertSetModal = ({dispatch, alertTagsSet}) => {
  const {
    modalVisible,
    tagsNum,
    tagsList,
    changSelectTag,
    closeTagsModal
  } = alertTagsSet

    const tasgCon = []
    const tags = tagsList.map((item) => {
      const tagsDetail = item.tags.map((tag) => {
        return (
          <span className={tag.selected && styles.tagsSelected}>{tag.name}</span>
        )
      })
      return (
        <li>
          <span className={styles.tagsName}>{item.name}:</span>
          {tagsDetail}
        </li>
      )
    })

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary">确认</Button>
      <Button type="ghost">重置</Button>
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
        <div className={styles.focusSetModalMain}>
          <p>已选择<span>6</span>个关注内容</p>
          <ul>
          {tags}
          </ul>
        </div>
        </Modal>


  )
}
export default connect(({alertTagsSet}) => ({alertTagsSet}))(AlertSetModal)
