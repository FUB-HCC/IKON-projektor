/* eslint-disable no-multi-str */
import React from "react";

import classes from "../redesigned.module.css";
import { getFieldColor, getTopicColor } from "../../store/utility";

const filterElement = props => {
  const filters = props.keys.map((k, key) => {
    const labelString = k.length > 60 ? k.slice(0, 60) + "..." : k;
    const color =
      getTopicColor(k) === "#989aa1" ? getFieldColor(k) : getTopicColor(k);
    return (
      <div
        style={{
          width: props.keys.length > 15 ? "20%" : "25%",
          fontSize: props.keys.length > 15 ? "1.0vh" : "1.2vh"
        }}
        className={classes.Filter}
        key={key}
      >
        <input
          onChange={() => props.change(props.id, k, "a")}
          checked={props.value.some(v => v === k)}
          className={classes.CheckBox}
          type="checkbox"
          name={k}
          key={key}
          id={k}
        />
        <label className={classes.CheckBoxLabel} htmlFor={k} />
        <span style={{ color: color }}>{labelString}</span>
      </div>
    );
  });
  const expandedHeight =
    70 +
    85 * Math.ceil(props.keys.length / (props.keys.length > 15 ? 5 : 4)) +
    "px";
  return (
    <div
      style={{ height: props.open ? expandedHeight : "70px" }}
      className={classes.FilterElement}
    >
      <div className={classes.Title}>
        <div className={classes.Text}>
          {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
          <div className={classes.Indicator}>
            <div className={classes.IndicatorDigit}>{props.value.length}</div>
          </div>
        </div>
        <svg
          cursor="pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          className={
            props.open ? classes.ButtonExpanded : classes.ButtonCollapsed
          }
          onClick={() => props.expand(props.id)}
        >
          <path
            fill="#fff"
            d="M3.352,48.296l28.56-28.328l28.58,28.347c0.397,0.394,0.917,0.59,1.436,0.59c0.52,0,1.04-0.196,1.436-0.59 c0.793-0.787,0.793-2.062,0-2.849l-29.98-29.735c-0.2-0.2-0.494-0.375-0.757-0.475c-0.75-0.282-1.597-0.107-2.166,0.456 L0.479,45.447c-0.793,0.787-0.793,2.062,0,2.849C1.273,49.082,2.558,49.082,3.352,48.296z"
          />
        </svg>
      </div>
      <div className={classes.Body}>{filters}</div>
    </div>
  );
};

export default filterElement;
