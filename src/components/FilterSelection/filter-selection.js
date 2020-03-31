import React from "react";
import { connect } from "react-redux";
import FilterSet from "./filter-set-view";
import { checkboxFilterChange } from "../../store/actions/actions";
import style from "./filter-selection.module.css";
import { isTouchMode, topicToField } from "../../util/utility";

const getFilterSets = state => {
  return [
    {
      name: "Forschungsgebiet",
      subsets: [
        {
          name: "Naturwissenschaften",
          nameId: 1,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val => topicToField(val) === 1
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Lebenswissenschaften",
          nameId: 2,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val => topicToField(val) === 2
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Geistes- und Sozialwissenschaften",
          nameId: 3,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val => topicToField(val) === 3
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Ingenieurwissenschaften",
          nameId: 4,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val => topicToField(val) === 4
          ),
          subFilterId: "hauptthema"
        },
        {
          name: "Sonstige",
          nameId: 5,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: state.main.filters.hauptthema.uniqueVals.filter(
            val => topicToField(val) === 5
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
          nameId: 6,
          filterId: "highlevelFilter",
          isTogglable: true,
          subFilters: state.main.targetgroups,
          subFilterId: "targetgroups"
        },
        {
          name: "Formate",
          nameId: 7,
          filterId: "highlevelFilter",
          subFilterId: "formats",
          isTogglable: true,
          subFilters: state.main.formats
        }
      ]
    },
    {
      name: "Infrastruktur",
      subsets: [
        {
          name: "Sammlungen",
          nameId: 8,
          filterId: "highlevelFilter",
          subFilters: state.main.collections,
          subFilterId: "collections",
          isTogglable: true
        },
        {
          name: "Laborgeräte",
          nameId: 9,
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
          nameId: 1,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Lebenswissenschaften",
          nameId: 2,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Geistes- und Sozialwissenschaften",
          nameId: 3,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Ingenieurwissenschaften",
          nameId: 4,
          filterId: "forschungsgebiet",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Sonstige",
          nameId: 5,
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
          nameId: 6,
          filterId: "highlevelFilter",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Formate",
          nameId: 7,
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
          nameId: 8,
          filterId: "highlevelFilter",
          isTogglable: true,
          subFilters: []
        },
        {
          name: "Laborgeräte",
          nameId: 9,
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
