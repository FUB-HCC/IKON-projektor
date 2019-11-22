import React from "react";
import PropTypes from "prop-types";

export default class ClusterDot extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string
  };

  static defaultProps = { x: 0, y: 0, color: "white" };

  render() {
    const { x, y, color, icon } = this.props;
    const scale =
      this.props.point.projectData &&
      this.props.highlightedProjects.find(
        hProject => hProject === this.props.point.projectData.id
      )
        ? 1.2
        : 1;

    return (
      <g
        onMouseOver={() => {
          if (this.props.point.projectData) {
            this.props.highlightProject(this.props.point.projectData.id);
          }
        }}
        onMouseOut={() => this.props.unHighlight()}
        onClick={() => {
          this.props.showProjectDetails();
        }}
        transform={
          "translate(" +
          (x - (this.props.radius / 40) * scale) +
          "," +
          (y - (this.props.radius / 40) * scale) +
          ")"
        }
      >
        <circle
          cx={this.props.radius / 60}
          cy={this.props.radius / 60}
          r={this.props.radius / 35}
          fill={"transparent"}
        />
        <svg
          width={(this.props.radius / 20) * scale}
          height={(this.props.radius / 20) * scale}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px" y="0px"
          viewBox="0 0 100 100"
          fill={color}
          stroke={color}>
          <path d={icon}/>

        </svg>
      </g>
    );
  }
}
