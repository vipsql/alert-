import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'

const tagsGroup = ({className, removeHandler, tagsList, haveTags}) => {

    const switchClass = classnames(
        'icon',
        'iconfont',
        'icon-anonymous-iconfont'
    )

    const renderName = (key, name) => {
        if (key == 'severity' || key == 'status') {
            return <p>{ window[`_${key}`][name] }</p>
        } else {
            return <p>{ name }</p>
        }
    }
    
    return (
        haveTags ? <div className={className}>
                <p className={styles.typeName}>{`${ tagsList.keyName }:`}</p>
                {
                    tagsList.values.map( (item, index) => {
                        return (
                            <div key={ index } className={styles.tagName}>
                                {renderName(tagsList.key, item)}
                                <i className={switchClass} data-id={JSON.stringify({field: tagsList.key, name: item})} onClick={(e) => removeHandler(e)}></i>
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