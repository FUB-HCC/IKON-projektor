import React, { Component } from "react";
import classes from "../redesigned.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/actions";
import Select from "react-select";
import InputRange from "react-input-range";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { min: 1995, max: 2017 },
      selectedOption: "strawberry"
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(selectedOption) {
    this.setState({ selectedOption });
  }

  render() {
    const { selectedOption } = this.state;
    const options = [
      { value: "chocolate", label: "Chocolate" },
      { value: "strawberry", label: "Strawberry" },
      { value: "vanilla", label: "Vanilla" }
    ];
    return (
      <React.Fragment>
        <div className={classes.footer}>
          <div className={classes.leftFooter}>
            <div className={classes.timeSlider}>
              <InputRange
                maxValue={2018}
                minValue={1994}
                value={this.state.value}
                onChange={value => this.setState({ value })}
              />
            </div>
          </div>

          <div className={classes.milldleLeft}>
            <div className={classes.filter}>
              <div className={classes.filterWrap}>
                <label className={classes.selectLabel}>VIEW</label>
                <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={options}
                />
              </div>
              <div className={classes.filterWrap}>
                <label className={classes.selectLabel}>VIEW</label>
                <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={options}
                />
              </div>
            </div>
          </div>

          <div className={classes.milldleRight}>
            <button className={classes.btnFooter}>SPEICHERN</button>
          </div>

          <div className={classes.rightFooter + " " + classes.dslfjdsl}>
            <button className={classes.btnFooter}>TEILEN</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(actions.changeGraph(value)),
    activatePopover: (value, vis) =>
      dispatch(actions.activatePopover(value, vis)),
    deactivatePopover: () => dispatch(actions.deactivatePopover())
  };
};
const mapStateToProps = state => {
  let selectedProject;
  state.main.projects.forEach(project => {
    if (project.id === state.main.selectedProject) selectedProject = project;
  });

  return {
    graph: state.main.graph,
    filterAmount: Object.keys(state.main.filters).length,
    selectedProject: state.main.selectedProject,
    selectedDataPoint: selectedProject,
    filter: state.main.filter,
    filteredData: state.main.filteredProjects
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
