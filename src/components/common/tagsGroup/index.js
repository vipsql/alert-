import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'

const tagsGroup = ({className, removeHandler, tagsList, haveTags}) => {

    const switchClass = classnames(
        'icon',
        'iconfont',
        'icon-anonymous-iconfont'
    )

    return (
        haveTags ? <div className={className}>
                <p className={styles.typeName}>{`${ tagsList.name }:`}</p>
                {
                    tagsList.values.map( (item, index) => {
                        return (
                            <div key={ index } className={styles.tagName}>
                                <p>{ item.name }</p>
                                <i className={switchClass} data-id={item.name} onClick={(e) => removeHandler(e)}></i>
                            </div>
                        )
                    })
                }
            </div>
            : false
    )
}

tagsGroup.defaultProps = {
    className: styles.tagsGroupMain,
    removeHandler: () => {},
    tagsList: {}
}

tagsGroup.propTypes = {
    haveTags: React.PropTypes.bool.isRequired,
    className: React.PropTypes.string.isRequired,
    tagsList: React.PropTypes.object.isRequired,
    removeHandler: React.PropTypes.func.isRequired,
}

export default tagsGroup