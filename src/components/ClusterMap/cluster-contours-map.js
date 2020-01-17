import React from "react";
import { contours as d3Contours } from "d3-contour";
import { scaleLinear as d3ScaleLinear } from "d3-scale";
import { extent as d3extent } from "d3-array";

const scaleContours = (
  coords,
  width,
  height,
  contoursSize,
  clusterSize,
  clusterX,
  clusterY
) => {
  var newConts = [];
  const scale = Math.min(height, width);
  if (coords[0]) {
    for (var i = 0; i < coords[0].length; i++) {
      const [x, y] = coords[0][i];
      const nX =
        (x / contoursSize) * clusterSize(scale) + clusterX(width, scale);
      const nY =
        (y / contoursSize) * clusterSize(scale) + clusterY(height, scale);
      newConts[i] = [nX, nY];
    }
  }
  return newConts;
};

const constructContours = (topography, contoursSize) =>
  d3Contours()
    .size([contoursSize, contoursSize])
    .smooth([true])(topography);

const computeColorMap = topography =>
  d3ScaleLinear()
    .domain(d3extent(topography))
    .range(["#0e0e0e", "#888"]);

class ClusterContoursMap extends React.Component {
  constructor(props) {
    super();
    const { topography, contoursSize } = props;
    this.state = {
      topography: topography
    };
    this.contours = constructContours(topography, contoursSize);
    this.colorMap = computeColorMap(topography);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      this.props.topography.length !== nextProps.topography.length
    );
  }

  render() {
    const {
      width,
      height,
      contoursSize,
      translateX,
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
    const scale = Math.min(height, width);
    return (
      <g
        fill="none"
        transform={"translate(0 " + translateX(height, scale) + ")"}
      >
        {this.contours.map(cont => {
          return (
            <path
              className="isoline"
              key={cont.value}
              d={cont.coordinates.map(coord => {
                var coords = scaleContours(
                  coord,
                  width,
                  height,
                  contoursSize,
                  clusterSize,
                  clusterX,
                  clusterY
                );
                return "M" + coords[0] + "L" + coords;
              })}
              fill={this.colorMap(cont.value)}
            />
          );
        })}
      </g>
    );
  }
}

export default ClusterContoursMap;
