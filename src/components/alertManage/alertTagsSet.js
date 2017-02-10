import React, { PropTypes,Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import styles from './index.less'
import { classnames } from '../../utils'
import dva from 'dva'


const AlertSetModal = ({dispatch, alertTagsSet}) => {
  const {
    modalVisible,
    selectedTagsNum,
    tagsNum,
    currentTagsList,
    changSelectTag
  } = alertTagsSet

    const setClass = classnames(
      styles['iconfont'],
      styles['icon-wancheng']
    )

    const itemSelect = (e) => {

      console.log(e.target);
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
    
    const tasgCon = []
    const tags = currentTagsList.map((item) => {
      const tagsDetail = item.tags.map((tag) => {
        return (
          <span className={tag.selected && styles.tagsSelected} key={tag.key} data-id={ tag.key } onClick={ itemSelect }>
            {tag.name}
            <i className={tag.selected && setClass}></i>
          </span>
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
      <Button type="primary" onClick={ () => {
        dispatch({
          type: 'alertTagsSet/queryAlertDashbord'
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
          <div className={styles.focusSetModalMain}>
            <p>已选择<span>{selectedTagsNum}</span>个关注内容</p>
            <ul>
              {tags}
            </ul>
          </div>
        </Modal>


  )
}
export default connect(({alertTagsSet}) => ({alertTagsSet}))(AlertSetModal)
