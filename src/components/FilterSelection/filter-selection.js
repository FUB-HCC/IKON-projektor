import React from "react";
import { connect } from "react-redux";
import FilterSet from "./filter-set-view";
import { checkboxFilterChange } from "../../store/actions/actions";
import style from "./filter-selection.module.css";
import { fieldsIntToString, topicToField } from "../../util/utility";

const getFilterSets = filters => {
  return [
    {
      name: "Forschungsgebiet",
      subsets: [
        {
          name: "Naturwissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Lebenswissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Geistes- und Sozialwissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Ingenieurwissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Sonstige",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        }
      ]
    },
    {
      name: "Wissenstransfer",
      subsets: [
        {
          name: "Zielgruppe",
          isTogglable: false,
          subFilters: []
        },
        {
          name: "Format",
          isTogglable: false,
          subFilters: []
        }
      ]
    },
    {
      name: "Infrastruktur",
      subsets: [
        {
          name: "Sammlungen",
          isTogglable: false,
          subFilters: []
        },
        {
          name: "Laborgeräte",
          isTogglable: false,
          subFilters: []
        }
      ]
    }
  ];
};

const FilterSelection = props => (
  <div className={style.filterSelectionWrapper}>
    {props.filterSets.map(filterSet => (
      <FilterSet
        filters={props.filters}
        set={filterSet}
        changeFilter={props.filterChangeHandler}
        key={filterSet.name}
      />
    ))}
  </div>
);

const mapDispatchToProps = dispatch => {
  return {
    filterChangeHandler: (filterId, value, form) =>
      dispatch(checkboxFilterChange(filterId, value, form))
  };
};

const mapStateToProps = state => {
  return {
    filterSets: getFilterSets(state.main.filters),
    filters: state.main.filters
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSelection);
