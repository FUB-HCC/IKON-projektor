import React from "react";
import ClusterDot from "./cluster-dot";

const getCentroid = (pts) => {
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
    const nwPts = cluster.projects
    .map(x => x.location)
    .map(getLocation);

    return (
      <g key={cluster.id}>
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
