import React from "react";
import style from "./sidebar.module.css";
import { getFieldColor } from "../../util/utility";

const FilterSet = props => {
  return (
    <div className={style.filterSetWrapper}>
      <div className={style.filterSetTitle}>
        <span className={style.titleText}>{props.set.name}</span>
      </div>
      {props.set.subsets.map(subset => (
        <div
          className={style.subsetWrapper}
          style={{ color: getFieldColor(subset.name) }}
          key={subset.name}
        >
          <div className={style.subsetHeader}>
            <CheckBox
              name={subset.name}
              id={subset.filterId}
              checked={
                !props.filters[subset.filterId]
                  ? false
                  : props.filters[subset.filterId].value.includes(subset.name)
              }
              onChange={props.changeFilter}
              showCheckbox={subset.isTogglable}
              color={getFieldColor(subset.name)}
            />
          </div>
          {subset.subFilters.map(filter => (
            <div className={style.subFilter}>
              <CheckBox
                name={filter}
                id={subset.subFilterId}
                checked={props.filters[subset.subFilterId].value.includes(
                  filter
                )}
                onChange={props.changeFilter}
                showCheckbox={true}
                color={getFieldColor(subset.name)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FilterSet;

const CheckBox = props => (
  <div className={style.checkBoxWrapper}>
    <span>{props.name}</span>
    <input
      checked={props.checked}
      className={style.checkBox}
      type="checkbox"
      id={props.name}
      onChange={() => props.onChange(props.id, props.name)}
    />
    {props.showCheckbox && (
      <label
        className={style.checkBoxLabel}
        htmlFor={props.name}
        style={{
          border: props.color + " 2px solid",
          backgroundColor: props.checked ? props.color : "rgba(0,0,0,0)"
        }}
      />
    )}
  </div>
);
