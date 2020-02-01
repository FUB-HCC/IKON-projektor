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
          name: "Zielgruppen",
          filterId: "highlevelFilter",
          isTogglable: true,
          subFilters: filters.targetgroups.uniqueVals,
          subFilterId: "targetgroups"
        },
        {
          name: "Formate",
          filterId: "highlevelFilter",
          subFilterId: "formats",
          isTogglable: true,
          subFilters: filters.formats.uniqueVals
        }
      ]
    },
    {
      name: "Infrastruktur",
      subsets: [
        {
          name: "Sammlungen",
          filterId: "highlevelFilter",
          subFilters: filters.collections.uniqueVals,
          subFilterId: "collections",
          isTogglable: true
        },
        {
          name: "Laborgeräte",
          filterId: "highlevelFilter",
          subFilters: filters.infrastructures.uniqueVals,
          subFilterId: "infrastructures",
          isTogglable: true
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
