import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as SelectedIcon } from "../../assets/Selected-Project.svg";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Project.svg";
import { shortenString } from "../../util/utility";

export default class ClusterDot extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string,
    hover: PropTypes.bool
  };

  static defaultProps = { x: 0, y: 0, color: "white", hover: false };

  render() {
    const { x, y, color } = this.props;
    const isHighlighted =
      this.props.point.projectData &&
      this.props.highlightedProjects.find(
        hProject => hProject === this.props.point.projectData.id
      );
    const scale = isHighlighted ? 1.2 : 1;

    return (
      <g
        onMouseOver={event => {
          if (this.props.point.projectData) {
            this.props.highlightProject(
              this.props.point.projectData.id,
              event,
              shortenString(this.props.point.projectData.title, 60)
            );
          }
        }}
        onMouseLeave={() => {
          if (this.props.point.projectData.id !== this.props.selectedProject)
            this.props.unHighlight();
        }}
        onClick={event => {
          this.props.highlightProject(
            this.props.point.projectData.id,
            event,
            shortenString(this.props.point.projectData.title, 60)
          );
          this.props.showProjectDetails();
        }}
        transform={
          "translate(" +
          (x - (this.props.radius / 24) * scale) +
          "," +
          (y - (this.props.radius / 24) * scale) +
          ")"
        }
      >
        <circle
          cx={this.props.radius / 60}
          cy={this.props.radius / 60}
          r={this.props.radius / 35}
          fill={"transparent"}
        />
        {isHighlighted ? (
          <g>
            <SelectedIcon
              width={(this.props.radius / 12) * scale}
              height={(this.props.radius / 12) * scale}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              fill={color}
              stroke="#7c7c7c"
              cursor="POINTER"
            />
          </g>
        ) : (
          <UnselectedIcon
            width={(this.props.radius / 12) * scale}
            height={(this.props.radius / 12) * scale}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            fill={color}
            stroke="#7c7c7c"
            cursor="POINTER"
          />
        )}
      </g>
    );
  }
}
