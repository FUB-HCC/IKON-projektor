import React, { Component } from "react";
import style from "./filter-selection.module.css";
import { getFieldColor } from "../../util/utility";
import { ReactComponent as ArrowUp } from "../../assets/collapse-up.svg";
import { ReactComponent as ArrowDown } from "../../assets/collapse-down.svg";

class FilterSet extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      toggleState: this.props.set.subsets.map(s => s.name)
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
                nameId={subset.name}
                id={subset.filterId}
                checked={
                  !this.props.filters[subset.filterId]
                    ? false
                    : this.props.filters[subset.filterId].value.includes(
                        subset.name
                      )
                }
                onChange={this.props.changeFilter}
                showCheckbox={subset.isTogglable}
                color={getFieldColor(subset.name)}
                toggleState={this.state.toggleState}
                toggledFilterList={this.toggledFilterList}
                iconSize="20px"
                iconMargin="9"
                icon={
                  subset.subFilters && subset.subFilters.length > 0 ? (
                    this.state.toggleState.includes(subset.name) ? (
                      <ArrowDown
                        stroke={getFieldColor(subset.name)}
                        className={style.arrowIcon}
                      />
                    ) : (
                      <ArrowUp
                        className={style.arrowIcon}
                        stroke={getFieldColor(subset.name)}
                      />
                    )
                  ) : (
                    <div />
                  )
                }
              />
            </div>
            {!this.state.toggleState.includes(subset.name) &&
              subset.subFilters.map((filter, i) => (
                <div className={style.subFilter} key={subset.name + i}>
                  <CheckBox
                    name={filter.name || filter.fulltext || filter}
                    nameId={filter.id ? filter.id : filter}
                    id={subset.subFilterId}
                    checked={
                      this.props.filters[subset.subFilterId].value.includes(
                        filter.id
                      ) ||
                      this.props.filters[subset.subFilterId].value.includes(
                        filter
                      )
                    }
                    onChange={this.props.changeFilter}
                    showCheckbox={true}
                    color={getFieldColor(subset.name)}
                    iconSize="16px"
                    iconMargin="12"
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  }

  toggledFilterList(name, state, change) {
    if (state.find(e => e === name)) {
      state.splice(state.indexOf(name), 1);
    } else {
      state.push(name);
    }
    this.setState({ toggleState: state });
  }
}

export default FilterSet;

const CheckBox = props => (
  <div
    className={style.checkBoxWrapper}
    onClick={() => {
      if (props.icon) {
        props.toggledFilterList(props.nameId, props.toggleState);
      }
    }}
  >
    <input
      checked={props.checked}
      className={style.checkBox}
      type="checkbox"
      id={props.nameId}
      onChange={() => props.onChange(props.id, props.nameId)}
    />
    {props.showCheckbox && (
      <label
        className={style.checkBoxLabel}
        htmlFor={props.nameId}
        style={{
          border: props.color + " 2px solid",
          borderRadius: "50%",
          backgroundColor: props.checked ? props.color : "rgba(0,0,0,0)",
          marginRight: props.iconMargin + "px",
          marginLeft: props.iconMargin * 0.5 + "px",
          width: props.iconSize,
          height: props.iconSize
        }}
      />
    )}
    <span>{props.name}</span>
    {props.icon}
  </div>
);
