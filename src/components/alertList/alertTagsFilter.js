import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import TagsGroup from '../common/tagsGroup/index.js'
import tagsStyles from '../common/tagsGroup/index.less'
import { classnames } from '../../utils'
import Animate from 'rc-animate'
import _ from 'lodash'
import $ from 'jquery'

class alertTagsFilter extends Component{
  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false,
      shareSelectTags: props.tagListFilter.shareSelectTags || [],
      selectList: props.tagListFilter.selectList || []
    }
    this.delayTimer = null
  }
  componentDidMount() {
    // $(window.document.body).on("click.tags", (e) => {
    //     const $target = $(e.target);
    //     const $toClose = $target.closest("div#tagsContainer");

    //     if($toClose.length == 0) {
    //         this.setState({
    //           popupVisible: false,
    //           shareSelectTags: this.state.shareSelectTags.map(item => {
    //             item.visible = false;
    //             return item;
    //           })
    //         })
    //     }
    // })
  }
  componentWillUnmount() {
    //$(window.document.body).off("click.tags");
  }
  componentWillReceiveProps(nextProps, nextState) {
    //if (this.props.shareSelectTags !== nextProps.shareSelectTags) {
      this.setState({
        shareSelectTags: nextProps.tagListFilter.shareSelectTags,
        selectList: nextProps.tagListFilter.selectList
      })
    //}
  }

  select(dispatch, e) {
    e.stopPropagation();
    let select = JSON.parse(e.currentTarget.getAttribute('data-key'));
    dispatch({
      type: 'tagListFilter/changeTags',
      payload: select
    })
  }

  queryTagValues(key, message, callback) {
    const {dispatch} = this.props;
    dispatch({
      type: 'tagListFilter/queryTagValues',
      payload: {
        key: key,
        value: message || '',
        callback: callback || (() => {})
      }
    })
  }

  changefun(target) {
    this.props.dispatch({
      type: 'tagListFilter/addTag',
      payload: target
    })
  }

  removefun(e) {
    e.stopPropagation();
    let target = JSON.parse(e.currentTarget.getAttribute('data-id'));
    this.props.dispatch({
      type: 'tagListFilter/removeTag',
      payload: target
    })
  }
  loadMore(key, message) {
    this.props.dispatch({
      type: 'tagListFilter/loadMore',
      payload: {
        key: key,
        value: message
      }
    })
  }
  setPopupVisible(popupVisible) {
    this.clearDelayTimer();
    if (this.state.popupVisible !== popupVisible) {
      this.setState({
        popupVisible,
      });
    }
  }
  setKeys(popupVisible) {
    const { tagListFilter, dispatch } = this.props
    if (popupVisible && !tagListFilter.tagsKeyList.length) {
      dispatch({
        type: 'tagListFilter/openSelectModal',
        payload: this.setPopupVisible.bind(this, popupVisible)
      })
    } else {
      this.setPopupVisible(popupVisible)
    }
  }
  delay(callback, delayS) {
    const delay = delayS * 1000;
    this.clearDelayTimer();
    if (delay) {
      this.delayTimer = setTimeout(() => {
        callback();
        this.clearDelayTimer();
      }, delay);
    } else {
      callback();
    }
  }
  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }
  }

  render() {
      const {dispatch, tagListFilter} = this.props
      const { tagsKeyList } = tagListFilter;
      const { shareSelectTags, selectList } = this.state;

      const arrClass = classnames(
        'switchMenu',
        'iconfont',
        'icon-xialasanjiao'
      )
      const switchClass = classnames(
        'icon',
        'iconfont',
        'icon-guolv'
      )
      const wancheng = classnames(
        'icon',
        'iconfont',
        'icon-dui'
      )

      const tagsGroup = shareSelectTags.map( (item, index) => {
        return (
          <TagsGroup
            key={ item.key }
            haveTags={typeof item.values !== 'undefined' && item.values.length !== 0 ? true : false}
            className={classnames(tagsStyles.tagsGroupMain, styles.tagsGroup)}
            content={ item }
            changeHandler={this.changefun.bind(this)}
            removeHandler={this.removefun.bind(this)}
            queryTagValues={this.queryTagValues.bind(this, ...arguments)}
            selectList={selectList}
            loadMore={this.loadMore.bind(this)}
          />
        )
      })

      return (
          <div className={styles.tagsIframe} id='tagsContainer'>
              <div
                className={styles.selectBtn}
                onMouseEnter={ this.delay.bind(this, this.setKeys.bind(this, true), 0.2) }
                onMouseLeave={ this.delay.bind(this, this.setKeys.bind(this, false), 0.2) }
              >
                  <i className={classnames(switchClass, styles.hopper)}></i>
                  <div className={classnames(arrClass, styles.iconDiv)}></div>
                  <Animate
                      component='div'
                      transitionName="tags"
                      transitionEnterTimeout={300}
                      transitionLeaveTimeout={300}
                  >
                    {this.state.popupVisible &&
                        <ul className={styles.content}>
                          {
                            tagsKeyList.map( (item) => {
                              return <li
                                key={item.key + item.keyName}
                                data-key={JSON.stringify(item)}
                                onClick={this.select.bind(this, ...arguments, dispatch)}
                              >{item.keyName}{item.checked && <i className={wancheng}></i>}</li>
                            })
                          }
                        </ul>
                    }
                  </Animate>
              </div>
              {tagsGroup}
          </div>
      )
  }

}

export default connect((state) => {
  return {
    tagListFilter: state.tagListFilter
  }
})(alertTagsFilter)
