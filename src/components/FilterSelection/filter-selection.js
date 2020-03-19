import React from "react";
import { connect } from "react-redux";
import FilterSet from "./filter-set-view";
import { checkboxFilterChange } from "../../store/actions/actions";
import style from "./filter-selection.module.css";
import {
  fieldsIntToString,
  isTouchMode,
  topicToField
} from "../../util/utility";

const getFilterSets = state => {
  return [
    {
      name: "Forschungsgebiet",
      subsets: [
        {
          name: "Naturwissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) === "Naturwissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Lebenswissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) === "Lebenswissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Geistes- und Sozialwissenschaften",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
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
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val =>
              fieldsIntToString(topicToField(val)) === "Ingenieurwissenschaften"
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Sonstige",
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
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
          name: "Zielgruppen",
          filterId: "highlevelFilter",
          isTogglable: true,
          subFilters: state.main.targetgroups,
          subFilterId: "targetgroups"
        },
        // .map(tg => [
        //   tg,
        //   state.main.targetgroups.find(targetgroup => targetgroup.id === tg)
        // ])
        {
          name: "Formate",
          filterId: "highlevelFilter",
          subFilterId: "formats",
          isTogglable: true,
          subFilters: state.main.filters.formats.uniqueVals
        }
      ]
    },
    {
      name: "Infrastruktur",
      subsets: [
        {
          name: "Sammlungen",
          filterId: "highlevelFilter",
          subFilters: state.main.collections,
          subFilterId: "collections",
          isTogglable: true
        },
        {
          name: "Laborgeräte",
          filterId: "highlevelFilter",
          subFilters: state.main.infrastructures,
          subFilterId: "infrastructures",
          isTogglable: true
        }
      ]
    }
  ];
};

const getFilterSetsTouch = filters => {
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
          subFilters: []
        },
        {
          name: "Formate",
          filterId: "highlevelFilter",
          isTogglable: true,
          subFilters: []
        }
      ]
    },
    {
      name: "Infrastruktur",
      subsets: [
        {
          name: "Sammlungen",
          filterId: "highlevelFilter",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Laborgeräte",
          filterId: "highlevelFilter",
          isTogglable: true,
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
  const isTouch = isTouchMode(state);
  return {
    filterSets: isTouch
      ? getFilterSetsTouch(state.main.filters)
      : getFilterSets(state),
    filters: state.main.filters
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSelection);
