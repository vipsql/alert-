import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'

const levelIcon = ({extraStyle, iconType, initalIconState, onClick, iconState}) => {

    // mapping iconType to classname 
    const iconStyle = iconType === 'jj' || iconType == 50
                    ? classnames(styles.iconMain, extraStyle, styles.jjColorIcon)
                    : iconType === 'zy' || iconType == 40
                        ? classnames(styles.iconMain, extraStyle, styles.zyColorIcon)
                        : iconType === 'cy' || iconType == 30
                            ? classnames(styles.iconMain, extraStyle, styles.cyColorIcon)
                            : iconType === 'gj' || iconType == 20
                                ? classnames(styles.iconMain, extraStyle, styles.gjColorIcon)
                                : iconType === 'tx' || iconType == 10
                                    ? classnames(styles.iconMain, extraStyle, styles.txColorIcon)
                                    : false
    
    const whiteIcon = classnames(styles.whiteIcon, iconStyle)

    return initalIconState 
                    ? typeof iconState === 'undefined' || iconState
                        ? <div className={iconStyle} onClick={ (e) => onClick(e) }></div>
                            : <div className={whiteIcon} onClick={(e) => onClick(e)}></div>
                    : typeof iconState !== 'undefined' && iconState
                        ? <div className={iconStyle} onClick={(e) => onClick(e)}></div>
                            : <div className={whiteIcon} onClick={(e) => onClick(e)}></div>
}

levelIcon.defaultProps = {
    iconType: 'jj',
    initalIconState: true, // true --> fill
    onClick: () => {}
}

levelIcon.propTypes = {
    iconType: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]).isRequired,
    initalIconState: React.PropTypes.bool.isRequired,
    iconState: React.PropTypes.bool, // true --> fill
    extraStyle: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool
    ]),
    onClick: React.PropTypes.func.isRequired
}

export default levelIcon