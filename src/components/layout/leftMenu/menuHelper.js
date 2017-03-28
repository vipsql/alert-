import React from 'react'
import styles from '../main.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const formatMessages = defineMessages({
    set:{
      id: 'leftMenu_set',
      defaultMessage: '设置',
    },
    help: {
      id: 'lefeMenu_help',
      defaultMessage: '帮助',
    }
})

function FoldBar({ isFold, handleFoldMenu}){
  // const handleFoldMenu = () => {
  //   const isExpand = isFold ? true : fasle
  //   handleFoldMenu(isExpand)
  // }
  const muenClass = !isFold ? 'icon-cebianlanshouqi' : 'icon-cebianlanzhankai';
  const arrClass = classnames(
    styles['switchMenu'],
    styles.iconfont,
    styles[muenClass]
  )
  const setClass = classnames(
    styles['icon'],
    styles.iconfont,
    styles['icon-bushu']
  )
  const helpClass = classnames(
    styles['icon'],
    styles.iconfont,
    styles['icon-bangzhu']
  )

  return (
    <div className={styles.menuAssist}>
      <div onClick={handleFoldMenu} className={styles.foldBar}>
        <div className={styles.foldBarLine}></div>
        <i className={arrClass}></i>
      </div>
      <div className={styles.menuSet}><a href="#alertSet"><i className={setClass}></i>{!isFold ? <FormattedMessage {...formatMessages['set']} /> : ''}</a></div>
      <div className={styles.menuHelp}><a href="#alertHelp"><i className={helpClass}></i>{!isFold ? <FormattedMessage {...formatMessages['help']} /> : ''}</a></div>
    </div>
  )
}
export default FoldBar
