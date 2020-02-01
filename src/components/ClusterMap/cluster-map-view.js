import React from "react";

import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";
import IconExplanation from "./icon-explanation";

import UncertaintyExplanation from "./uncertainty-explanation";
import HoverPopover from "../HoverPopover/HoverPopover";
import ClusterContoursMap from "./cluster-contours-map";
import TouchEventHandler from "../../util/touch-event-handler";
const arcMarginSides = (width, scale) => Math.min(0.2 * width, 0.2 * scale);
const clusterSize = scale => 0.45 * scale;
const clusterPosX = (width, scale) => 0.5 * width - clusterSize(scale) / 2;
const clusterPosY = (height, scale) => 0.5 * height - clusterSize(scale) / 2;
const fontSizeText = scale => 0.014 * scale;
const fontSizeCount = scale => 0.01 * scale;
const textOffsetFromArc = scale => 0.04 * scale;
const countOffsetFromArc = scale => 0.025 * scale;
const connectionOffsetFromArc = scale => -0.02 * scale;
const circleScaling = scale => 0.02 * scale;
const strokeWidth = scale => 0.001 * scale;
const contoursSize = 600;

export default class ClusterMapView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      highlightedCats: [],
      highlightedLinks: [],
      highlightedProjects: [],
      highlightedInfs: [],
      uncertaintyHighlight: false
    };

    this.highlightCat = this.highlightCat.bind(this);
    this.highlightProject = this.highlightProject.bind(this);
    this.highlightInfrastructure = this.highlightInfrastructure.bind(this);
    this.unHighlight = this.unHighlight.bind(this);
    this.renderHover = this.renderHover.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedProject) {
      return {
        highlightedProjects: state.highlightedProjects.concat([
          props.selectedProject
        ])
      };
    } else if (props.highlightedGroup) {
      const g = props.highlightedGroup;
      return {
        highlightedCats: g.includes("categories") ? props.categories : [],
        uncertaintyHighlight: g.includes("uncertainty"),
        highlightedInfs:
          g.includes("collection") || g.includes("infrastructure")
            ? props.InfrastrukturSorted.filter(inf => g.includes(inf.type))
            : [],
        highlightedProjects: g.includes("projects")
          ? props.clusterData.flat().projects.map(p => p.id)
          : state.highlightedProjects
      };
    } else {
      return null;
    }
  }
  get maxX() {
    return Math.max(
      ...this.props.clusterData
        .map(c => c.projects.map(p => p.location[0]))
        .flat()
    );
  }

  get maxY() {
    return Math.max(
      ...this.props.clusterData
        .map(c => c.projects.map(p => p.location[1]))
        .flat()
    );
  }

  unHighlight() {
    this.setState({
      highlightedCats: [],
      highlightedLinks: [],
      highlightedProjects: [],
      highlightedInfs: [],
      hoverText: undefined,
      uncertaintyHighlight: false
    });
  }

  highlightCat(category) {
    if (this.props.selectedCat) {
      this.setState({
        highlightedCats: [this.props.selectedCat],
        highlightedLinks: this.findLinksByCat(
          this.props.categories.find(cat => cat.id === this.props.selectedCat)
        ),
        highlightedProjects: this.findProjectsByCat(
          this.props.categories.find(cat => cat.id === this.props.selectedCat)
        )
      });
    } else if (!(this.props.selectedInfra || this.props.selectedProject)) {
      this.setState({
        highlightedCats: [category],
        highlightedLinks: this.findLinksByCat(category),
        highlightedProjects: this.findProjectsByCat(category)
      });
    }
  }

  highlightInfrastructure(inf) {
    if (this.props.selectedInfra) {
      this.setState({
        highlightedLinks: this.findLinksByInf(
          this.props.InfrastrukturSorted.find(
            inf => inf.name === this.props.selectedInfra
          )
        ),
        highlightedProjects: this.findProjectsByInf(
          this.props.InfrastrukturSorted.find(
            inf => inf.name === this.props.selectedInfra
          )
        ),
        highlightedInfs: [this.props.selectedInfra]
      });
    } else if (!(this.props.selectedCat || this.props.selectedProject)) {
      this.setState({
        highlightedLinks: this.findLinksByInf(inf),
        highlightedProjects: this.findProjectsByInf(inf),
        highlightedInfs: [inf]
      });
    }
  }

  highlightProject(project, title) {
    this.setState({
      highlightedCats: this.findCatsByProject(project),
      highlightedLinks: this.findLinksByProject(project),
      highlightedInfs: this.findInfsByProject(project),
      highlightedProjects: [project],
      hoverText: title
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
      .map(cat => project + "|" + cat.id)
      .concat(
        this.props.InfrastrukturSorted.filter(inf =>
          inf.connections.find(con => con.id === project)
        ).map(inf => project + "|" + inf.name)
      );
  }

  findCatsByProject(project) {
    return this.props.categories.filter(cat =>
      cat.connections.find(con => con.id === project)
    );
  }

  findInfsByProject(project) {
    return this.props.InfrastrukturSorted.filter(inf =>
      inf.connections.find(con => con.id === project)
    );
  }

  findLinksByInf(inf) {
    return inf.connections.length > 0
      ? inf.connections.map(con => con.id + "|" + inf.name)
      : [];
  }

  findProjectsByInf(inf) {
    return inf.connections
      .map(con => con.id)
      .concat(this.props.selectedProject);
  }

  splitLongTitles = title => {
    var words = title.split(/[\s-]+/);
    var newtext = [words[0]];
    for (let i = 1; i < words.length; i++) {
      if (newtext[newtext.length - 1].length < 16) {
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

  renderHover() {
    return (
      this.state.hoverText &&
      this.state.mouseLocation && (
        <HoverPopover
          width={"15em"}
          height="20px"
          locationX={this.state.mouseLocation[0]}
          locationY={this.state.mouseLocation[1]}
        >
          <p
            style={{
              position: "absolute",
              backgroundColor: "#1c1d1f",
              margin: "0",
              fontSize: "10px",
              color: "#afca0b",
              fontWeight: "500",
              letterSpacing: "1px",
              overflow: "hidden",
              padding: "5px 10px"
            }}
          >
            <label>{this.state.hoverText}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const { categories, width, height, InfrastrukturSorted } = this.props;
    this.scale = Math.min(height, width);
    const scale = this.scale;
    if (categories.length === 0 || !width || !height || scale <= 0) {
      return <div />;
    }
    const shiftX = width / 2;
    const shiftY = height / 2;
    const radius = scale * 0.5 - arcMarginSides(width, scale);
    const each = 360 / (categories.length + InfrastrukturSorted.length);
    const sortedTargetgroups = categories.sort((a, b) =>
      a.title < b.title ? 1 : -1
    );
    const conMax = Math.max(...categories.map(o => o.count), 0);
    return (
      <div
        className={style.clusterMapWrapper}
        style={{
          width: this.props.width,
          height: this.props.height
        }}
      >
        <IconExplanation
          posX={20}
          posY={height - 140}
          setHighlightState={this.props.setHighlightState}
          unHighlight={this.unHighlight}
        />
        <UncertaintyExplanation
          posX={width - 190}
          posY={20}
          setHighlightState={this.props.setHighlightState}
          unHighlight={this.unHighlight}
        />
        <svg
          className="viz-3"
          viewBox={"0 0 " + width + " " + height}
          width={width}
          height={height}
        >
          <ClusterContoursMap
            width={this.props.width}
            height={this.props.height}
            topography={this.props.topography}
            contoursSize={contoursSize}
            clusterSize={clusterSize}
            clusterX={clusterPosX}
            clusterY={clusterPosY}
            isHighlighted={this.state.uncertaintyHighlight}
          />
          <g>
            {sortedTargetgroups.map((cat, i) => {
              const startAngle = each * i - sortedTargetgroups.length * each;
              const angle = startAngle * (Math.PI / 180);
              const conLen = cat.count;
              const x = shiftX + radius * Math.cos(angle);
              const y = shiftY + radius * Math.sin(angle);
              const isHighlighted =
                this.state.highlightedCats.find(hcat => hcat.id === cat.id) ||
                this.props.selectedCat === cat.id;
              const higlightOffset = isHighlighted ? 7 : 0;
              const textX =
                shiftX +
                (radius + higlightOffset + textOffsetFromArc(scale)) *
                  Math.cos(angle);
              const textY =
                shiftY +
                (radius + higlightOffset + textOffsetFromArc(scale)) *
                  Math.sin(angle);
              const lenX =
                shiftX + (radius + countOffsetFromArc(scale)) * Math.cos(angle);
              const lenY =
                shiftY + (radius + countOffsetFromArc(scale)) * Math.sin(angle);
              const anchor = startAngle < -90 ? "end" : "start";
              const textRotate =
                startAngle < -90 ? startAngle + 180 : startAngle;

              const area = (conLen * 1.2) / conMax;
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
                  const midRadius = radius / 1.5;
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
                  <TouchEventHandler
                    onShortPress={() => this.highlightCat(cat)}
                    onLongPress={() => {
                      this.highlightCat(cat);
                      this.props.showCatDetails(cat.id);
                    }}
                    longPressThreshold={400}
                  >
                    <g>
                      <circle
                        id={`cat-${cat.id}`}
                        r={rad}
                        cx={x}
                        cy={y}
                        cursor="POINTER"
                        stroke={isHighlighted ? "#afca0b" : "#6B6B6B"}
                        fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                      />
                      <text
                        x={lenX}
                        y={lenY}
                        textAnchor="middle"
                        fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                        fontSize={
                          fontSizeCount(this.scale) * (isHighlighted ? 1.2 : 1)
                        }
                        fontWeight="700"
                        cursor="POINTER"
                      >
                        {conLen}
                      </text>
                      <text
                        textAnchor={anchor}
                        fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                        fontSize={
                          fontSizeText(this.scale) * (isHighlighted ? 1.2 : 1)
                        }
                        fontWeight="700"
                        cursor="POINTER"
                        transform={`rotate(${textRotate} ${textX} ${textY})`}
                      >
                        {this.splitLongTitles(cat.title).map((titlePart, i) => (
                          <tspan x={textX} y={textY + i * 10} key={titlePart}>
                            {titlePart}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  </TouchEventHandler>
                  <g>
                    {lines.map((line, i) => (
                      <g key={i}>
                        <path
                          pointerEvents="none"
                          key={i + "a"}
                          strokeWidth={strokeWidth(scale) * 3}
                          fill="transparent"
                          stroke={
                            this.state.highlightedLinks.find(
                              hline => hline === line[4]
                            )
                              ? "rgba(175, 202, 11, 0.1)"
                              : "rgba(100,100,100,0.1)"
                          }
                          d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                        />
                        <path
                          pointerEvents="none"
                          key={i + "b"}
                          strokeWidth={strokeWidth(scale)}
                          fill="transparent"
                          stroke={
                            this.state.highlightedLinks.find(
                              hline => hline === line[4]
                            )
                              ? "rgba(175, 202, 11, 0.5)"
                              : "rgba(255,255,255,0.1)"
                          }
                          d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                        />
                      </g>
                    ))}
                  </g>
                </g>
              );
            })}

            <g>
              {InfrastrukturSorted.map((infrastruktur, i) => {
                const startAngle = each * i;
                const angle = startAngle * (Math.PI / 180);
                const x = shiftX - 6 + radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                const isHighlighted =
                  this.state.highlightedInfs.find(
                    hinf => hinf.name === infrastruktur.name
                  ) || this.props.selectedInfra === infrastruktur.name;
                const higlightOffset = isHighlighted ? 7 : 0;
                const textX =
                  shiftX +
                  (radius + higlightOffset + countOffsetFromArc(scale)) *
                    Math.cos(angle);
                const textY =
                  shiftY +
                  (radius + higlightOffset + countOffsetFromArc(scale)) *
                    Math.sin(angle);
                const anchor = startAngle > 90 ? "end" : "start";
                const textRotate =
                  startAngle > 90 ? startAngle + 180 : startAngle;

                let lines = [];
                if (infrastruktur.connections) {
                  lines = infrastruktur.connections.map(con => {
                    const target = this.getPointLocation(
                      con.location,
                      width,
                      height
                    );
                    const angleDeg = startAngle;
                    const angle = angleDeg * (Math.PI / 180);
                    const sourceX =
                      shiftX +
                      (radius + connectionOffsetFromArc(scale)) *
                        Math.cos(angle);
                    const sourceY =
                      shiftY +
                      (radius + connectionOffsetFromArc(scale)) *
                        Math.sin(angle);
                    const midRadius = radius / 1.5;
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
                      con.id + "|" + infrastruktur.name
                    ];
                  });
                }
                return (
                  <TouchEventHandler
                    onShortPress={() =>
                      this.highlightInfrastructure(infrastruktur)
                    }
                    onLongPress={() => {
                      this.highlightInfrastructure(infrastruktur);
                      this.props.showInfraDetails(infrastruktur.name);
                    }}
                    longPressThreshold={400}
                  >
                    <g key={infrastruktur.name}>
                      <g>
                        <g>
                          {infrastruktur.type === "collection" ? (
                            <CollectionIcon
                              style={{ cursor: "POINTER" }}
                              id={`inf-${infrastruktur.name}`}
                              x={x}
                              y={y}
                              width={fontSizeText(this.scale) * 1.3}
                              heigth={fontSizeText(this.scale) * 1.3}
                              fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                              stroke={isHighlighted ? "#afca0b" : "#6B6B6B"}
                            />
                          ) : (
                            <InfrastructureIcon
                              style={{ cursor: "POINTER" }}
                              id={`inf-${infrastruktur.name}`}
                              x={x}
                              y={y}
                              width={fontSizeText(this.scale) * 1.3}
                              heigth={fontSizeText(this.scale) * 1.3}
                              fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                              stroke={isHighlighted ? "#afca0b" : "#6B6B6B"}
                            />
                          )}
                        </g>
                        <text
                          x={textX}
                          y={textY}
                          textAnchor={anchor}
                          fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                          fontSize={
                            fontSizeText(this.scale) * (isHighlighted ? 1.2 : 1)
                          }
                          fontWeight="700"
                          cursor="POINTER"
                          transform={`rotate(${textRotate} ${textX} ${textY})`}
                        >
                          {this.splitLongTitles(infrastruktur.name).map(
                            (titlePart, j) => (
                              <tspan
                                x={textX}
                                y={textY + j * 10}
                                key={titlePart}
                              >
                                {titlePart}
                              </tspan>
                            )
                          )}
                        </text>
                      </g>
                      <g>
                        {lines.map((line, i) => (
                          <g key={i}>
                            <path
                              pointerEvents="none"
                              key={i + "a"}
                              strokeWidth={strokeWidth(scale) * 3}
                              fill="transparent"
                              stroke={
                                this.state.highlightedLinks.find(
                                  hline => hline === line[4]
                                )
                                  ? "rgba(175, 202, 11, 0.1)"
                                  : "rgba(100,100,100,0.1)"
                              }
                              d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                            />
                            <path
                              pointerEvents="none"
                              key={i + "b"}
                              strokeWidth={strokeWidth(scale)}
                              fill="transparent"
                              stroke={
                                this.state.highlightedLinks.find(
                                  hline => hline === line[4]
                                )
                                  ? "rgba(175, 202, 11, 0.5)"
                                  : "rgba(255,255,255,0.1)"
                              }
                              d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                            />
                          </g>
                        ))}
                      </g>
                    </g>
                  </TouchEventHandler>
                );
              })}
            </g>
            <g
              data-step="1"
              data-intro="Das Herzstück der <b>WISSEN</b> Ansicht ist die Cluster-Darstellung von Drittmittelprojekten auf Basis algorithmischer Vergleiche von Projekt-Abstracts. Projekte sind nach ihren jeweiligen <b>Forschungsgebieten</b> eingefärbt um eine interdisziplinäre Perspektive auf die Forschung am Haus zu unterstützen. Hierdurch können Drittmittelprojekte basierend auf thematischen Gemeinsamkeiten interaktiv exploriert werden."
            >
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
                    showProjectDetails={this.props.showProjectDetails}
                    splitLongTitles={this.splitLongTitles}
                    selectedProject={this.props.selectedProject}
                  />
                );
              })}
            </g>
          </g>
        </svg>
        {this.renderHover()}
      </div>
    );
  }
}
