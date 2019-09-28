import React from "react";
import { connect } from "react-redux";
import FilterSet from "./filter-set-view";
import { filterChange } from "../../store/actions/actions";
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
          name: "Ingenieurswissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) ===
              "Ingenieurswissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Unbekannt",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: filters.hauptthema.uniqueVals.filter(
            val => fieldsIntToString(topicToField(val)) === "Unbekannt"
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
          filterId: null,
          isTogglable: false,
          subFilters: [],
          subFilterId: null
        },
        {
          name: "Labore u. Großgeräte",
          filterId: null,
          isTogglable: false,
          subFilters: [],
          subFilterId: null
        }
      ]
    },
    {
      name: "Geldgeber",
      subsets: []
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
      dispatch(filterChange(filterId, value, form))
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
