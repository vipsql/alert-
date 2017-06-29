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
      mouseEnter: false,
      shareSelectTags: props.tagListFilter.shareSelectTags || [],
      selectList: props.tagListFilter.selectList || []
    }
  }
  componentDidMount() {
    $(window.document.body).on("click.tags", (e) => {
        const $target = $(e.target);
        const $toClose = $target.closest("div#tagsContainer");

        if($toClose.length == 0) {
            this.setState({
              mouseEnter: false,
              shareSelectTags: this.state.shareSelectTags.map(item => {
                item.visible = false;
                return item;
              })
            })
        }
    })
  }
  componentWillUnmount() {
    $(window.document.body).off("click.tags");
  }
  componentWillReceiveProps(nextProps, nextState) {
    //if (this.props.shareSelectTags !== nextProps.shareSelectTags) {
      this.setState({
        shareSelectTags: nextProps.tagListFilter.shareSelectTags,
        selectList: nextProps.tagListFilter.selectList
      })
    //}
  }

  display(state) {
    this.setState({
      mouseEnter: state,
      shareSelectTags: this.state.shareSelectTags.map( item => {
        item.visible = false;
        return item;
      })
    })
  }

  queryKey(dispatch) {
    if (this.state.mouseEnter) {
      this.display(!this.state.mouseEnter)
    } else {
      dispatch({
        type: 'tagListFilter/openSelectModal',
        payload: this.display.bind(this, !this.state.mouseEnter)
      })
    }
  }

  select(dispatch, e) {
    e.stopPropagation();
    let select = JSON.parse(e.currentTarget.getAttribute('data-key'));
    dispatch({
      type: 'tagListFilter/changeTags',
      payload: select
    })
  }

  setVisible(target) {
    let arrList = _.cloneDeep(this.state.shareSelectTags)
    if (arrList && arrList.length > 0) {
      arrList.forEach( (item) => {
        item.visible = false
        if (item.key === target.key) {
          item.visible = !target.visible
        }
      })
    }
    this.setState({
      shareSelectTags: arrList,
      mouseEnter: false,
      selectList: []
    })
  }

  queryTagValues(key, message) {
    const {dispatch} = this.props;
    dispatch({
      type: 'tagListFilter/queryTagValues',
      payload: {
        key: key,
        value: message
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
            setVisible={this.setVisible.bind(this, ...arguments)}
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
              <div className={styles.selectBtn} onClick={this.queryKey.bind(this, dispatch)}>
                  <i className={classnames(switchClass, styles.hopper)}></i>
                  <div className={classnames(arrClass, styles.iconDiv)}></div>
                  <Animate
                      transitionName="tags"
                      transitionEnterTimeout={300}
                      transitionLeaveTimeout={300}
                  >
                    {this.state.mouseEnter &&
                        <ul className={styles.content}>
                          {
                            tagsKeyList.map( (item) => {
                              return <li
                                key={item.key}
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
