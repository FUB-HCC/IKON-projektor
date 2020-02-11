import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as SelectedIcon } from "../../assets/Selected-Project.svg";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Project.svg";
import { useDispatch } from "react-redux";
import {
  projectClicked,
  projectHovered,
  unHovered
} from "../../store/actions/actions";

const ClusterDot = props => {
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

ClusterDot.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  color: PropTypes.string
};
export default ClusterDot;
