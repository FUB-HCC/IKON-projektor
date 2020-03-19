import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as SelectedIcon } from "../../assets/Selected-Project.svg";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Project.svg";
import { useDispatch } from "react-redux";
import InteractionHandler from "../../util/interaction-handler";
import {
  projectClicked,
  projectHovered,
  unHovered
} from "../../store/actions/actions";

const ClusterDot = props => {
  const { x, y, color, isHighlighted, radius, point, isTouchMode } = props;
  const dispatch = useDispatch();
  const scale = isHighlighted ? 1.2 : 1;
  return (
    <InteractionHandler
      onClick={() => (point ? dispatch(projectClicked(point.id)) : null)}
      onMouseOver={() => (point ? dispatch(projectHovered(point.id)) : null)}
      onMouseLeave={() => dispatch(unHovered())}
      longPressThreshold={300}
      isInTouchMode={isTouchMode}
    >
      <g
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
    </InteractionHandler>
  );
};

ClusterDot.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  color: PropTypes.string
};
export default ClusterDot;
