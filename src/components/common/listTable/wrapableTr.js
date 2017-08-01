import React, { Component, PropTypes } from 'react'
import { classnames } from '../../../utils'
import styles from './index.less'
import $ from 'jquery'

class WrapableTr extends Component {
  constructor(props) {
    super(props);
    this.state = { wrapped: this.props.wrapped || true };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.wrapped != this.state.wrapped) {
      return true;
    }
    if(nextProps.trId != this.props.trId) {
      return true;
    }

    if(nextProps.columnsLength != this.props.columnsLength) {
      return true;
    }

    if(nextProps.checked != this.props.checked) {
      return true;
    }

    if(nextProps.className != this.props.className) {
      return true;
    }

    const { contentData: oldContentData={} } = this.props;
    const { contentData: newContentData={} } = nextProps;

    let isNeedUpdate = false;
    Object.keys(newContentData).forEach((key) => {
      if(oldContentData[key] != newContentData[key]) {
        isNeedUpdate = true;
      }
    })

    return isNeedUpdate;
  }
  componentDidUpdate() {
    const { trId } = this.props;
    if(trId) {
      $("tr[data-link-tr-id='" + trId + "']").css('height', this.refs.tr.clientHeight);
      this.refs.tr.removeAttribute("style")
    }
  }
  _toggleWrap(e) {
    const target = e.target;
    const noNeedWrap = target.getAttribute("data-no-need-wrap");
    if(!noNeedWrap) {
      this.setState({ wrapped: !this.state.wrapped });
    }
  }
  render() {
    const { children, className, contentData, trId, isSuppressed=false, columnsLength, ...restProps } = this.props;
    const { wrapped } = this.state;
    return (
      <tr ref="tr" {...restProps} data-link-tr-id={trId} onClick={(e) => { this._toggleWrap(e) }} className={ classnames(className, wrapped?styles.showSome:styles.showAll, isSuppressed?styles.suppressed:'') }>
        { children }
      </tr>
    )
  }
}

export default WrapableTr;