import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'

const levelIcon = ({extraStyle, iconType, initalIconState, onClick, iconState}) => {

    // mapping iconType to classname 
    const iconStyle = iconType === 'jj' 
                    ? classnames(styles.iconMain, extraStyle, styles.jjColorIcon)
                    : iconType === 'zy'
                        ? classnames(styles.iconMain, extraStyle, styles.zyColorIcon)
                        : iconType === 'cy'
                            ? classnames(styles.iconMain, extraStyle, styles.cyColorIcon)
                            : iconType === 'gj'
                                ? classnames(styles.iconMain, extraStyle, styles.gjColorIcon)
                                : iconType === 'tx'
                                    ? classnames(styles.iconMain, extraStyle, styles.txColorIcon)
                                    : false
    
    const whiteIcon = classnames(styles.whiteIcon, iconStyle)

    return initalIconState 
                    ? typeof iconState === 'undefined' || iconState
                        ? <div data-Type={iconType} className={iconStyle} onClick={ (e) => onClick(e) }></div>
                            : <div data-Type={iconType} className={whiteIcon} onClick={(e) => onClick(e)}></div>
                    : typeof iconState !== 'undefined' && iconState
                        ? <div data-Type={iconType} className={iconStyle} onClick={(e) => onClick(e)}></div>
                            : <div data-Type={iconType} className={whiteIcon} onClick={(e) => onClick(e)}></div>
}

levelIcon.defaultProps = {
    iconType: 'jj',
    initalIconState: true, // true --> fill
    onClick: () => {}
}

levelIcon.propTypes = {
    iconType: React.PropTypes.string.isRequired,
    initalIconState: React.PropTypes.bool.isRequired,
    iconState: React.PropTypes.bool, // true --> fill
    extraStyle: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
}

export default levelIcon