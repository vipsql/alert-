import React, { PropTypes } from 'react'
import { connect } from 'dva'
import LeftMenu from '../components/layout/leftMenu/leftWrap'
import styles from '../components/layout/main.less'
import Bread from '../components/layout/bread/index'
import { Spin } from 'antd'
import { classnames } from '../utils'
import '../components/layout/common.less'

function App({ children, location, dispatch, app, isNeedContent, temp }) {
  const { isShowMask, isFold } = app
  // params.isNeedContent确定需不需要content这个容器
  const { params } = children && children.props || {};

  const LeftMenuProps = {
    isFold,
    location,
    handleFoldMenu() {
      dispatch({
        type: 'app/handleFoldMenu'
      })
      // 告警列表柱状图
      dispatch({
        type: 'alertList/updateResize',
        payload: !isFold
      })
      // 告警列表table
      dispatch({
        type: 'alertListTable/updateResize',
        payload: !isFold
      })
      if (location.pathname === '/alertManage' || location.pathname === '/') {
        dispatch({
          type: 'alertManage/queryAlertDashbord',
          payload: {
            isNeedRepaint: true
          }
        })
      }

    }
  }

  return (
    <div>
      {isShowMask && <div className={styles.layer}></div>}
      <div className={classnames(styles.layout, !isFold ? '' : styles.fold)}>
        <LeftMenu {...LeftMenuProps} />
        <div className={styles.main}>
          <Bread location={location} />
          <div className={styles.container}>
            <div className={params && params.isNeedContent === false ? styles.no_content : styles.content} id="content">
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

export default connect(({ app }) => ({ app }))(App)
