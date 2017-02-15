import React from 'react'
import styles from '../main.less'



function FoldBar({ isFold, handleFoldMenu}){
  // const handleFoldMenu = () => {
  //   const isExpand = isFold ? true : fasle
  //   handleFoldMenu(isExpand)
  // }
  return (
    <div onClick={handleFoldMenu} className={styles.foldBar}>
      {isFold ? '展开' : '折叠'}
    </div>
  )
}
export default FoldBar
