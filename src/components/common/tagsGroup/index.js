import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'
import Animate from 'rc-animate'

class tagsGroup extends Component{

    constructor(props) {
        super(props)
        let timer = null;
        this.isNodeInRoot = this.isNodeInRoot.bind(this)
    }

    isNodeInRoot(node, root) {
        while(node) {
            if(node === root) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    visible(target, e) {
        e.stopPropagation();

        let root = this.ulNode;
        if (!this.isNodeInRoot(e.target, root) && this.props.setVisible) {
            this.props.setVisible(target)
        }
    }

    renderName(key, name) {
        if (key == 'severity' || key == 'status') {
            return <p>{ window[`_${key}`][name] }</p>
        } else {
            return <p>{ name }</p>
        }
    }

    renderQueryContent(content) {
        const wancheng = classnames(
            'icon',
            'iconfont',
            'icon-wancheng'
        )
        return (
            <ul className={styles['tags-content']} ref={node => this.ulNode = node}>
                <li>
                    <input ref={node => this.inputNode = node} type='text' placeholder={'请输入关键字搜索'} onChange={ (e) => {
                        e.persist();
                        clearTimeout(this.timer)
                        
                        this.timer = setTimeout( () => {
                            this.props.queryTagValues(content.key, e.target.value)
                        }, 500)
                    }} onFocus={ () => { this.props.queryTagValues(content.key, '') }}/>
                </li>
                {
                    this.props.selectList.length > 0 ? this.props.selectList.map( (item) => {
                        return  <li key={item.id} data-id={JSON.stringify({field: content.key, item: item})} onClick={ (e) => {
                            this.props.changeHandler(e)
                            this.inputNode.value = '';
                        }}>{this.renderName(item.key, item.value)}{item.checked && <i className={wancheng}></i>}</li>
                    }) : <li>Not Found</li>
                }
            </ul>
        )
    }

    render() {
        let {className, removeHandler, content, haveTags} = this.props;
        const switchClass = classnames(
            'icon',
            'iconfont',
            'icon-anonymous-iconfont'
        )
        
        return (
            haveTags ? 
            <div className={className} onClick={this.visible.bind(this, ...arguments, content)}>
                <p className={styles.typeName}>{`${ content.keyName }:`}</p>
                {
                    content.values.map( (item, index) => {
                        return (
                            <div key={ index }>
                                {this.renderName(content.key, item)}
                                <i className={switchClass} 
                                data-id={JSON.stringify({field: content.key, name: item})} 
                                onClick={(e) => removeHandler(e)}></i>
                            </div>
                        )
                    })
                }
                <Animate
                    transitionName="tags"
                    transitionEnterTimeout={300} 
                    transitionLeaveTimeout={300}
                >
                {content.visible && this.renderQueryContent(content)}
                </Animate>
            </div>
            :
            <div className={className} onClick={this.visible.bind(this, ...arguments, content)}>
                <p className={styles.typeName}>{`${ content.keyName }:`}</p>
                <span className={styles.placeholder}>请选择{`${content.keyName}`}</span>
                <Animate
                    transitionName="tags"
                    transitionEnterTimeout={300} 
                    transitionLeaveTimeout={300}
                >
                {content.visible && this.renderQueryContent(content)}
                </Animate>
            </div>
        )
    }
}

tagsGroup.defaultProps = {
    className: styles.tagsGroupMain,
    removeHandler: () => {},
    content: {},
    setVisible: () => {}
}

tagsGroup.propTypes = {
    haveTags: React.PropTypes.bool.isRequired,
    className: React.PropTypes.string.isRequired,
    content: React.PropTypes.object.isRequired,
    removeHandler: React.PropTypes.func.isRequired,
    setVisible: React.PropTypes.func.isRequired
}

export default tagsGroup