import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import classnames from 'classnames';
import { getUUID } from '../../utils'
import styles from './index.less'

let animateContainer = null
let instance = null

class Message extends Component {
  constructor(props) {
    super(props)
    this.closeTimer = null
    this.clearTimer = this.clearTimer.bind(this)
  }

  static propTypes = {
    delayS: React.PropTypes.number,
    onClose: React.PropTypes.func
  }
  static defaultProps = {
    delayS: 1, // s
    onClose: () => {}
  }

  componentDidMount() {
    if (this.props.delayS) {
      this.closeTimer = setTimeout(() => {
        this.clearTimer();
        this.props.onClose();
      }, this.props.delayS * 1000)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.key !== this.props.key && nextProps.delayS) {
      this.closeTimer = setTimeout(() => {
        this.clearTimer();
        nextProps.onClose();
      }, nextProps.delayS * 1000)
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
      this.closeTimer = null
    }
  }

  render() {
    const props = this.props
    return (
      <div className={styles.easeAnimate}>
        <svg viewBox="0 0 200 100" width='200' height="100">
          <text x='100' y='50'>{ props.content }</text>
        </svg>
      </div>
    )
  }
}

class AnimateRoot extends Component {

  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.state = {
      message: null
    }
  }

  update(content) {
    if (!React.isValidElement(this.state.message)) {
      this.setState({
        message: React.cloneElement(<Message />, {
          key: getUUID(8),
          onClose: this.remove.bind(this),
          content
        })
      })
    }
  }

  remove() {
    this.setState({
      message: null
    })
  }

  render() {
    const isReactElement = React.isValidElement(this.state.message)
    return (
        <Animate transitionName='msgEase'>
          {
            isReactElement ? this.state.message : null
          }
        </Animate>
    )
  }
}

function newInstance() {
  animateContainer = document.createElement('div')
  document.body.appendChild(animateContainer)
  const root = ReactDOM.render(<AnimateRoot />, animateContainer)
  return root
}

function destroy() {
  if (animateContainer) {
    ReactDOM.unmountComponentAtNode(animateContainer)
    document.body.removeChild(animateContainer)
  }
}
const api = {
  generate: (content) => {
    if (!instance) {
      instance = newInstance()
    }
    instance.update(content)
  },
  destroy
}

export default api