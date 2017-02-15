import React from 'react'
import {Menu } from 'antd'
import { connect } from 'dva'
import styles from '../main.less'
import Menus from './menu'
import FoldBar from './menuHelper'

function LeftWrap({isFold, handleFoldMenu , location}){
  // menu props
  const menuProps = {
    isFold,
    location
  }

  // foldBar props
  const foldBarProps = {
    isFold,
    handleFoldMenu
  }

  return (
    <div className={styles.leftMenu}>
      <Menus {...menuProps} className={styles.siderMenu} />
      <FoldBar {...foldBarProps} />
    </div>
  )
}
export default connect()(LeftWrap)
