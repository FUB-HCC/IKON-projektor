import React, {Component} from 'react'
import CloseIcon from '../../assets/Exit.svg'

class Modal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      popoverHidden: true

    }
    this.closeProjectsModal = this.closeProjectsModal.bind(this)
  }

  closeProjectsModal (evt) {
    evt.persist()
    const { onCloseClick } = this.props

    this.setState(
      {
        popoverHidden: true
      },
      () => onCloseClick && onCloseClick(evt)
    )
  }

  render () {
    return this.state.popoverHidden && <div style={{
      width: this.props.width,
      height: this.props.height,
      backgroundColor: 'rgba(67,64,88, 0.8)',
      position: 'absolute',
      display: 'flex',
      flexWrap: 'wrap',
      zIndex: 99,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      margin: 'auto'
    }}>
      <h2 style={{ marginLeft: '1vw',
        marginTop: '1vw',
        color: '#e9e9e9'}}>{this.props.headline}</h2>
      <div
        style={{
          height: 0.8 * this.props.height / 12,
          width: 0.8 * this.props.height / 12,
          position: 'absolute',
          right: '5px',
          cursor: 'pointer'
        }}><img
          src={CloseIcon} onClick={this.closeProjectsModal}/></div>
      {this.props.children}

    </div>
  }
}

export default Modal
