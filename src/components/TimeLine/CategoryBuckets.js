import React from "react";
import styles from "./time-line-view.module.css";
import InteractionHandler from "../../util/interaction-handler";

const CategoryBuckets = props => {
  let maxNumberWtas = Math.max(
    ...Object.values(props.ktasYearBuckets)
      .map(tg => tg.map(year => year.numberOfWtas))
      .flat()
  );
  return Object.keys(props.ktasYearBuckets).map(category => {
    return (
      <div className={styles.wtaBucketName} key={category}>
        <span>{category}</span> <br />
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
          {props.ktasYearBuckets[category].map(year => {
            return (
              <g key={category + year.year}>
                <InteractionHandler
                  isInTouchMode={false}
                  onMouseOver={event => {
                    props.handleCircleMouseEnter(
                      {
                        x: props.xScale(year.year),
                        y: props.height,
                        year: year.year,
                        count: year.numberOfWtas,
                        category: category
                      },
                      event
                    );
                  }}
                  onMouseLeave={() => props.handleMouseLeave()}
                  onClick={() => {
                    year.category = category;
                    props.showYearDetails(year.year + "|" + category);
                  }}
                  doubleTapTreshold={500}
                >
                  <circle
                    cx={props.xScale(year.year)}
                    cy={props.height * 0.5}
                    r={Math.max(
                      (year.numberOfWtas * props.height * 0.49) / maxNumberWtas,
                      2
                    )}
                    className={styles.wtaBucketCircle}
                  />
                </InteractionHandler>
              </g>
            );
          })}
        </svg>
      </div>
    );
  });
};
export default CategoryBuckets;
