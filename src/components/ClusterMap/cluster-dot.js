import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as SelectedIcon } from "../../assets/Selected-Project.svg";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Project.svg";
import { shortenString } from "../../util/utility";
import TouchEventHandler from "../../util/touch-event-handler";

export default class ClusterDot extends React.Component {
  constructor() {
    super();
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string,
    hover: PropTypes.bool
  };

  static defaultProps = { x: 0, y: 0, color: "white", hover: false };

  handleMouseOver() {
    if (this.props.point.projectData) {
      this.props.highlightProject(
        this.props.point.projectData.id,
        shortenString(this.props.point.projectData.title, 60)
      );
    }
  }

  handleClick() {
    this.props.highlightProject(
      this.props.point.projectData.id,
      shortenString(this.props.point.projectData.title, 60)
    );
    this.props.showProjectDetails();
  }

  render() {
    const { x, y, color } = this.props;
    const isHighlighted =
      this.props.point.projectData &&
      this.props.highlightedProjects.find(
        hProject => hProject === this.props.point.projectData.id
      );
    const scale = isHighlighted ? 1.2 : 1;

    return (
      <TouchEventHandler
        onShortPress={this.handleMouseOver}
        onLongPress={this.handleClick}
        longPressThreshold={400}
      >
        <g
          transform={
            "translate(" +
            (x - (this.props.radius / 30) * scale) +
            "," +
            (y - (this.props.radius / 30) * scale) +
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
                width={(this.props.radius / 15) * scale}
                height={(this.props.radius / 15) * scale}
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
              width={(this.props.radius / 15) * scale}
              height={(this.props.radius / 15) * scale}
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
      </TouchEventHandler>
    );
  }
}
