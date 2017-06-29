import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom';
import styles from './index.less'
import { classnames } from '../../../utils'
import Animate from 'rc-animate'
import KeyCode from 'rc-util/lib/KeyCode';
import scrollIntoView from 'dom-scroll-into-view';
import $ from 'jquery'

class tagsGroup extends Component{

    constructor(props) {
        super(props)
        this.timer = null;
        this.state = {
          current: props.selectList || [], // 当前数组行
          currentIndex: 0 // 当前活跃行
        }
        this.isNodeInRoot = this.isNodeInRoot.bind(this)
        this.changeBykeyBoard = this.changeBykeyBoard.bind(this)
    }

    changeBykeyBoard(event) {
        if( this.props.content && this.props.content.visible && this.state.current.length > 0 ) {
          let currentIndex = this.state.currentIndex;
          switch (event.keyCode) {
            case KeyCode.UP:
              if(currentIndex < 1) {
                currentIndex = this.state.current.length - 1;
              } else {
                currentIndex--
              }
              this.setState({ currentIndex })
              break;
            case KeyCode.DOWN:
              if(currentIndex < this.state.current.length - 1) {
                currentIndex++
              } else {
                currentIndex = 0;
              }
              this.setState({ currentIndex })
              break;
            case KeyCode.ENTER:
              this.props.changeHandler({
                field: this.props.content.key,
                item: this.props.selectList && this.props.selectList[currentIndex]
              })
              break;
            default:
              break;
          }
          if (this.refs[`menu_${currentIndex}`]) {
            scrollIntoView(this.refs[`menu_${currentIndex}`], findDOMNode(this.content), {
              onlyScrollIfNeeded: true,
            })
          }
        }
        return
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectList !== this.props.selectList) {
          this.setState({
            current: nextProps.selectList || [],
            currentIndex: 0
          })
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.changeBykeyBoard, false)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.changeBykeyBoard, false)
    }

    isNodeInRoot(node, root) {
        // vislble = false 没有实例的情况
        if (typeof root === 'undefined') {
          return false;
        }
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

        let root = this.containerNode;
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
            'icon-dui'
        )
        const sousuo = classnames(
            'icon',
            'iconfont',
            'icon-sousuo'
        )
        return (
          <div className={styles.tagsContent} ref={node => this.containerNode = node} >
            <div className={styles.query}>
              <i className={classnames(sousuo, styles.sousuo)} />
              <input ref={node => this.inputNode = node} type='text' placeholder={'请输入关键字搜索'} onChange={ (e) => {
                  e.persist();
                  clearTimeout(this.timer)

                  this.timer = setTimeout( () => {
                      this.props.queryTagValues(content.key, e.target.value)
                  }, 500)
              }} onFocus={ () => {this.props.queryTagValues(content.key, '') }} />
            </div>
            <ul ref={content => this.content = content} >
                {
                    this.props.selectList.length > 0 ? this.props.selectList.map( (item, index) => {
                        return (
                          <li className={this.state.currentIndex === index && styles.active} ref={`menu_${index}`} key={item.id} data-id={JSON.stringify({field: content.key, item: item})} onClick={ (e) => {
                              e.stopPropagation();
                              let target = JSON.parse(e.currentTarget.getAttribute('data-id'));
                              this.props.changeHandler(target)
                              this.inputNode.value = '';
                          }}>{this.renderName(item.key, item.value)}{item.checked && <i className={wancheng}></i>}</li>
                        )
                    }) : <li>Not Found</li>
                }
            </ul>
          </div>
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
                            <div key={ index } className={styles.mark}>
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
