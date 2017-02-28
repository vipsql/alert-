import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import { menu } from '../../../utils'
import styles from '../common.less'
import { classnames } from '../../../utils'

const createMenus = (menus, isFold) => {
  return menus.map(item => {
    const path = '/';
    const iconName = `icon-${item.icon}`
    const className = classnames(
      'icon',
      styles[iconName],
      styles.iconfont

    )

    return (
      <Menu.Item key={item.key}>
        <Link to={path + item.key}>
          <i className={className}></i>

          {isFold ? '' : item.name}
        </Link>
      </Menu.Item>
    )
  })
}

function Menus ({ isFold, location,  handleClickNavMenu, className }) {
  const menuItems = createMenus(menu, isFold)
  return (
    <Menu
      className={className}
      mode={isFold ? 'vertical' : 'inline'}
      onClick={handleClickNavMenu}
      defaultSelectedKeys={[location.pathname.split('/')[location.pathname.split('/').length - 1] || 'alertManage']}>
      {menuItems}
    </Menu>
  )
}

export default Menus
