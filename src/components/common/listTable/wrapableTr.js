import React, { Component, PropTypes } from 'react'
import { classnames } from '../../../utils'
import styles from './index.less'

class WrapableTr extends Component {
  constructor(props) {
    super(props);
    this.state = { wrapped: this.props.wrapped || true };
  }
  _toggleWrap() {
    this.setState({ wrapped: !this.state.wrapped });
  }
  render() {
    const { children, className, ...restProps } = this.props;
    const { wrapped } = this.state;
    return (
      <tr {...restProps} onClick={() => { this._toggleWrap() }} className={ classnames(className, wrapped?styles.showSome:styles.showAll) }>
        { children }
      </tr>
    )
  }
}

export default WrapableTr;