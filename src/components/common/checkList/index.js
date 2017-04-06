import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';


const checkList = ({itemList, checkedNum, isSpreadTags, checkHandler, origin}) => {

    const formatMessages = defineMessages({
        text:{
          id: 'alertManage.dashbord.selectedText',
          defaultMessage: '已选择 {num} 个关注',
          values: {
            num: <span className={styles.textNum} >{checkedNum}</span>
          }
        }
    })

    const setClass = classnames(
      'iconfont',
      'icon-wancheng'
    )
    
    const tags = itemList.map((item, index) => {
      const tagsDetail = item.values.map((tag, index) => {
        return (
          <span className={tag.selected && styles.tagsSelected} key={ index } data-id={origin === 'main' ? tag.id : JSON.stringify({field: item.name, name: tag.name})} onClick={ (e) => {checkHandler(e)} }>
            {tag.name}
            <i className={tag.selected && setClass}></i>
          </span>
        )
      })
      return (
        <li key={index}>
          <div className={styles.tagsName}>{item.name}:</div>
          {tagsDetail}
        </li>
      )
    })

    return (
        <div className={styles.ckeckModalMain}>
            { typeof checkedNum !== 'undefined' 
                ? <p className={styles.checkedText}><FormattedMessage {...formatMessages['text']} /></p>
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
    checkHandler: React.PropTypes.func.isRequired,
    origin: React.PropTypes.string
}

export default checkList;