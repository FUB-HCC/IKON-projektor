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
          subFilters: filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) === "Naturwissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Lebenswissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) === "Lebenswissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Geistes- und Sozialwissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) ===
              "Geistes- und Sozialwissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Ingenieurwissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) === "Ingenieurwissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Sonstige",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: filters.hauptthema.uniqueVals.filter(
            val => fieldsIntToString(topicToField(val)) === "Sonstige"
          ),
          subFilterId: "hauptthema"
        }
      ]
    },
    {
      name: "Wissenstransfer",
      subsets: [
        {
          name: "Zielgruppe",
          filterId: null,
          isTogglable: false,
          subFilters: [],
          subFilterId: null
        },
        {
          name: "Format",
          filterId: null,
          isTogglable: false,
          subFilters: [],
          subFilterId: null
        }
      ]
    },
    {
      name: "Infrastruktur",
      subsets: [
        {
          name: "Sammlungen",
          subFilters: filters.collections.uniqueVals,
          subFilterId: "collections",
          isTogglable: false
        },
        {
          name: "Laborgeräte",
          subFilters: filters.infrastructure.uniqueVals,
          subFilterId: "infrastructure",
          isTogglable: false
        }
      ]
    }
    //,
    // {
    //   name: "Geldgeber",
    //   subsets: []
    // }
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
