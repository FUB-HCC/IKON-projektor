import React from "react";
import _ from "lodash";
import { contours as d3Contours } from "d3-contour";
import { scaleLinear as d3ScaleLinear } from "d3-scale";
import { extent as d3extent } from "d3-array";

import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";

const arcMarginSides = (width, scale) => Math.min(0.2 * width, 0.2 * scale);
const arcMarginTop = (height, scale) => Math.min(0.1 * height, 0.1 * scale);
const clusterSize = scale => 0.4 * scale;
const clusterPosX = (width, scale) => 0.5 * width - clusterSize(scale) / 2;
const clusterPosY = (height, scale) => 0.5 * height - clusterSize(scale) / 2;
const fontSizeText = scale => 0.009 * scale;
const fontSizeCount = scale => 0.006 * scale;
const textOffsetFromArc = scale => 0.03 * scale;
const countOffsetFromArc = scale => 0.018 * scale;
const connectionOffsetFromArc = scale => -0.015 * scale;
const circleScaling = scale => 0.02 * scale;
const strokeWidth = scale => 0.001 * scale;
const contoursSize = 600;

export default class ClusterMapView extends React.Component {
  constructor() {
    super();
    this.state = {
      highlightedCats: [],
      highlightedLinks: [],
      highlightedProjects: []
    };
    this.highlightCat = this.highlightCat.bind(this);
    this.highlightProject = this.highlightProject.bind(this);
    this.unHighlight = this.unHighlight.bind(this);
  }

  get maxX() {
    return _.max(
      _.map(
        _.flatten(_.map(this.props.clusterData, c => c.projects)),
        c => c.location[0]
      )
    );
  }

  get maxY() {
    return _.max(
      _.map(
        _.flatten(_.map(this.props.clusterData, c => c.projects)),
        c => c.location[1]
      )
    );
  }

  unHighlight() {
    this.setState({
      highlightedCats: [],
      highlightedLinks: [],
      highlightedProjects: []
    });
  }

  highlightCat(category) {
    this.setState({
      highlightedCats: [category],
      highlightedLinks: this.findLinksByCat(category),
      highlightedProjects: this.findProjectsByCat(category)
    });
  }

  highlightProject(project) {
    this.setState({
      highlightedCats: this.findCatsByProject(project),
      highlightedLinks: this.findLinksByProject(project),
      highlightedProjects: [project]
    });
  }

  findLinksByCat(category) {
    return category.connections.map(con => con.id + "|" + category.id);
  }

  findProjectsByCat(category) {
    return category.connections.map(con => con.id);
  }

  findLinksByProject(project) {
    return this.props.categories
      .filter(cat => cat.connections.find(con => con.id === project))
      .map(cat => project + "|" + cat.id);
  }

  findCatsByProject(project) {
    return this.props.categories.filter(cat =>
      cat.connections.find(con => con.id === project)
    );
  }

  splitLongTitles = title => {
    var words = title.split(" ");
    var newtext = [words[0]];
    for (let i = 1; i < words.length; i++) {
      if (newtext[newtext.length - 1].length < 13) {
        newtext[newtext.length - 1] += " " + words[i];
      } else {
        newtext.push(words[i]);
      }
    }
    return newtext;
  };

  getPointLocation = (pt, width, height) => {
    const [x, y] = pt;
    const normalizedX = x / this.maxX;
    const normalizedY = y / this.maxY;

    return [
      normalizedX * clusterSize(this.scale) + clusterPosX(width, this.scale),
      normalizedY * clusterSize(this.scale) + clusterPosY(height, this.scale)
    ];
  };

  scaleContours = (coords, width, height) => {
    var newConts = [];
    if (coords[0]) {
      for (var i = 0; i < coords[0].length; i++) {
        const [x, y] = coords[0][i];
        const nX =
          (x / contoursSize) * clusterSize(this.scale) +
          clusterPosX(width, this.scale);
        const nY =
          (y / contoursSize) * clusterSize(this.scale) +
          clusterPosY(height, this.scale);
        newConts[i] = [nX, nY];
      }
    }
    return newConts;
  };

