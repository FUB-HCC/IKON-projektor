import React, {Component} from 'react'
import CloseIcon from '../../assets/Exit.svg'
import classes from '../../components/Visualizations/TimeLine/TimeLine.css'

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
    let title = this.props.headline
    let counter = this.props.counter
    let year = this.props.year
    title = (title ? title.replace(/ .*/, '') : 'Unbakent')
    let color = '#9c9bff'
    switch (title) {
      case 'Naturwissenschaften':
        color = '#f4a310'
        break
      case 'Lebenswissenschaften':
        color = '#f12626'
        break
      case 'Geistes-':
        color = '#7ad101'
        break    
      default:
        break
    }
    return this.state.popoverHidden && <div className={classes.projectModal} style={{
      // width: this.props.width,
      // height: this.props.height,
      // backgroundColor: 'rgba(67,64,88, 0.8)',
      // position: 'absolute',
      // display: 'flex',
      // flexWrap: 'wrap',
      // zIndex: 99,
      // top: 0,
      // left: 0,
      // bottom: 0,
      // right: 0,
      // margin: 'auto'
    }}>
      <div className={classes.projectListModalheader}>
        <p style={{ color: '#50e3c2' }}> {counter} Projekts in {year}</p>
        <p style={{ color: color }}>{title}</p>
      </div>
      <div className={classes.modalCloser}>
        <img src={CloseIcon} onClick={this.closeProjectsModal}/>
      </div>
      {this.props.children}
    </div>
  }
}

export default Modal
