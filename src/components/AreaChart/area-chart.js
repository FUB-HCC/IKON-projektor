import React from "react";
import { connect } from "react-redux";
import AreaChartView from "./area-chart-view";
import * as actions from "../../store/actions/actions";

class AreaChart extends React.Component {
  componentDidMount() {
    // initialize Class here
    // you can get current height with 'props.height' and width with 'props.width'
    // you can get all props defined below[in mapStateToProps] with 'this.props.<name>'
    // if you need any more you can define them there (and you can take anything from the statevas a prop
    this.Graph.updateData(
      this.props.projects,
      this.props.institutions,
      this.props.width,
      this.props.height
    );
  }

  componentDidUpdate() {
    // update data or size here
    // you can get current height with 'props.height' and width with 'props.width'
    this.Graph.updateData(
      this.props.projects,
      this.props.institutions,
      this.props.width,
      this.props.height
    );
  }

  render() {
    return (
      <AreaChartView
        ref={node => {
          this.Graph = node;
        }}
        width={this.props.width}
        height={this.props.height}
        onProjectClick={this.props.onProjectClick}
      />
    );
  }
}

const mapStateToProps = state => ({
  projects: state.main.filteredProjects, // zu visualisierende Daten (immer up-to-date)
  institutions: state.main.institutions,
  target: "graph" // id of the target svg tag
  // this is also a good place to prepare the data since the data given to the visualization is then minimal
});

const mapDispatchToProps = dispatch => {
  return {
    // function-prop to activate popover - ask for details on how to use, can be given to the class with 'this.props.activatePopover'. Defined in actions and reducer.
    activatePopover: value => dispatch(actions.activatePopover(value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AreaChart);
