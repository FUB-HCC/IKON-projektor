import React, { Component } from "react";
import { connect } from "react-redux";
import CloseIcon from "../../assets/Exit.svg";
import classes from "../TimeLine/time-line-view.module.css";
import * as actions from "../../store/actions/actions";
import icon from "../../assets/geistes_icon.png";

class DetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverHidden: true,
      projectdetails: {},
      allProjects: [],
      index: 0
    };
    this.closeProjectsModal = this.closeProjectsModal.bind(this);
    this.projectControl = this.projectControl.bind(this);
  }
  projectControl(control) {
    let projectdetails = this.state.projectdetails;
    let allProjects = this.state.allProjects;
    let index = this.state.index;
    let counter = this.props.counter - 1;
    if (control === "left") {
      if (index !== 0) {
        index = index - 1;
        projectdetails = allProjects[index];
      }
    }
    if (control === "right") {
      if (index + 1 <= counter) {
        index = index + 1;
        projectdetails = allProjects[index];
      }
    }
    this.setState({ projectdetails, index });
  }
  closeProjectsModal() {
    this.props.closeDetailModal();
  }
  componentWillMount() {
    let index = this.props.index - 1;
    this.setState({
      projectdetails: this.props.project.project,
      allProjects: this.props.projects,
      index: index
    });
  }

  render() {
    let projectdetails = this.state.projectdetails;

    const allProjects = this.state.allProjects;
    let totalSize = allProjects.length;
    let title = this.props.headline;
    let counter = this.props.counter;
    let year = this.props.year;
    let index = this.state.index + 1;
    title = title ? title.replace(/ .*/, "") : "Unbakent";
    let color = "#7675B2";
    switch (title) {
      case "Naturwissenschaften":
        color = "#A4782E";
        break;
      case "Lebenswissenschaften":
        color = "#994A49";
        break;
      case "Geistes-":
        color = "#435B22";
        break;
      default:
        break;
    }
    return (
      <div className={classes.projectModal}>
        <div className={classes.modalheader}>
          <p onClick={this.props.zurukhBtnAction} className={classes.zurukhBtn}>
            {" "}
            <span>&#x3c;</span> zurück
          </p>
          <p style={{ color: color }}>{title}</p>
          <p style={{ color: "#fff" }}>
            {" "}
            {counter} Projekte in {year}
          </p>
          <p className={classes.controlBoard}>
            {" "}
            <span
              onClick={evt => this.projectControl("left")}
              className={classes.control + " " + classes.left}
            >
              {" "}
              ^{" "}
            </span>{" "}
            {index} of {totalSize}
            <span
              onClick={evt => this.projectControl("right")}
              className={classes.control + " " + classes.right}
            >
              {" "}
              ^{" "}
            </span>
          </p>
        </div>
        <div className={classes.modalCloser}>
          <img
            src={CloseIcon}
            onClick={this.closeProjectsModal}
            alt={"Here should a cross symbol to close the modal"}
          />
        </div>
        <div className={classes.dt_modal_header}>
          <div className={classes.left_icon}>
            <img src={icon} alt="logo" />
          </div>
          <div className={classes.right_text}>
            <p>forschungsprojekt_</p>
            <p style={{ color: color }}>
              {projectdetails.research_area
                ? projectdetails.research_area.replace(/ .*/, "")
                : "N/A"}
            </p>
          </div>
        </div>
        <div className={classes.modal_des_wrap}>
          <div className={classes.dt_modal_title}>
            <p>
              {projectdetails.title
                ? projectdetails.title.substr(0, 50)
                : "N/A"}
            </p>
          </div>
          <div className={classes.dt_modal_des}>
            <p>
              {projectdetails.abstract
                ? projectdetails.abstract.substr(0, 120)
                : "N/A"}
            </p>
          </div>
          <div className={classes.dt_modal_info}>
            <p className={classes.info_label}>hauptthema</p>
            <p className={classes.info_des}>
              {projectdetails.review_board
                ? projectdetails.review_board
                : "N/A"}
            </p>
          </div>
          <div className={classes.dt_modal_info_split}>
            <div className={classes.info_split}>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>projektleiter</p>
                <p className={classes.info_des}>
                  {projectdetails.project_leader
                    ? projectdetails.project_leader
                    : "N/A"}
                </p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>Start</p>
                <p className={classes.info_des}>
                  {projectdetails.start_date
                    ? projectdetails.start_date
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className={classes.info_split}>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>antragsteller</p>
                <p className={classes.info_des}>
                  {projectdetails.applicant ? projectdetails.applicant : "N/A"}
                </p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>Ende</p>
                <p className={classes.info_des}>
                  {projectdetails.end_date ? projectdetails.end_date : "N/A"}
                </p>
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
                <p className={classes.info_des}>
                  {projectdetails.sponsor ? projectdetails.sponsor : "N/A"}
                </p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>nebenthenem</p>
                <p className={classes.info_des}>
                  {projectdetails.side_topics[0] !== null
                    ? projectdetails.side_topics
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className={classes.info_split}>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>kooperationspartner</p>
                <p className={classes.info_des}>
                  {projectdetails.cooperating_institutions[0] !== null
                    ? projectdetails.cooperating_institutions
                    : "N/A"}
                </p>
              </div>
              <div className={classes.dt_modal_info}>
                <p className={classes.info_label}>links</p>
                <p className={classes.info_des}>
                  <a href={projectdetails.href ? projectdetails.href : "N/A"}>
                    GO
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  let selectedProject;
  state.main.data.forEach(project => {
    if (project.id === state.main.selectedProject) selectedProject = project;
  });

  return {
    graph: state.main.graph,
    filterAmount: state.main.filter.length,
    selectedProject: state.main.selectedProject,
    selectedDataPoint: selectedProject,
    filter: state.main.filter,
    filteredData: state.main.filteredData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(actions.changeGraph(value)),
    activatePopover: (value, vis) =>
      dispatch(actions.activatePopover(value, vis)),
    deactivatePopover: () => dispatch(actions.deactivatePopover())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailModal);
