import React, { PropTypes, Component } from 'react'
import { Select, Popover, Checkbox, Dropdown, Menu, Button } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../utils'

const Option = Select.Option;
const DropdownButton = Dropdown.Button;
const alertOperation = ({position, alertOperation, dispatch}) => {

    const { columnList, selectGroup } = alertOperation

    // static data
    // <div className={styles.button}><p>派发工单</p></div>
    // <div className={styles.button}><p>关闭告警</p></div>
    // <div className={styles.button}><p>抑制告警</p><i className={classnames(arrClass, styles.arrow)}></i></div>
    // <div className={styles.button}><p>更多操作</p><i className={classnames(arrClass, styles.arrow)}></i></div>
    // <div className={classnames(styles.button, styles.rightBtn)}><p>分组显示</p><i className={classnames(arrClass, styles.arrow)}></i></div>
    let isSpread = false;

    const muenClass = !isSpread ? 'icon-xialasanjiao' : 'icon-xialasanjiao-copy';

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

    const switchClass = classnames(
        styles['icon'],
        styles.iconfont,
        styles['icon-anonymous-iconfont']
    )

    const popoverContent = position === 'list' ?
            <div className={styles.popoverMain}>
                {
                    columnList.map( (group, index) => {
                        return (
                            <div key={index} className={styles.colGroup}>
                                <p>{group.name}</p>
                                {
                                    group.cols.map( (item, index) => {
                                        return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={item.checked} onChange={ (e) => {
                                            dispatch({
                                                type: 'alertOperation/checkColumn',
                                                payload: e.target.value,
                                            })
                                        }}>{item.name}</Checkbox></div>
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            :
            undefined
    const menu = (
        <Menu onClick={ () => {
            //出现解除告警的modal，并做相应处理
            console.log(111);
            dispatch({
                type: 'alertOperation/toggleModalState',
                payload: {
                    isOpen: true,
                    modalType: 3
                }
            })
        }}>
            <Menu.Item key="1" className={styles.menuItem}>解除告警</Menu.Item>
        </Menu>
    )
    
    return (
        <div className={styles.operateMain}>
            <Button className={styles.myButton}>派发工单</Button>
            <Button className={styles.myButton}>关闭告警</Button>
            {
                position !== 'detail' ?
                <DropdownButton overlay={menu} className={styles.myDropdown} trigger={['click']} onClick={ () => {
                    // 出现合并告警的modal，并做相应处理
                    console.log(222);
                    dispatch({
                        type: 'alertOperation/toggleModalState',
                        payload: {
                            isOpen: true,
                            modalType: 2
                        }
                    })
                }}>
                    合并告警
                </DropdownButton>
                :
                undefined
            }
            <Select className={styles.selectSingle} defaultValue="0">
                <Option value="0">抑制告警</Option>
                <Option value="1">5分钟内不再提醒</Option>
                <Option value="2">10分钟内不再提醒</Option>
                <Option value="3">半小时内不再提醒</Option>
            </Select>
            <Select className={styles.selectSingle} defaultValue="0">
                <Option value="0">更多操作</Option>
                <Option value="1">转交他人</Option>
                <Option value="2">分享到ChatOps</Option>
                <Option value="3">添加备注</Option>
            </Select>
            {
                position !== 'detail' ?
                <div className={styles.groupMain}>
                    <Select className={classnames(styles.setGroup, styles.selectSingle)} placeholder="分组显示" value={selectGroup} onChange={ (value) => {
                        dispatch({
                            type: 'alertOperation/setGroupType',
                            payload: value,
                        })
                    }}>
                        <Option className={styles.menuItem} value="0">按来源分组</Option>
                        <Option className={styles.menuItem} value="1">按状态分组</Option>
                        <Option className={styles.menuItem} value="2">按级别分组</Option>
                        <Option className={styles.menuItem} value="3">按位置分组</Option>
                    </Select>
                    <i className={selectGroup !== '分组显示' && classnames(switchClass, styles.switch)} onClick={() => {
                        dispatch({
                            type: 'alertOperation/removeGroupType',
                        })
                    }}></i>
                </div>
                :
                undefined
            }
            { position === 'list' 
                ? <Popover placement='bottomRight' trigger="click" content={popoverContent}>
                    <div className={classnames(styles.button, styles.rightBtn)}>
                        <i className={classnames(setClass, styles.setCol)}></i>
                        <p className={styles.col}>列定制</p>
                    </div>
                  </Popover>
                : undefined
            }
        </div>
    )
}

alertOperation.defaultProps = {
    position: 'list',
}

alertOperation.propTypes = {
    position: React.PropTypes.oneOf(['list', 'timeAxis', 'detail']).isRequired,
}

export default connect((state) => {
  return {
    alertOperation: state.alertOperation
  }
})(alertOperation)