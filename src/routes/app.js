import React, { PropTypes } from 'react'
import { connect } from 'dva'
import LeftMenu from '../components/layout/leftMenu/leftWrap'
import styles from '../components/layout/main.less'
import Bread from '../components/layout/bread/index'
import { Spin } from 'antd'
import { classnames } from '../utils'
import '../components/layout/common.less'

function App ({children, location, dispatch, app}) {
  const {isShowMask, isFold} = app
  const LeftMenuProps = {
    isFold,
    location,
    handleFoldMenu(){
      dispatch({
        type: 'app/handleFoldMenu'
      })
    }
  }

  return (
    <div>
      {isShowMask && <div className={styles.layer}></div>}
      <div className={classnames(styles.layout,!isFold ? '' : styles.fold)}>
        <LeftMenu {...LeftMenuProps} />
        <div className={styles.main}>
          <Bread location={location} />
          <div className={styles.container}>
            <div className={styles.content}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  isFold: PropTypes.bool
}

export default connect(({app}) => ({app}))(App)
