import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import TagsSelectModal from './tagsSelectModal'
import CheckList from '../common/checkList/index.js'
import checkStyles from '../common/checkList/index.less'
import TagsGroup from '../common/tagsGroup/index.js'
import tagsStyles from '../common/tagsGroup/index.less'
import { classnames } from '../../utils'


const alertTagsFilter = ({dispatch, tagListFilter}) => {

    const {
      isShowSelectModal,
      shareSelectTags
    } = tagListFilter;

    const arrClass = classnames(
        'switchMenu',
        'iconfont',
        'icon-xialasanjiao'
    )

    const switchClass = classnames(
        'icon',
        'iconfont',
        'icon-guolv'
    )

    const clickBtn = () => {
      dispatch({
        type: 'tagListFilter/openSelectModal',
        payload: {
          isShowSelectModal: true
        }
      })
    }

    const removefun = (e) => {
      let target = JSON.parse(e.target.getAttribute('data-id'));
      dispatch({
        type: 'tagListFilter/removeTag',
        payload: target
      })
    }

    const selectModalProps = {
      dispatch,
      tagListFilter
    }
    
    const tagsGroup = shareSelectTags.map( (item, index) => {
      return <TagsGroup key={ index } haveTags={typeof item.values !== 'undefined' && item.values.length !== 0 ? true : false} 
        className={classnames(tagsStyles.tagsGroupMain, styles.tagsGroup)} tagsList={ item } removeHandler={removefun}/>
    })

    return (
        <div className={styles.tagsIframe}>
            <div className={styles.selectBtn} onClick={clickBtn}>
                <i className={classnames(switchClass, styles.hopper)}></i>
                <div className={classnames(arrClass, styles.iconDiv)}></div>
            </div>
            {tagsGroup}
            <TagsSelectModal {...selectModalProps} />
        </div>
    )

}

export default connect((state) => {
  return {
    tagListFilter: state.tagListFilter
  }
})(alertTagsFilter)
