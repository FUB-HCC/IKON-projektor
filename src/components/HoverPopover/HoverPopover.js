import React from "react";

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
      style={{
        width: width, // TODO dynamically style width
        height: height, // TODO dynamically style height
        margin: `5em`,
        // marginTop: '-3em',
        marginLeft: "-4em",
        position: "absolute",
        left: locationX + "px",
        top: locationY - 130 + "px",
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
