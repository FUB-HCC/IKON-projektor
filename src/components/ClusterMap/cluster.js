import React from "react";
import ClusterDot from "./cluster-dot";

/* Clusters are not visible in the current state of the visualization. Yet the projects are separated by clusters in the data structure as this might change again. */
const Cluster = props => {
  const {
    cluster,
    getLocation,
    radius,
    highlightedProjects,
    isTouchMode,
    filteredProjects
  } = props;
  const projects = cluster.projects.map(project => ({
    ...project,
    point: getLocation(project.mappoint),
    color: project.color,
    icon: project.icon
  }));

  return (
    <g key={cluster.id}>
      {projects.map((project, i) => (
        <ClusterDot
          point={project}
          isVisible={filteredProjects.includes(project.id)}
          color={project.color}
          icon={project.icon}
          key={i + "project"}
          radius={radius}
          x={project.point[0]}
          y={project.point[1]}
          isHighlighted={highlightedProjects.includes(project.id)}
          isTouchMode={isTouchMode}
        />
      ))}
    </g>
  );
};

export default Cluster;
