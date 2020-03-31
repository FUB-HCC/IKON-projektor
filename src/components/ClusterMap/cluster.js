import React from "react";
import ClusterDot from "./cluster-dot";

const Cluster = props => {
  const {
    cluster,
    getLocation,
    radius,
    highlightedProjects,
    isTouchMode
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
