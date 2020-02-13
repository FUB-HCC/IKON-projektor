import React from "react";
import styles from "./time-line-view.module.css";

const TargetgroupBuckets = props => {
  let maxNumberWtas = Math.max(
    ...Object.values(props.ktasYearBuckets)
      .map(tg => tg.map(year => year.numberOfWtas))
      .flat()
  );
  return Object.keys(props.ktasYearBuckets).map(targetgroup => {
    return (
      <div className={styles.wtaBucketName} key={targetgroup}>
        <span>{targetgroup}</span> <br />
        <svg height={props.height} width={props.width}>
          <line
            x1="0"
            y1={props.height * 0.5}
            x2={props.width}
            y2={props.height * 0.5}
            style={{
              zIndex: "-99",
              stroke: "#fff3",
              fill: "none"
            }}
          />
          {props.ktasYearBuckets[targetgroup].map(year => {
            return (
              <g key={targetgroup + year.year}>
                <circle
                  cx={props.xScale(year.year)}
                  cy={props.height * 0.5}
                  r={Math.max(
                    (year.numberOfWtas * props.height * 0.49) / maxNumberWtas,
                    2
                  )}
                  className={styles.wtaBucketCircle}
                  onClick={() => {
                    year.targetgroup = targetgroup;
                    props.showYearDetails(year.year + "|" + targetgroup);
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
                  onMouseLeave={props.handleMouseLeave}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  });
};
export default TargetgroupBuckets;
