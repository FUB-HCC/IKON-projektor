import React from "react";
import _ from "lodash";
import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";
import {contours as d3Contours}  from "d3-contour";
import {
  scaleLinear as d3ScaleLinear
} from "d3-scale";
import {extent as d3extent} from "d3-array";
//var spo = require('svg-path-outline');

const arcMarginSides = (width, scale) => Math.min(0.20 * width, 0.20 * scale);
const arcMarginTop = (height, scale) => Math.min(0.10 * height, 0.10 * scale);
const clusterSize = scale => 0.4 * scale;
const clusterPosX = (width, scale) => 0.5 * width - clusterSize(scale) / 2;
const clusterPosY = (height, scale) => 0.5 * height - clusterSize(scale) / 2;
//const clusterHullStrokeWidth = scale => 0.025 * scale;
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

  wrapText = (text) => {
    var newtext = [];
    var i = 0;
    var stop =0;
    for (let j=0; j< text.length; j++){
      if ((text[j] === " " && i >17) ){
        newtext.push(text.substring(stop,j+1));
        stop = j;
        i = 0;
      } if(j === text.length-1){
        newtext.push(text.substring(stop,j+1));
      }
      i++;
    }
    return newtext;
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

  scaleContours = (coords, width, height) => {
    var newConts = [];
    if(typeof coords[0] != "undefined"){
      for (var i = 0; i<coords[0].length; i++) {
        const [x, y] = coords[0][i];
        const nX = ((x/600)*clusterSize(this.scale)+clusterPosX(width, this.scale));
        const nY = ((y/600)*clusterSize(this.scale)+clusterPosY(height, this.scale));
        newConts[i] = [nX,nY];
      }
    }
    return newConts;
  }


  render() {
    const { categories, width, height } = this.props;

    var colorHeat = d3ScaleLinear()
        .domain(d3extent(this.props.topography))
        .range(["#000","#AAA"]);
    var contours = d3Contours().size([600,600]).smooth([true])(this.props.topography);
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
    const catsSort = _.sortBy(categories, x => x.title);
    const conMax = cats[0].count;

    // var ClusterHullPoints = [];
    // ClusterHullPoints = (this.props.clusterData.map(cluster =>  {
    //   return (cluster.concaveHull.map(point =>{
    //    return (this.getPointLocation(point, width, height));} ));}));

    // var clusterOutlines= ClusterHullPoints.map( clust => {
    //       return spo(("M" + clust[0] + "L" + clust.join(" L ")),clusterHullStrokeWidth(scale/2));
    //     });
    // mask="url(#clusterMask)"
    // <g>
    // {clusterOutlines.map( (clustOut,i) => {
    //   return [
    //     <path key={i} d={clustOut} fill="none" stroke="#fff" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2px" /> ]})}
    //
    // </g>
    // <g transform={"translate(0 " + arcMarginTop(height, scale) + ")"}>
    // {this.props.clusterData.map(cluster => (
    //   <polygon
    //     key={cluster.id}
    //     points={cluster.concaveHull.map(point =>
    //       this.getPointLocation(point, width, height)
    //     )}
    //     stroke="#fff"
    //     strokeWidth={clusterHullStrokeWidth(scale)}
    //     strokeLinejoin="round"
    //     opacity="0.5"
    //     fill="none"
    //   />
    // ))}
    // </g>
    // <defs>
    // <mask x="0" y="0" width="1" height="1" id="clusterMask">
    // <path d={ ClusterHullPoints.map( clust => {
    //       return "M" + clust[0] + "L" + clust;
    //     }) } fill="#fff" stroke="#fff" strokeLinejoin="round"             strokeWidth={clusterHullStrokeWidth(scale)} />
    // </mask>
    // </defs>

    return (
      <div className={style.clusterMapWrapper}>
        <svg
          className="viz-3"
          viewBox={"0 0 " + width + " " + height}
          width={width}
          height={height}
        >

        <g fill="none"
          transform={"translate(0 " + arcMarginTop(height, scale) + ")"}>
          {contours.map( cont => {
            return (
              <path className="isoline" key={cont.value}  d={
                cont.coordinates.map( coord => {
                  var coords = this.scaleContours(coord, width, height);
                  return("M" + coords[0] + "L" + coords);
                })
              } fill={colorHeat(cont.value)} />
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

            {catsSort.map((cat, i) => {
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
                    >{this.wrapText(cat.title)[0]}
                    </text>
                    <text
                      x={textX-3 }
                      y={textY+12}
                      textAnchor={anchor}
                      fill="white"
                      fontSize={
                        fontSizeText(this.scale) * (isHighlighted ? 1.2 : 1)
                      }
                      transform={`rotate(${textRotate} ${textX} ${textY})`}
                    >{this.wrapText(cat.title)[1]}
                    </text>
                  </g>
                  <g>
                    {lines.map((line, i) => (
                      <path
                        pointerEvents="none"
                        key={i}
                        strokeWidth={strokeWidth(scale)*3}
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
