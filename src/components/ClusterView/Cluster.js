import React from "react";
import PropTypes from "prop-types";
import d3 from "d3-geom-concavehull";
import ClusterDot from "./ClusterDot";

function getCentroid(pts) {
  let first = pts[0],
    last = pts[pts.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) pts.push(first);
  let twicearea = 0,
    x = 0,
    y = 0,
    nPts = pts.length,
    p1,
    p2,
    f;
  for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = pts[i];
    p2 = pts[j];
    f = p1[0] * p2[1] - p2[0] * p1[1];
    twicearea += f;
    x += (p1[0] + p2[0]) * f;
    y += (p1[1] + p2[1]) * f;
  }
  f = twicearea * 3;
  return { x: x / f, y: y / f };
}

export default class Cluster extends React.Component {
  state = { hover: false };
  render() {
    const { hover } = this.state;
    const { cluster, getLocation } = this.props;
    // console.log(cluster.projects)
    const nwPts = cluster.projects
    // .map(x => x.gridLocation)
    .map(x => x.location)
    .map(getLocation);

    // const hull = d3.layout.concaveHull();
    // hull.distance(120);
    // const vs = hull(nwPts);
    // const center = getCentroid(vs[0]);

    return (
      <g key={cluster.id}>
        {/* <path
          className={hover ? "hull hull-hover" : "hull"}
          d={`M${vs.join("L")}Z`}
          stroke="#444"
          fill="#444"
          style={{
            transformOrigin: `${Math.round(center.x)}px ${Math.round(
              center.y
            )}px`
          }}
        /> */}
        {nwPts.map((point, i) =>
          <ClusterDot
            point={point}
            color={cluster.color}
            key={i}
            x={point[0]}
            y={point[1]}
            highlightCat={this.props.highlightCat}
            resetCat={this.props.resetCat}
          />
        )}
      </g>
    );
  }
}
