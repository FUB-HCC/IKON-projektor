import React from "react";
import style from "./selection-grid.module.css";
import { getFieldColor } from "../../util/utility";

export default class SelectionGridDetail extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const { selectedOrdering, selectOrdering, data, width } = this.props;

    const scale = 5;

    if (!selectedOrdering || !width || !data[0].length > 1) {
      return <div />;
    }
    return (
      <div className={style.allOrderingsWrapper}>
        {data.map(reihe =>
          reihe.map(ord => (
            <svg height={width / 10} width={width / 10}>
              {ord[1].projects.map((project, i) => (
                <circle
                  transform={
                    "translate(" +
                    (project[0] + 2.1) * (width / 44) +
                    " " +
                    (project[1] + 2.1) * (width / 44) +
                    ")"
                  }
                  key={i + "punkt"}
                  r={1}
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
                height={width / 10}
                width={width / 10}
                stroke={
                  ord[0] === parseInt(selectedOrdering) ? "#afca0b" : "#222"
                }
                fill="transparent"
                onClick={() => selectOrdering(ord[0])}
                cursor="POINTER"
              />
            </svg>
          ))
        )}
      </div>
    );
  }
}
