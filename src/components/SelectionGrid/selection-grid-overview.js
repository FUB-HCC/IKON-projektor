import React from "react";
import style from "./selection-grid.module.css";
import HoverPopover from "../HoverPopover/HoverPopover";
import { getFieldColor } from "../../util/utility";
import { Slider } from "@blueprintjs/core";

export default class SelectionGridDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hovered: false,
      mouseLocation: [0, 0],
      hoveredId: false
    };
    this.renderHover = this.renderHover.bind(this);
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
              color: "#aaa",
              fontWeight: "500",
              letterSpacing: "1px",
              padding: "5px 10px",
              lineHeight: "100%"
            }}
          >
            <label>{hovered}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const { selectedOrdering, selectOrdering, data, width, size } = this.props;

    const scale = 5;

    if (!selectedOrdering || !width || !data[0].length > 1) {
      return <div />;
    }
    return (
      <div className={style.allOrderingsWrapper}>
        {data.map(reihe => (
          <span key={reihe[0][0] + "reihe"}>
            {reihe.map(ord => (
              <svg key={ord[0]} height={width / size} width={width / size}>
                {ord[1].projects.map((project, i) => (
                  <circle
                    transform={
                      "translate(" +
                      (project[0] + 0.1) * ((width * 0.8) / size) +
                      " " +
                      (project[1] + 0.1) * ((width * 0.8) / size) +
                      ")"
                    }
                    key={i + "punkt"}
                    r={10 / size}
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    viewBox="0 0 100 100"
                    stroke={"transparent"}
                    fill={getFieldColor(ord[1].fbs[i])}
                  />
                ))}

                <rect
                  height={width / size}
                  width={width / size}
                  stroke={
                    ord[0] === parseInt(selectedOrdering)
                      ? "#afca0b"
                      : this.state.hoveredId === ord[0]
                      ? "#888"
                      : "#222"
                  }
                  fill="transparent"
                  onClick={() => selectOrdering(ord[0])}
                  cursor="POINTER"
                  onMouseOver={evt => {
                    this.setState({
                      hoveredId: ord[0],
                      hovered:
                        "Perplexity: " +
                        ord[1].perp +
                        " Learning rate: " +
                        ord[1].lr,
                      mouseLocation: [
                        evt.nativeEvent.clientX,
                        evt.nativeEvent.clientY
                      ]
                    });
                  }}
                  onMouseLeave={() => {
                    this.setState({
                      hovered: false,
                      hoveredId: false,
                      mouseLocation: [0, 0]
                    });
                  }}
                />
              </svg>
            ))}
            <br />
          </span>
        ))}
        <span className={style.sliderWrapper}>
          Größe des Gitters:
          <Slider
            className={style.RangeSliderStyle}
            min={3}
            max={12}
            id="size"
            labelStepSize={3}
            value={this.props.size}
            onRelease={value => this.props.changeSize(value)}
          />
        </span>
        {this.renderHover(this.state.hovered, this.state.mouseLocation)}
      </div>
    );
  }
}
