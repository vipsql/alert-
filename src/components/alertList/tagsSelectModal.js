import React, { PropTypes,Component } from 'react'
import { Modal, Button } from 'antd'
import styles from './index.less'
import { classnames } from '../../utils'
import TagsQuery from '../common/tagsQuery/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const formatMessages = defineMessages({
    set:{
      id: 'alertList.selectTags',
      defaultMessage: '选择标签过滤',
    },
    ok: {
      id: 'modal.ok',
      defaultMessage: '确定',
    },
    cancel: {
      id: 'modal.cancel',
      defaultMessage: '取消',
    }
})

const tagsSelectModal = ({dispatch, tagListFilter}) => {
    const {
      isShowSelectModal,
      tagsKeyList,
      selectList
    } = tagListFilter;


    const closeTagsModal = () => {
      dispatch({
        type: 'tagListFilter/toggleTagsSelect',
        payload: false
      })
    }

    const tagsQueryProps = {
      origin: 'filter',
      tagsKeyList,
      selectList,
      closeOneItem: (e) => {
        e.stopPropagation();

        let tagrget = JSON.parse(e.target.getAttribute('data-id'));
        dispatch({
          type: 'tagListFilter/closeOneItem',
          payload: tagrget
        })
      },
      closeAllItem: (e) => {
        e.stopPropagation();

        let tagrget = JSON.parse(e.target.getAttribute('data-id'));
        dispatch({
          type: 'tagListFilter/closeAllItem',
          payload: tagrget
        })
      },
      mouseLeave: (target) => {
        dispatch({
          type: 'tagListFilter/mouseLeave',
          payload: JSON.parse(target)
        })
      },
      deleteItemByKeyboard: (target) => {
        dispatch({
          type: 'tagListFilter/deleteItemByKeyboard',
          payload: JSON.parse(target)
        })
      },
      queryTagValues: (key, message) => {
        dispatch({
          type: 'tagListFilter/queryTagValues',
          payload: {
            key: key,
            value: message
          }
        })
      },
      addItem: (e) => {
        e.stopPropagation();

        let tagrget = JSON.parse(e.target.getAttribute('data-id'));
        dispatch({
          type: 'tagListFilter/addSelectedItem',
          payload: tagrget
        })
      }
    }

    const modalFooter = []
    modalFooter.push(<div key={'0'} className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        dispatch({
          type: 'tagListFilter/saveFilterTags'
        })
      }} ><FormattedMessage {...formatMessages['ok']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={
        closeTagsModal
      }><FormattedMessage {...formatMessages['cancel']} /></Button>
      </div>
    )

    return (
        <Modal
          wrapClassName={styles.myModal}
          title={<FormattedMessage {...formatMessages['set']} />}
          maskClosable="true"
          onCancel={closeTagsModal}
          visible={isShowSelectModal}
          footer={modalFooter}
        >
          <TagsQuery
            {...tagsQueryProps}
          />
        </Modal>


  )
}
export default tagsSelectModal