import React, { Component } from "react";
import classes from "./sidebar.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/actions";
import SidebarFilterElements from "./sidebar-filter-elements";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    const expFilters = new Array(Object.keys(this.props.filters).length);
    expFilters.fill(true);
    this.state = {
      expandedFilters: expFilters,
      value: "",
      filters: this.getNewFilters(props.filters)
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getNewFilters(filters) {
    return [
      {
        name: filters.forschungsgebiet.name,
        filterKey: filters.forschungsgebiet.filterKey,
        type: filters.forschungsgebiet.type,
        subGroup: [
          {
            name: filters.forschungsgebiet.uniqueVals[0],
            values: filters.hauptthema.uniqueVals.slice(0, 4)
          },
          {
            name: filters.forschungsgebiet.uniqueVals[1],
            values: filters.hauptthema.uniqueVals.slice(4, 7)
          },
          {
            name: filters.forschungsgebiet.uniqueVals[2],
            values: filters.hauptthema.uniqueVals.slice(7, 9)
          },
          {
            name: filters.forschungsgebiet.uniqueVals[3],
            values: filters.hauptthema.uniqueVals.slice(9, 10)
          }
        ]
      },
      {
        name: filters.geldgeber.name,
        filterKey: filters.geldgeber.filterKey,
        type: filters.geldgeber.type,
        values: filters.geldgeber.uniqueVals
      }
    ];
  }

  handleInputChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    const filterElements = (
      <SidebarFilterElements
        filters={this.state.filters}
        change={this.props.filterChangeHandler}
      />
    );
    return (
      <div className={classes.FilterModal}>
        <div className={classes.CheckBoxes}>{filterElements}</div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    filterChangeHandler: (filterId, value, form) =>
      dispatch(actions.filterChange(filterId, value, form)),
    toggleAllFilters: (key, filters) =>
      dispatch(actions.toggleAllFilters(key, filters))
  };
};

const mapStateToProps = state => {
  return {
    filters: state.main.filters
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
