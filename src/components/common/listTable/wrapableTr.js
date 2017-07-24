import React, { Component, PropTypes } from 'react'
import { classnames } from '../../../utils'
import styles from './index.less'
import $ from 'jquery'

class WrapableTr extends Component {
  constructor(props) {
    super(props);
    this.state = { wrapped: this.props.wrapped || true };
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
    const { children, className, trId, ...restProps } = this.props;
    const { wrapped } = this.state;
    return (
      <tr ref="tr" {...restProps} data-link-tr-id={trId} onClick={(e) => { this._toggleWrap(e) }} className={ classnames(className, wrapped?styles.showSome:styles.showAll) }>
        { children }
      </tr>
    )
  }
}

export default WrapableTr;