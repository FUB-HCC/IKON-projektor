import React from "react";
import _ from "lodash";
import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";

const arcMarginSides = (width, scale) => Math.min(0.25 * width, 0.25 * scale);
const arcMarginTop = (height, scale) => Math.min(0.15 * height, 0.15 * scale);
const clusterSize = scale => 0.35 * scale;
const clusterPosX = (width, scale) => 0.5 * width - clusterSize(scale) / 2;
const clusterPosY = (height, scale) => 0.5 * height - clusterSize(scale) / 2;
const clusterHullStrokeWidth = scale => 0.025 * scale;
const fontSizeText = scale => 0.009 * scale;
const fontSizeCount = scale => 0.006 * scale;
const textOffsetFromArc = scale => 0.03 * scale;
const countOffsetFromArc = scale => 0.018 * scale;
const connectionOffsetFromArc = scale => -0.015 * scale;
const circleScaling = scale => 0.02 * scale;
const strokeWidth = scale => 0.001 * scale;

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

  getPointLocation = (pt, width, height) => {
    const [x, y] = pt;
    const normalizedX = x / this.maxX;
    const normalizedY = y / this.maxY;

    return [
      normalizedX * clusterSize(this.scale) + clusterPosX(width, this.scale),
      normalizedY * clusterSize(this.scale) + clusterPosY(height, this.scale)
    ];
  };

  render() {
    const { categories, width, height } = this.props;

    this.scale = Math.min(height, width);
    const scale = this.scale;
    if (categories.length === 0 || !width || !height || scale <= 0) {
      return <div />;
    }

    const shiftX = width / 2;
    const shiftY = height / 2;
    const radius = (scale - arcMarginSides(width, scale)) / 2;
    const each = 180 / (categories.length - 1);
    const cats = _.reverse(_.sortBy(categories, x => x.count));
    const conMax = cats[0].count;

    return (
      <div className={style.clusterMapWrapper}>
        <svg
          className="viz-3"
          viewBox={"0 0 " + width + " " + height}
          width={width}
          height={height}
        >
          <g transform={"translate(0 " + arcMarginTop(height, scale) + ")"}>
            <g style={{ transform: "translate(0px, 0px)" }}>
              {this.props.clusterData.map(cluster => (
                <polygon
                  key={cluster.id}
                  points={cluster.concaveHull.map(point =>
                    this.getPointLocation(point, width, height)
                  )}
                  stroke="#aaaaaa"
                  strokeWidth={clusterHullStrokeWidth(scale)}
                  strokeLinejoin="round"
                  fill="#aaaaaa"
                  opacity="0.3"
                />
              ))}
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
            {categories.map((cat, i) => {
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
                      x={textX}
                      y={textY}
                      textAnchor={anchor}
                      fill="white"
                      fontSize={
                        fontSizeText(this.scale) * (isHighlighted ? 1.2 : 1)
                      }
                      transform={`rotate(${textRotate} ${textX} ${textY})`}
                    >
                      {cat.title}
                    </text>
                  </g>
                  <g>
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
