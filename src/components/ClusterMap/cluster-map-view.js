import React from "react";

import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";
import IconExplanation from "./icon-explanation";

import UncertaintyExplanation from "./uncertainty-explanation";
import HoverPopover from "../HoverPopover/HoverPopover";
import ClusterContoursMap from "./cluster-contours-map";
import InteractionHandler from "../../util/interaction-handler";
const arcMarginSides = (width, scale) => Math.min(0.2 * width, 0.2 * scale);
const arcMarginTop = (height, scale) => Math.min(0.02 * height, 0.02 * scale);
const clusterSize = scale => 0.55 * scale;
const clusterPosX = (width, scale) => 0.5 * width - clusterSize(scale) / 2;
const clusterPosY = (height, scale) => 0.5 * height - clusterSize(scale) / 2;
const fontSizeText = scale => 0.012 * scale;
const fontSizeCount = scale => 0.009 * scale;
const textOffsetFromArc = scale => 0.04 * scale;
const countOffsetFromArc = scale => 0.025 * scale;
const connectionOffsetFromArc = scale => -0.02 * scale;
const circleScaling = scale => 0.02 * scale;
const strokeWidth = scale => 0.001 * scale;
const contoursSize = 200;

const splitLongTitles = title => {
  var words = title.split(/[\s-]+/);
  var newtext = [words[0]];
  for (let i = 1; i < words.length; i++) {
    if (newtext[newtext.length - 1].length <= 12) {
      newtext[newtext.length - 1] += " " + words[i];
    } else {
      newtext.push(words[i]);
    }
  }
  if (newtext.length > 2) {
    newtext[1] += "...";
    newtext[2] = "";
  }
  return newtext;
};

