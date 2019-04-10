import React, { Component } from 'react'
import { connect } from 'react-redux'
import CloseIcon from '../../assets/Exit.svg'
import assets from '../../assets'
import classes from '../../components/Visualizations/TimeLine/TimeLine.css'
import * as actions from '../../store/actions/actions'
import * as filteredData from '../../assets/publicData'

class PetriDishDetailModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      popoverHidden: true,
      projectdetails: {}
    }
    this.closeProjectsModal = this.closeProjectsModal.bind(this)
  }
  closeProjectsModal () {
    this.props.closeDetailModal()
  }
  componentWillMount () {
    const {projectId} = this.props
    let projects = filteredData.getProjectsData()
    let projectDetail = projects.find((element) => {
      if (element.id === projectId) {
        return element
      }
    })
    this.setState({ projectdetails: projectDetail })
  }

  render () {    
    let projectdetails = this.state.projectdetails
    let title = projectdetails.research_area
    title = (title ? title.replace(/ .*/, '') : 'Unbakent')
    let color = '#9c9bff'
    let icon = assets.clusterUnbekantSVG
    switch (title) {
      case 'Naturwissenschaften':
        color = '#f4a310'
        icon = assets.clusterNaturSVG
        break
      case 'Lebenswissenschaften':
        color = '#f12626'
        icon = assets.clusterLebenSVG
        break
      case 'Geistes-':
        color = '#7ad101'
        icon = assets.clusterGeistSVG
        break
      default:
        break
    }
    return (
      <div className={classes.projectModal}>
        <div className={classes.modalheader}>
          
        </div>
        <div className={classes.modalCloser}>
          <img src={CloseIcon} onClick={this.closeProjectsModal} />
        </div>
        <div className={classes.dt_modal_header}>
          <div className={classes.left_icon}>
            <img src={icon} alt="logo" />
          </div>
          <div className={classes.right_text}>
            <p>forschungsprojekt_</p>
            <p style={{ color: color }}>{(projectdetails.research_area) ? projectdetails.research_area.replace(/ .*/, '') : 'N/A'}</p>
          </div>
        </div>
        <div className={classes.modal_des_wrap}>
          <div className={classes.dt_modal_title}>
            <p >{(projectdetails.title) ? projectdetails.title.substr(0, 50) : 'N/A'}</p>
          </div>
          <div className={classes.dt_modal_des}>
            <p>{(projectdetails.abstract) ? projectdetails.abstract.substr(0, 120) : 'N/A'}</p>
          </div>
          <div className={classes.dt_modal_info_full}>
            <p className={classes.info_label}>hauptthema</p>
            <p className={classes.info_des}>{(projectdetails.review_board) ? projectdetails.review_board : 'N/A'}</p>
          </div>
          <div className={classes.dt_modal_info_split}>
            <div className={classes.info_split}>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>projektleiter</p>
                <p className={classes.info_des}>{(projectdetails.project_leader) ? projectdetails.project_leader : 'N/A'}</p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>Start</p>
                <p className={classes.info_des}>{(projectdetails.start_date) ? projectdetails.start_date : 'N/A'}</p>
              </div>
            </div>
            <div className={classes.info_split}>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>antragsteller</p>
                <p className={classes.info_des}>{(projectdetails.applicant) ? projectdetails.applicant : 'N/A'}</p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>Ende</p>
                <p className={classes.info_des}>{(projectdetails.end_date) ? projectdetails.end_date : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className={classes.dt_modal_text_area}>
            <textarea disabled></textarea>
          </div>
          <div className={classes.dt_modal_info_split}>
            <div className={classes.info_split}>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>GELDGEBER</p>
                <p className={classes.info_des}>{(projectdetails.sponsor) ? projectdetails.sponsor : 'N/A'}</p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>nebenthenem</p>
                <p className={classes.info_des}>{(projectdetails.side_topics[0] !== null) ? projectdetails.side_topics : 'N/A'}</p>
              </div>
            </div>
            <div className={classes.info_split}>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>kooperationspartner</p>
                <p className={classes.info_des}>{(projectdetails.cooperating_institutions[0] !== null) ? projectdetails.cooperating_institutions : 'N/A'}</p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>links</p>
                <p className={classes.info_des}><a href={(projectdetails.href) ? projectdetails.href : 'N/A'}>GO</a></p>
              </div>

            </div>
          </div>
        </div>

      </div>
    )
  }
}
const mapStateToProps = state => {
  let selectedProject
  state.main.data.forEach(project => {
    if (project.id === state.main.selectedProject) selectedProject = project
  })

  return {
    graph: state.main.graph,
    filterAmount: state.main.filter.length,
    selectedProject: state.main.selectedProject,
    selectedDataPoint: selectedProject,
    filter: state.main.filter,
    filteredData: state.main.filteredData
  }
}
const mapDispatchToProps = dispatch => {
  return {
    changeGraph: (value) => dispatch(actions.changeGraph(value)),
    activatePopover: (value, vis) => dispatch(actions.activatePopover(value, vis)),
    deactivatePopover: () => dispatch(actions.deactivatePopover())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PetriDishDetailModal)
