import React from "react";
import _ from "lodash";
import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";

const arcMarginSides = 300;
const arcMarginTop = 100;

export default class ClusterMapView extends React.Component {
  state = {
    highlightedCat: null
  };

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

  getPointLocation = (pt, width, height) => {
    const radius = (Math.min(width, height) - arcMarginSides) / 2;
    const clusterSize = (radius / Math.min(height, width)) * 0.5;

    const [x, y] = pt;
    const normalizedX = x / this.maxX;
    const normalizedY = y / this.maxY;

    return [
      normalizedX * clusterSize * Math.min(height, width) +
        (1 - clusterSize) * 0.5 * width,
      normalizedY * clusterSize * Math.min(height, width) +
        (1 - clusterSize) * 0.5 * height +
        arcMarginTop
    ];
  };

  render() {
    const { categories, width, height } = this.props;
    const shiftX = width / 2;
    const shiftY = height / 2 + arcMarginTop;
    const radius = (Math.min(width, height) - arcMarginSides) / 2;
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
          {categories.map((cat, i) => {
            const startAngle = each * i - 180;
            const angle = startAngle * (Math.PI / 180);
            const conLen = cat.count;
            const x = shiftX + radius * Math.cos(angle);
            const y = shiftY + radius * Math.sin(angle);
            const textX = shiftX + (radius + 40) * Math.cos(angle);
            const textY = shiftY + (radius + 40) * Math.sin(angle);
            const lenX = shiftX + (radius + 25) * Math.cos(angle);
            const lenY = shiftY + (radius + 25) * Math.sin(angle);
            const anchor = startAngle < -90 ? "end" : "start";
            const textRotate = startAngle < -90 ? startAngle + 180 : startAngle;
            const hc = this.state.highlightedCat;
            const isHighlighted = hc && hc.id === cat.id;
            const area = (conLen / conMax) * 300;
            const rad = Math.sqrt(area / Math.PI) || 1;

            const lines = cat.connections.map(con => {
              const target = this.getPointLocation(con.location);
              const angleDeg = startAngle;
              const angle = angleDeg * (Math.PI / 180);
              const sourceX = shiftX + (radius - 15) * Math.cos(angle);
              const sourceY = shiftY + (radius - 15) * Math.sin(angle);
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
                }
              ];
            });

            return (
              <g key={cat.id}>
                <g
                  onMouseOver={() => this.setState({ highlightedCat: cat })}
                  onMouseOut={() => this.setState({ highlightedCat: null })}
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
                    fontSize="6pt"
                  >
                    {conLen}
                  </text>
                  <text
                    x={textX}
                    y={textY}
                    textAnchor={anchor}
                    fill="white"
                    fontSize="6pt"
                    transform={`rotate(${textRotate} ${textX} ${textY})`}
                  >
                    {cat.title}
                  </text>
                </g>
                <g>
                  {lines.map(line => (
                    <path
                      strokeWidth="1"
                      fill="transparent"
                      stroke={isHighlighted ? "#fff" : "rgba(255,255,255,.07)"}
                      d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                    />
                  ))}
                </g>
              </g>
            );
          })}
          <g style={{ transform: "translate(0px, 0px)" }}>
            {this.props.clusterData.map(cluster => (
              <polygon
                points={cluster.concaveHull.map(point =>
                  this.getPointLocation(point)
                )}
                stroke="#222222"
                strokeWidth="17"
                strokeLinejoin="round"
                fill="#222222"
              />
            ))}
            {this.props.clusterData.map(cluster => {
              return (
                <Cluster
                  key={cluster.id}
                  cluster={cluster}
                  getLocation={p => this.getPointLocation(p, width, height)}
                  radius={radius}
                  highlightCat={highlightedCat =>
                    this.setState({ highlightedCat })
                  }
                  resetCat={() => this.setState({ highlightedCat: null })}
                  showProjectDetails={this.props.showProjectDetails}
                />
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
}
