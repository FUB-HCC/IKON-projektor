import React from "react";
import classes from "../AreaChart/area-chart-view.module.css";

const HoverPopover = props => {
  let { locationX, locationY, width, height } = props;
  if (!width) {
    width = `40em`;
  }
  if (!height) {
    height = `10em`;
  }

  return (
    <div
      className={classes.popover_body}
      style={{
        width: width, // TODO dynamically style width
        height: height, // TODO dynamically style height
        margin: `5em`,
        // marginTop: '-3em',
        marginLeft: "-4em",
        position: "absolute",
        left: locationX + "px",
        top: locationY + "px",
        backgroundColor: "transparent",
        display: "flex",
        flexWrap: "wrap",
        zIndex: 99,
        bottom: 0,
        right: 0
      }}
    >
      {props.children}
    </div>
  );
};

export default HoverPopover;
