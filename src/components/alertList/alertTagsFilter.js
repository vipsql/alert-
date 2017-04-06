import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import CheckList from '../common/checkList/index.js'
import checkStyles from '../common/checkList/index.less'
import TagsGroup from '../common/tagsGroup/index.js'
import tagsStyles from '../common/tagsGroup/index.less'
import { classnames } from '../../utils'


const alertTagsFilter = ({dispatch, tagListFilter}) => {

    const {
      isSpread,
      tagsList
    } = tagListFilter;

    const muenClass = !isSpread ? 'icon-xialasanjiao' : 'icon-xialasanjiao-copy';
    const arrClass = classnames(
        'switchMenu',
        'iconfont',
        muenClass
    )

    const switchClass = classnames(
        'icon',
        'iconfont',
        'icon-guolv'
    )

    const clickBtn = () => {
      dispatch({
        type: 'tagListFilter/toggleTagsSelect',
        payload: true
      })
    }

    const moveoutDiv = () => {
      dispatch({
        type: 'tagListFilter/toggleTagsSelect',
        payload: false
      })
    }

    const itemSelect = (e) => {
      let tagName = JSON.parse(e.target.getAttribute('data-id'));
      dispatch({
        type: 'tagListFilter/changeTags',
        payload: tagName
      })
    }

    const removefun = (e) => {
      let tagName = JSON.parse(e.target.getAttribute('data-id'));
      dispatch({
        type: 'tagListFilter/removeTag',
        payload: tagName
      })
    }

    const tagsGroup = tagsList.map( (item, index) => {
      let temp = item.values.filter( tag => tag.selected )
      let renderItem = { ...item, values: temp }
      return <TagsGroup key={ index } haveTags={typeof temp !== 'undefined' && temp.length !== 0 ? true : false} 
        className={classnames(tagsStyles.tagsGroupMain, styles.tagsGroup)} tagsList={ renderItem } removeHandler={removefun}/>
    })

    return (
        <div className={styles.tagsIframe}>
            <div className={styles.selectBtn} onClick={clickBtn}>
                <i className={classnames(switchClass, styles.hopper)}></i>
                <div className={classnames(arrClass, styles.iconDiv)}></div>
                { isSpread ? 
                    <div className={styles.selectModalMain}>
                        <div className={styles.triangle}></div>
                        <div className={styles.container} onMouseLeave={moveoutDiv}>
                            <CheckList
                                origin={'list'}
                                itemList={ tagsList }
                                isSpreadTags={ true }
                                checkHandler={ itemSelect }
                            />
                        </div>
                    </div> 
                    : undefined }
            </div>
            {tagsGroup}
        </div>
    )

}

export default connect((state) => {
  return {
    tagListFilter: state.tagListFilter
  }
})(alertTagsFilter)
