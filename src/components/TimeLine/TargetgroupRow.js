import React from "react";

export default class TargetgroupRow extends React.Component {
  render() {
    if (this.props.ktasYearBuckets[this.props.targetgroup].length < 3) {
      return "";
    }
    return (
      <div>
        <span>{this.props.targetgroup}</span> <br />
        <svg height={this.props.height} width={this.props.width}>
          {this.props.ktasYearBuckets[this.props.targetgroup].map(year => {
            return (
              <circle
                key={this.props.targetgroup + year.year}
                cx={this.props.xScale(year.year)}
                cy={this.props.height * 0.5}
                r={Math.max(year.numberOfWtas * 0.5, 1)}
                fill="#fff"
                stroke="#fff"
              />
            );
          })}
          <line
            x1="0"
            y1={this.props.height}
            x2={this.props.width}
            y2={this.props.height}
            stroke="#717071"
            fill="none"
          />
        </svg>
      </div>
    );
  }
}