  render() {
    const { categories, width, height } = this.props;

    var colorHeat = d3ScaleLinear()
      .domain(d3extent(this.props.topography))
      .range(["#000", "#888"]);
    var contours = d3Contours()
      .size([contoursSize, contoursSize])
      .smooth([true])(this.props.topography);
    this.scale = Math.min(height, width);
    const scale = this.scale;
    if (categories.length === 0 || !width || !height || scale <= 0) {
      return <div />;
    }
    const shiftX = width / 2;
    const shiftY = height / 2;
    const radius = (scale - arcMarginSides(width, scale)) / 2;
    const each = 180 / (categories.length - 1);
    const sortedTargetgroups = categories.sort((a, b) =>
      a.title < b.title ? 1 : -1
    );
    const conMax = Math.max(...categories.map(o => o.count), 0);

    return (
      <div className={style.clusterMapWrapper}>
        <svg
          className="viz-3"
          viewBox={"0 0 " + width + " " + height}
          width={width}
          height={height}
        >
          <g
            fill="none"
            transform={"translate(0 " + arcMarginTop(height, scale) + ")"}
          >
            {contours.map(cont => {
              return (
                <path
                  className="isoline"
                  key={cont.value}
                  d={cont.coordinates.map(coord => {
                    var coords = this.scaleContours(coord, width, height);
                    return "M" + coords[0] + "L" + coords;
                  })}
                  fill={colorHeat(cont.value)}
                />
              );
            })}
          </g>
          <g transform={"translate(0 " + arcMarginTop(height, scale) + ")"}>
            <g style={{ transform: "translate(0px, 0px)" }}>
              {this.props.clusterData.map(cluster => {
                return (
                  <Cluster
                    key={cluster.id}
                    cluster={cluster}
                    getLocation={p => this.getPointLocation(p, width, height)}
                    radius={radius}
                    highlightProject={this.highlightProject}
                    highlightedProjects={this.state.highlightedProjects}
                    unHighlight={this.unHighlight}
                    resetCat={() => this.setState({ highlightedCat: null })}
                    showProjectDetails={this.props.showProjectDetails}
                  />
                );
              })}
            </g>

            {sortedTargetgroups.map((cat, i) => {
              const startAngle = each * i - 180;
              const angle = startAngle * (Math.PI / 180);
              const conLen = cat.count;
              const x = shiftX + radius * Math.cos(angle);
              const y = shiftY + radius * Math.sin(angle);
              const textX =
                shiftX + (radius + textOffsetFromArc(scale)) * Math.cos(angle);
              const textY =
                shiftY + (radius + textOffsetFromArc(scale)) * Math.sin(angle);
              const lenX =
                shiftX + (radius + countOffsetFromArc(scale)) * Math.cos(angle);
              const lenY =
                shiftY + (radius + countOffsetFromArc(scale)) * Math.sin(angle);
              const anchor = startAngle < -90 ? "end" : "start";
              const textRotate =
                startAngle < -90 ? startAngle + 180 : startAngle;
              const isHighlighted = this.state.highlightedCats.find(
                hcat => hcat.id === cat.id
              );
              const area = conLen / conMax;
              const rad = Math.sqrt(area / Math.PI) * circleScaling(scale) || 1;
              let lines = [];
              if (cat.connections.length > 0) {
                lines = cat.connections.map(con => {
                  const target = this.getPointLocation(
                    con.location,
                    width,
                    height
                  );
                  const angleDeg = startAngle;
                  const angle = angleDeg * (Math.PI / 180);
                  const sourceX =
                    shiftX +
                    (radius + connectionOffsetFromArc(scale)) * Math.cos(angle);
                  const sourceY =
                    shiftY +
                    (radius + connectionOffsetFromArc(scale)) * Math.sin(angle);
                  const midRadius = (radius - radius / 2) * (Math.PI / 180);
                  const midX = shiftX + midRadius * Math.cos(angle);
                  const midY = shiftY + midRadius * Math.sin(angle);
                  const mid = [midX, midY];
                  const source = [sourceX, sourceY];

                  return [
                    {
                      x: Math.round(source[0]),
                      y: Math.round(source[1])
                    },
                    {
                      x: Math.round(mid[0]),
                      y: Math.round(mid[1])
                    },
                    {
                      x: Math.round(target[0]),
                      y: Math.round(target[1])
                    },
                    {
                      x: Math.round(target[0]),
                      y: Math.round(target[1])
                    },
                    con.id + "|" + cat.id
                  ];
                });
              }

              return (
                <g key={cat.id}>
                  <g
                    onMouseOver={() => this.highlightCat(cat)}
                    onMouseOut={() => this.unHighlight()}
                    onClick={() => this.props.showCatDetails(cat.id)}
                  >
                    <circle
                      id={`cat-${cat.id}`}
                      r={rad}
                      cx={x}
                      cy={y}
                      stroke="white"
                      fill="white"
                    />
                    <text
                      x={lenX}
                      y={lenY}
                      textAnchor="middle"
                      fill="white"
                      fontSize={fontSizeCount(this.scale)}
                    >
                      {conLen}
                    </text>
                    <text
                      textAnchor={anchor}
                      fill="white"
                      fontSize={
                        fontSizeText(this.scale) * (isHighlighted ? 1.2 : 1)
                      }
                      transform={`rotate(${textRotate} ${textX} ${textY})`}
                    >
                      {this.splitLongTitles(cat.title).map((titlePart, i) => (
                        <tspan x={textX} y={textY + i * 10}>
                          {titlePart}
                        </tspan>
                      ))}
                    </text>
                  </g>
                  <g>
                    {lines.map((line, i) => (
                      <path
                        pointerEvents="none"
                        key={i}
                        strokeWidth={strokeWidth(scale) * 3}
                        fill="transparent"
                        stroke={
                          this.state.highlightedLinks.find(
                            hline => hline === line[4]
                          )
                            ? "rgba(100,100,100,1)"
                            : "rgba(100,100,100,0.1)"
                        }
                        d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                      />
                    ))}
                    {lines.map((line, i) => (
                      <path
                        pointerEvents="none"
                        key={i}
                        strokeWidth={strokeWidth(scale)}
                        fill="transparent"
                        stroke={
                          this.state.highlightedLinks.find(
                            hline => hline === line[4]
                          )
                            ? "#fff"
                            : "rgba(255,255,255,0.1)"
                        }
                        d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                      />
                    ))}
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
}
