import React, { Component, PropTypes } from 'react'
import { classnames } from '../../../utils'
import styles from './index.less'

class WrapableTr extends Component {
  constructor(props) {
    super(props);
    this.state = { wrapped: this.props.wrapped || true };
  }
  _toggleWrap(e) {
    const target = e.target;
    const noNeedWrap = target.getAttribute("data-no-need-wrap");
    if(!noNeedWrap) {
      this.setState({ wrapped: !this.state.wrapped });
    }
  }
  render() {
    const { children, className, ...restProps } = this.props;
    const { wrapped } = this.state;
    return (
      <tr {...restProps} onClick={(e) => { this._toggleWrap(e) }} className={ classnames(className, wrapped?styles.showSome:styles.showAll) }>
        { children }
      </tr>
    )
  }
}

export default WrapableTr;