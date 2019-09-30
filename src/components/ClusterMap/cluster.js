import React from "react";
import ClusterDot from "./cluster-dot";

export default class Cluster extends React.Component {
  state = { hover: false };
  render() {
    const { cluster, getLocation } = this.props;
    const projects = cluster.projects.map(project => ({
      point: getLocation(project.location),
      color: project.color,
      projectData: project.project
    }));

    return (
      <g key={cluster.id}>
        {projects.map((project, i) => (
          <ClusterDot
            point={project}
            color={project.color}
            key={i}
            radius={this.props.radius}
            x={project.point[0]}
            y={project.point[1]}
            highlightCat={this.props.highlightCat}
            resetCat={this.props.resetCat}
            showProjectDetails={() =>
              this.props.showProjectDetails(cluster.projects[i].id)
            }
          />
        ))}
      </g>
    );
  }
}
