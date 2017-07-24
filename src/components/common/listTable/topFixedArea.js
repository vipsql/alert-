import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import styles from './index.less'
import { classnames } from '../../../utils'
import ScrollBar from './scrollBar';
import Theads from './theads'


class TopFixedArea extends Component {
  constructor(props) {
    super(props);
    this.state = { isShow: false, scrollLeft: 0 };
  }

  componentDidMount() {
    const { target, parentTarget, topHeight, onShow, onHide } = this.props;
    $(target).scroll((e) => {
      if (!this.unmount) {
        const $target = $(e.target);
        if ($target.scrollTop() > this.props.topHeight) {
          this.setState({ isShow: true });
          onShow && onShow();
        } else {
          this.setState({ isShow: false });
          onHide && onHide();
        }
      }
    })

    $(parentTarget).scroll((e) => {
      const $target = $(e.target);
      if(!this.unmount) {
        this.setState({ ...(this.state), scrollLeft: $target.scrollLeft()});
      }
    })
  }

  componentWillUnmount() {
    this.unmount = true;
    $(this.props.target).unbind("scroll");
    $(this.props.parentTarget).unbind("scroll");
  }

  render() {
    const { theads, extraArea, topHeight, parentTarget, isShowScrollBar } = this.props;
    const { isShow, scrollLeft } = this.state;
    return (
      <div className={classnames(styles.topFixedArea, isShow ? styles.showTopFixed : '')} style={{ top: $(this.props.target).scrollTop() - topHeight || 0 }}>
        <div className={ styles.extraArea } style={{ left: scrollLeft, minHeight: extraArea?'0px':'60px' }}>
          {extraArea}
        </div>
        <table className={classnames(styles.listTable, styles.topFixed)}>
          { theads }
        </table>
        <div className={ styles.fixScrollBar } style={{ left: scrollLeft }}>
          {
            isShowScrollBar?
            <ScrollBar horizonTarget="div.listContainer" />
            :
            ''
          }
        </div>
      </div>
    )
  }
}

TopFixedArea.defaultProps = {
  target: 'div#topMain',
  topHeight: 397,
  isShowScrollBar: true
}

TopFixedArea.propTypes = {
  extraArea: PropTypes.node,
  target: PropTypes.string,
  parentTarget: PropTypes.string, // 父级容器，需要监听它的左右滚动
  topHeight: PropTypes.number
}

export default TopFixedArea;