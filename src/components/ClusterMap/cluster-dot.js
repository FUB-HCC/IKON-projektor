import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as SelectedIcon } from "../../assets/Selected-Project.svg";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Project.svg";
import { shortenString } from "../../util/utility";
import TouchEventHandler from "../../util/touch-event-handler";
import { useDispatch } from "react-redux";
import {
  projectClicked,
  projectHovered,
  unHovered
} from "../../store/actions/actions";

const ClusterDotTouch = props => {
  const { x, y, color, isHighlighted, radius, point } = props;
  const dispatch = useDispatch();
  const dispatchClicked = (e, id) => {
    e.stopPropagation();
    dispatch(projectClicked(id));
  };
  const scale = isHighlighted ? 1.2 : 1;
  return (
    <g
      onMouseOver={() =>
        point.projectData ? dispatch(projectHovered(point.id)) : null
      }
      onMouseLeave={() => dispatch(unHovered())}
      onClick={e => (point.projectData ? dispatchClicked(e, point.id) : null)}
      transform={
        "translate(" +
        (x - (radius / 24) * scale) +
        "," +
        (y - (radius / 24) * scale) +
        ")"
      }
    >
      <circle
        cx={radius / 60}
        cy={radius / 60}
        r={radius / 35}
        fill={"transparent"}
      />
      <SelectedIcon
        width={(radius / 12) * scale}
        height={(radius / 12) * scale}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        fill={isHighlighted ? color : "none"}
        stroke={isHighlighted ? "#7c7c7c" : "none"}
        cursor="POINTER"
      />
      <UnselectedIcon
        width={(radius / 12) * scale}
        height={(radius / 12) * scale}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        fill={isHighlighted ? "none" : color}
        stroke="#7c7c7c"
        cursor="POINTER"
      />
      )}
    </g>
  );
};

ClusterDotTouch.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  color: PropTypes.string
};

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
    const { x, y, color, isHighlighted } = this.props;
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
