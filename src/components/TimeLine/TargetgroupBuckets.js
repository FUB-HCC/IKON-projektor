import React from "react";
import styles from "./time-line-view.module.css";

const TargetgroupBuckets = props => {
  return Object.keys(props.ktasYearBuckets).map(targetgroup => {
    if (props.ktasYearBuckets[targetgroup].length < 3) {
      return "";
    } else {
      return (
        <div className={styles.wtaBucketName} key={targetgroup}>
          <span>{targetgroup}</span> <br />
          <svg height={props.height} width={props.width}>
            {props.ktasYearBuckets[targetgroup].map(year => {
              return (
                <g key={targetgroup + year.year}>
                  <circle
                    cx={props.xScale(year.year)}
                    cy={props.height * 0.5}
                    r={Math.max((year.numberOfWtas * props.height) / 70, 2)}
                    className={styles.wtaBucketCircle}
                    onClick={() => {
                      year.targetgroup = targetgroup;
                      props.showYearDetails(year);
                    }}
                    onMouseOver={event => {
                      props.handleCircleMouseEnter(
                        {
                          x: props.xScale(year.year),
                          y: props.height,
                          year: year.year,
                          count: year.numberOfWtas,
                          targetgroup: targetgroup
                        },
                        event
                      );
                    }}
                    onMouseLeave={props.handleCircleMouseLeave}
                  />
                </g>
              );
            })}
            <line
              x1="0"
              y1={props.height}
              x2={props.width}
              y2={props.height}
              stroke="#717171"
              fill="none"
            />
          </svg>
        </div>
      );
    }
  });
};
export default TargetgroupBuckets;
