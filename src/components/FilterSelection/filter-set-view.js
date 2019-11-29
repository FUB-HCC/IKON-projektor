import React, { Component } from "react";
import style from "./filter-selection.module.css";
import { getFieldColor,getFieldIcon } from "../../util/utility";


//const FilterSet = props => {
class FilterSet extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      toggleState: []
    };
    this.toggledFilterList = this.toggledFilterList.bind(this);
  }
  render() {
  return (
    <div className={style.filterSetWrapper}>
      <div className={style.filterSetTitle}>
        <span className={style.titleText}>{this.props.set.name}</span>
      </div>
      {this.props.set.subsets.map(subset => (
        <div
          className={style.subsetWrapper}
          style={{ color: getFieldColor(subset.name) }}
          key={subset.name}
        >
          <div className={style.subsetHeader}>
            <CheckBox
              name={subset.name}
              id={subset.filterId}
              icon={subset.name !== "Sammlungen" &&
              subset.name !== "Laborgeräte" ? subset.name : "pfeil"  }
              checked={
                !this.props.filters[subset.filterId]
                  ? false
                  : this.props.filters[subset.filterId].value.includes(subset.name)
              }
              onChange={this.props.changeFilter}
              showCheckbox={subset.isTogglable}
              color={getFieldColor(subset.name)}
              toggleState={this.props.toggleState}
              toggledFilterList={this.toggledFilterList}
            />
          </div>
          { !this.props.toggleState.includes(subset.name) && (
            subset.subFilters.map((filter, i) => (
            <div className={style.subFilter} key={subset.name + i}>
              <CheckBox
                name={filter}
                id={subset.subFilterId}
                checked={this.props.filters[subset.subFilterId].value.includes(
                  filter
                )}
                onChange={this.props.changeFilter}
                showCheckbox={true}
                color={getFieldColor(subset.name)}
              />
            </div>
          )))}
        </div>
      ))}
    </div>
  );
}
 toggledFilterList(name, state, change) {
  if (state.find(e => e === name)){
    state.splice(state.indexOf(name),1);
  } else {
    state.push(name);
  }
  this.setState({toggleState: state});
}

};

export default FilterSet;




const CheckBox = props => (
  <div className={style.checkBoxWrapper}
    onClick={() => {
      if(props.icon){
        props.toggledFilterList(props.name, props.toggleState);
      }
    }}>
    <span>
    {props.icon && (
    <svg
      className={style.checkBoxIcon}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px" y="0px"
      viewBox="0 0 100 100"
      fill={props.color}
      stroke={getFieldColor(props.icon)}>
      <path d={getFieldIcon(props.icon)}/>
    </svg>
  )}
    {props.name}
    </span>
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
