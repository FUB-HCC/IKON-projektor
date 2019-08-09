import React from "react";
import { connect } from "react-redux";
import PetriDishView from "./petri-dish-view";
import * as actions from "../../store/actions/actions";

class PetriDish extends React.Component {
  componentDidMount() {
    this.Graph.updateData(this.props.data, this.props.width, this.props.height);
  }

  componentDidUpdate() {
    this.Graph.updateData(this.props.data, this.props.width, this.props.height);
  }

  render() {
    return (
      <PetriDishView
        ref={node => {
          this.Graph = node;
        }}
        onProjectClick={this.props.onProjectClick}
        width={this.props.width}
        height={this.props.height}
        margin={20}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.main.filteredData,
  target: "graph"
});

const mapDispatchToProps = dispatch => {
  return {
    activatePopover: value => dispatch(actions.activatePopover(value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetriDish);
