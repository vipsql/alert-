import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import styles from './index.less'

function switchVideoSouce(type = '3') {
    let _source = 'Recovery.wav';
    switch (type) {
      case '3':
        _source = 'Critical.wav';
        break;
      case '2':
        _source = 'Warning.wav';
        break;
      case '1':
        _source = 'Information.wav';
        break;
      case '0':
        _source = 'Recovery.wav';
        break;
      default:
        break;
    }
    return _source;
}

export default class Notice extends Component {
  constructor(props) {
    super(props)
    this.closeTimer = null // duration timeOut
    this.close = this.close.bind(this)
    this.clearCloseTimer = this.clearCloseTimer.bind(this)
    this.switchVideoSouce = switchVideoSouce.bind(this)
  }

  static propTypes = {
    duration: React.PropTypes.number,
    audioCount: React.PropTypes.number,
    onClose: React.PropTypes.func,
    children: React.PropTypes.any
  }
  static defaultProps = {
    onClose: () => {},
    audioCount: 0, // when audio player one time
    duration: 0 // when audio player loop duration time
  }

  clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
      this.closeTimer = null;
    } 
  }

  close() {
    this.clearCloseTimer();
    this.props.onClose();
  }

  componentDidMount() {
    if (this.props.duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  }

  componentWillUnmount() {
    this.clearCloseTimer();
  }

  render() {
    const props = this.props;
    return (
      <div>
        <div className={styles.content}>
          <div></div>
          {React.cloneElement(<audio />, {
            src: this.switchVideoSouce(props.voiceType),
            loop: props.duration || false,
            autoPlay: true
          })}
        </div>
      </div>
    )
  }
}