export default class ClusterMapView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hoverText: false
    };
    this.renderHover = this.renderHover.bind(this);
  }

  getPointLocation = (pt, width, height) => {
    const [x, y] = pt;
    const normalizedX = x / this.props.projectsMaxSizing[0];
    const normalizedY = y / this.props.projectsMaxSizing[1];

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
    const {
      targetgroups,
      width,
      height,
      collections,
      infrastructures,
      onCatHovered,
      onInfraHovered,
      onUnHovered,
      onCatClicked,
      onInfraClicked,
      onUnClicked,
      highlightedInfra,
      highlightedCats,
      highlightedProjects,
      clusterData,
      isAnyClicked,
      uncertaintyOn,
      uncertaintyHighlighted,
      isTouch
    } = this.props;
    this.scale = Math.min(height, width);
    const scale = this.scale;
    if (
      !targetgroups ||
      !collections ||
      !infrastructures ||
      !width ||
      !height ||
      scale <= 0
    ) {
      return <div />;
    }
    const shiftX = width / 2;
    const shiftY = height / 2;
    const radius = clusterSize(scale) - arcMarginSides(width, scale);
    const each =
      360 / (targetgroups.length + collections.length + infrastructures.length);
    const conMax = Math.max(...targetgroups.map(o => o.count), 0);
    return (
      <div
        className={style.clusterMapWrapper}
        style={{
          width: this.props.width,
          height: this.props.height,
          marginTop: arcMarginTop(height, scale)
        }}
      >
        <IconExplanation
          posX={20}
          posY={isTouch ? height - 100 : 20}
          category={targetgroups[0]}
          infrastructure={infrastructures}
          collection={collections}
        />
        <UncertaintyExplanation
          posX={width - 170}
          posY={20}
          uncertaintyOn={uncertaintyOn}
        />
        <svg
          className="viz-3"
          viewBox={"0 0 " + width + " " + height}
          width={width}
          height={height}
          onClick={isAnyClicked ? onUnClicked : null}
        >
          {uncertaintyOn && (
            <ClusterContoursMap
              width={this.props.width}
              height={this.props.height}
              topography={this.props.topography}
              contoursSize={contoursSize}
              clusterSize={clusterSize}
              clusterX={clusterPosX}
              clusterY={clusterPosY}
              uncertaintyHighlighted={uncertaintyHighlighted}
            />
          )}
          <g id="einzelklickIntro">
            {targetgroups.map((targetgroup, i) => {
              const startAngle = each * i - targetgroups.length * each;
              const angle = startAngle * (Math.PI / 180);
              const conLen = targetgroup.count;
              const x = shiftX + radius * Math.cos(angle);
              const y = shiftY + radius * Math.sin(angle);
              const isHighlighted = highlightedCats.includes(targetgroup.id);
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
              if (targetgroup.projects.length > 0) {
                lines = targetgroup.projects.map(project => {
                  const target = this.getPointLocation(
                    project.mappoint,
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
                  const lineHighlighted =
                    isHighlighted && highlightedProjects.includes(project.id);

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
                    lineHighlighted
                  ];
                });
              }
              return (
                <g key={targetgroup.id}>
                  <InteractionHandler
                    isInTouchMode={isTouch}
                    onMouseOver={() => onCatHovered(targetgroup.id)}
                    onMouseLeave={() => onUnHovered()}
                    onClick={() => {
                      onCatClicked(targetgroup.id);
                    }}
                    doubleTapTreshold={500}
                  >
                    <g>
                      <circle
                        id={`targetgroup-${targetgroup.id}`}
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
                          fontSizeCount(this.scale) * (isHighlighted ? 1.3 : 1)
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
                          fontSizeText(this.scale) * (isHighlighted ? 1.3 : 1)
                        }
                        fontWeight="700"
                        cursor="POINTER"
                        transform={`rotate(${textRotate} ${textX} ${textY})`}
                      >
                        {splitLongTitles(targetgroup.name).map(
                          (titlePart, i) => (
                            <tspan x={textX} y={textY + i * 10} key={titlePart}>
                              {titlePart}
                            </tspan>
                          )
                        )}
                      </text>
                    </g>
                  </InteractionHandler>
                  <g>
                    {lines.map((line, i) => (
                      <g key={i}>
                        <path
                          pointerEvents="none"
                          key={i + "b"}
                          strokeWidth={strokeWidth(scale) * 2}
                          fill="transparent"
                          stroke={
                            line[4]
                              ? "rgba(175, 202, 11, 0.5)"
                              : uncertaintyOn
                              ? "transparent"
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

            <g id="doppelklickIntro">
              {collections.concat(infrastructures).map((infrastruktur, i) => {
                const startAngle = each * i;
                const angle = startAngle * (Math.PI / 180);
                const x = shiftX - 6 + radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                const isHighlighted = highlightedInfra.includes(
                  infrastruktur.id
                );
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
                if (infrastruktur.projects.length > 0) {
                  lines = infrastruktur.projects.map(project => {
                    const target = this.getPointLocation(
                      project.mappoint,
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
                    const lineHighlighted =
                      isHighlighted && highlightedProjects.includes(project.id);

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
                      lineHighlighted
                    ];
                  });
                }
                return (
                  <g key={infrastruktur.id}>
                    <InteractionHandler
                      isInTouchMode={isTouch}
                      onMouseOver={() => onInfraHovered(infrastruktur.id)}
                      onMouseLeave={() => onUnHovered()}
                      onClick={() => {
                        onInfraClicked(infrastruktur.id);
                      }}
                      doubleTapTreshold={500}
                    >
                      <g>
                        <g>
                          {infrastruktur.Einleitung ? (
                            <InfrastructureIcon
                              style={{ cursor: "POINTER" }}
                              id={`inf-${infrastruktur.id}`}
                              x={x}
                              y={y}
                              width={fontSizeText(this.scale) * 1.3}
                              heigth={fontSizeText(this.scale) * 1.3}
                              fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                              stroke={isHighlighted ? "#afca0b" : "#6B6B6B"}
                            />
                          ) : (
                            <CollectionIcon
                              style={{ cursor: "POINTER" }}
                              id={`inf-${infrastruktur.id}`}
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
                          stroke={"none"}
                          textAnchor={anchor}
                          fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                          fontSize={
                            fontSizeText(this.scale) * (isHighlighted ? 1.3 : 1)
                          }
                          fontWeight="700"
                          cursor="POINTER"
                          transform={`rotate(${textRotate} ${textX} ${textY})`}
                        >
                          {splitLongTitles(infrastruktur.fulltext).map(
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
                    </InteractionHandler>
                    <g>
                      {lines.map((line, i) => (
                        <g key={i}>
                          <path
                            pointerEvents="none"
                            key={i + "b"}
                            strokeWidth={strokeWidth(scale) * 2}
                            fill="transparent"
                            stroke={
                              line[4]
                                ? "rgba(175, 202, 11, 0.5)"
                                : uncertaintyOn
                                ? "transparent"
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
            </g>
            <g
              data-step="1"
              id="clusterViewIntro"
              data-intro="Das Herzstück der <b>WISSEN</b> Ansicht ist die Cluster-Darstellung von Drittmittelprojekten auf Basis algorithmischer Vergleiche von Projekt-Abstracts. Projekte sind nach ihren jeweiligen <b>Forschungsgebieten</b> eingefärbt um eine interdisziplinäre Perspektive auf die Forschung am Haus zu unterstützen. Hierdurch können Drittmittelprojekte basierend auf thematischen Gemeinsamkeiten interaktiv exploriert werden."
            >
              {clusterData.map(cluster => {
                return (
                  <Cluster
                    isTouchMode={isTouch}
                    key={cluster.id + "cluster"}
                    cluster={cluster}
                    getLocation={p => this.getPointLocation(p, width, height)}
                    radius={radius}
                    highlightedProjects={highlightedProjects}
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
