import React from "react";
import { contours as d3Contours } from "d3-contour";
import { scaleLinear as d3ScaleLinear } from "d3-scale";
import { extent as d3extent } from "d3-array";
import { geoPath as d3GeoPath } from "d3-geo";

const scaleContours = (
  cont,
  width,
  height,
  contoursSize,
  clusterSize,
  clusterX,
  clusterY
) => {
  const coords = cont.coordinates;
  const factor = clusterSize(Math.min(height, width));
  const ClusterPosX = clusterX(width, Math.min(height, width));
  const ClusterPosY = clusterY(height, Math.min(height, width));
  const scaledCoords = coords.map(cGroup =>
    cGroup.map(c =>
      c.map(point => [
        (point[0] / contoursSize) * factor + ClusterPosX,
        (point[1] / contoursSize) * factor + ClusterPosY
      ])
    )
  );
  return {
    ...cont,
    coordinates: scaledCoords
  };
};

const constructContours = (topography, contoursSize) =>
  d3Contours()
    .size([contoursSize, contoursSize])
    .smooth([false])
    .thresholds(20)(topography);

const computeColorMap = topography =>
  d3ScaleLinear()
    .domain(d3extent(topography))
    .range(["#000", "#888"]);

class ClusterContoursMap extends React.Component {
  constructor(props) {
    super();
    const { topography, contoursSize } = props;
    this.state = {
      topography: topography
    };
    console.log(Math.min(...topography));
    this.contours = constructContours(topography, contoursSize);
    this.colorMap = computeColorMap(topography);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      this.props.topography.length !== nextProps.topography.length ||
      this.props.uncertaintyHighlighted !== nextProps.uncertaintyHighlighted
    );
  }

  render() {
    const {
      width,
      height,
      contoursSize,
      clusterSize,
      clusterX,
      clusterY,
      topography
    } = this.props;
    if (topography.length !== this.state.topography.length) {
      this.contours = constructContours(topography, contoursSize);
      this.colorMap = computeColorMap(topography);
      this.setState({
        topography: topography
      });
    }
    const lineFunction = d3GeoPath();
    const scale = Math.min(height, width);
    return (
      <g fill="transparent">
        {this.contours.map(cont => {
          const scaledContours = scaleContours(
            cont,
            width,
            height,
            contoursSize,
            clusterSize,
            clusterX,
            clusterY
          );
          return (
            <path
              className="isoline"
              key={cont.value}
              d={lineFunction(scaledContours)}
              fill={this.colorMap(cont.value)}
            />
          );
        })}
        <circle
          cx={clusterX(width, scale) + 0.5 * clusterSize(scale)}
          cy={clusterY(height, scale) + 0.5 * clusterSize(scale)}
          r={clusterSize(scale) * 0.58}
          fill={this.props.uncertaintyHighlighted ? "#afca0b22" : "none"}
        />
      </g>
    );
  }
}

export default ClusterContoursMap;
