import React from "react";
import ClusterDot from "./cluster-dot";

const Cluster = props => {
  const { cluster, getLocation, radius, highlightedProjects, isTouchMode } = props;
  const projects = cluster.projects.map(project => ({
    point: getLocation(project.location),
    color: project.color,
    icon: project.icon,
    projectData: project.project,
    id: project.id
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
