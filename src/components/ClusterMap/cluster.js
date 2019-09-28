import React from "react";
import ClusterDot from "./cluster-dot";

export default class Cluster extends React.Component {
  state = { hover: false };
  render() {
    const { cluster, getLocation } = this.props;
    const nwPts = cluster.projects.map(x => x.location).map(getLocation);

    return (
      <g key={cluster.id}>
        {nwPts.map((point, i) => (
          <ClusterDot
            point={point}
            color={cluster.color}
            key={i}
            x={point[0]}
            y={point[1]}
            highlightCat={this.props.highlightCat}
            resetCat={this.props.resetCat}
            showProjectDetails = {() => this.props.showProjectDetails(cluster.projects[i].id)}
          />
        ))}
      </g>
    );
  }
}
