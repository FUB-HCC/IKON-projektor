import React from "react";

const TargetgroupRow = props => {
  if (props.ktasYearBuckets[props.targetgroup].length < 3) {
    return "";
  }
  return (
    <div>
      <span>{props.targetgroup}</span> <br />
      <svg height={props.height} width={props.width}>
        {props.ktasYearBuckets[props.targetgroup].map(year => {
          return (
            <circle
              key={props.targetgroup + year.year}
              cx={props.xScale(year.year)}
              cy={props.height * 0.5}
              r={Math.max(year.numberOfWtas * 0.5, 1)}
              fill="#fff"
              stroke="#fff"
            />
          );
        })}
        <line
          x1="0"
          y1={props.height}
          x2={props.width}
          y2={props.height}
          stroke="#717071"
          fill="none"
        />
      </svg>
    </div>
  );
};
export default TargetgroupRow;
