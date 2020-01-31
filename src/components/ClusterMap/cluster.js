import React from "react";
import ClusterDot from "./cluster-dot";

export default class Cluster extends React.Component {
  state = { hover: false };
  render() {
    const { cluster, getLocation } = this.props;
    const projects = cluster.projects.map(project => ({
      point: getLocation(project.location),
      color: project.color,
      icon: project.icon,
      projectData: project.project
    }));

    return (
      <g key={cluster.id}>
        {projects.map((project, i) => (
          <ClusterDot
            point={project}
            color={project.color}
            icon={project.icon}
            key={i}
            radius={this.props.radius}
            x={project.point[0]}
            y={project.point[1]}
            highlightedProjects={this.props.highlightedProjects}
            highlightProject={this.props.highlightProject}
            unHighlight={this.props.unHighlight}
            selectedProject={this.props.selectedProject}
            showProjectDetails={() =>
              this.props.showProjectDetails(cluster.projects[i].id)
            }
            splitLongTitles={this.props.splitLongTitles}
          />
        ))}
      </g>
    );
  }
}
