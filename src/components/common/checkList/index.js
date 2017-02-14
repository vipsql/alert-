import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'

const checkList = ({itemList, checkedNum, isSpreadTags, checkHandler}) => {

    const setClass = classnames(
      styles['iconfont'],
      styles['icon-wancheng']
    )

    const tags = itemList.map((item) => {
      const tagsDetail = item.tags.map((tag) => {
        return (
          <span className={tag.selected && styles.tagsSelected} key={tag.key} data-id={tag.key} onClick={ (e) => {checkHandler(e)} }>
            {tag.name}
            <i className={tag.selected && setClass}></i>
          </span>
        )
      })
      return (
        <li key={item.key}>
          <span className={styles.tagsName}>{item.name}:</span>
          {tagsDetail}
        </li>
      )
    })

    return (
        <div className={styles.ckeckModalMain}>
            { typeof checkedNum !== 'undefined' 
                ? <p className={styles.checkedText}>已选择<span>{checkedNum}</span>个关注内容</p>
                : undefined }
            <ul>
                {tags}
            </ul>
        </div>
    )
}

checkList.defaultProps = {
    itemList: [],
    checkedNum: undefined,
    isSpreadTags: true,
    checkHandler: () => {}
}

checkList.propTypes = {
    itemList: React.PropTypes.array.isRequired,
    checkedNum: React.PropTypes.number,
    isSpreadTags: React.PropTypes.bool.isRequired,
    checkHandler: React.PropTypes.func.isRequired
}

export default checkList;