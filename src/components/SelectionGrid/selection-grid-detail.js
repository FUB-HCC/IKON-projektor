import React from "react";
import style from "./selection-grid.module.css";
import HoverPopover from "../HoverPopover/HoverPopover";
import { ReactComponent as SelectedIcon } from "../../assets/Selected-Project.svg";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Project.svg";
import { getFieldColor } from "../../util/utility";

export default class SelectionGridDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hovered: false,
      mouseLocation: [0, 0]
    };
    this.renderHover = this.renderHover.bind(this);
  }
  getPointLocation(pt, scale) {
    let [x, y] = pt;
    let newX = (x + 2) * scale;
    let newY = (y + 2) * scale;
    return newX + " " + newY;
  }
  renderHover(hovered, mouseLocation) {
    return (
      hovered && (
        <HoverPopover
          width={"15em"}
          height="20px"
          locationX={mouseLocation[0]}
          locationY={mouseLocation[1]}
        >
          <p
            style={{
              position: "absolute",
              backgroundColor: "#1c1d1f",
              margin: "0",
              fontSize: "10px",
              color: "#afca0b",
              fontWeight: "500",
              letterSpacing: "1px",
              overflow: "hidden",
              padding: "5px 10px"
            }}
          >
            <label>{hovered}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const { selectedOrdering, width } = this.props;
    const scale = width / 4;
    if (!selectedOrdering) {
      return <div />;
    }
    return (
      <div>
        <svg height={width} width={width} fill="transparent">
          {selectedOrdering.projects.map((project, i) => (
            <g
              transform={
                "translate(" + this.getPointLocation(project, scale) + ")"
              }
              key={i + "punkt"}
            >
              <UnselectedIcon
                width={15}
                height={15}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0"
                y="0"
                viewBox="0 0 100 100"
                cursor="POINTER"
                stroke={"transparent"}
                fill={getFieldColor(selectedOrdering.fbs[i])}
                onMouseOver={evt => {
                  this.setState({
                    hovered: selectedOrdering.titles[i],
                    mouseLocation: [
                      evt.nativeEvent.clientX,
                      evt.nativeEvent.clientY
                    ]
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    hovered: false,
                    mouseLocation: [0, 0]
                  });
                }}
              />
            </g>
          ))}
        </svg>

        {this.renderHover(this.state.hovered, this.state.mouseLocation)}
      </div>
    );
  }
}
