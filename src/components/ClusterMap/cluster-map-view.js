import React from "react";

import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";
import IconExplanation from "./icon-explanation";
import OverviewButton from "./overview-button";
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

/* splitting titles of categories and
infrastructure to fit in outer circle */
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
    this.renderHover = this.renderHover.bind(this);
  }

  // translate mappoint of projects to current screen size
  getPointLocation = (pt, width, height) => {
    const [x, y] = pt;
    const normalizedX = x * 0.9;
    const normalizedY = y * 0.9;

    return [
      normalizedX * clusterSize(this.scale) + clusterPosX(width, this.scale),
      normalizedY * clusterSize(this.scale) + clusterPosY(height, this.scale)
    ];
  };

  renderHover(pId) {
    let text = "";
    let mouseLocation = [0, 0];
    if (pId) {
      let project = this.props.clusterData
        .map(cluster => cluster.projects.find(project => project.id === pId))
        .find(p => p);
      text = project.displaytitle;
      mouseLocation = this.getPointLocation(
        project.mappoint,
        this.props.width,
        this.props.height
      );
    }
    return (
      pId && (
        <HoverPopover
          width={"15em"}
          height="20px"
          locationX={mouseLocation[0]}
          locationY={mouseLocation[1] - 30}
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
            <label>{text}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const {
      width,
      height,
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
      isTouch,
      isProjectHovered,
      filteredProjects,
      labels,
      filteredLabels,
      topography
    } = this.props;
    this.scale = Math.min(height, width);
    const scale = this.scale;
    if (!labels || !width || !height || scale <= 0) {
      return <div />;
    }

    const shiftX = width / 2;
    const shiftY = height / 2;

    const radius = clusterSize(scale) - arcMarginSides(width, scale);
    const each = 360 / labels.length;
    const conMax = Math.max(...labels.map(o => (o.count ? o.count : 0)), 0);

    return (
      <div
        className={style.clusterMapWrapper}
        style={{
          width: width,
          height: height,
          marginTop: arcMarginTop(height, scale)
        }}
      >
        <IconExplanation posX={20} posY={isTouch ? height - 100 : 20} />
        <OverviewButton posX={20} posY={height - 200} />
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
              width={width}
              height={height}
              topography={topography}
              contoursSize={contoursSize}
              clusterSize={clusterSize}
              clusterX={clusterPosX}
              clusterY={clusterPosY}
              uncertaintyHighlighted={uncertaintyHighlighted}
            />
          )}
          <g>
            {labels.map((label, i) => {
              /* computing the position of the label + icon + count */
              const startAngle =
                each * i - labels.filter(l => l.count).length * each;
              const angle = startAngle * (Math.PI / 180);

              var x = shiftX + radius * Math.cos(angle);
              var y = shiftY + radius * Math.sin(angle);
              var isHighlighted = highlightedCats.includes(label.id);
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

              const area = (label.count * 1.2) / conMax;
              const rad = Math.sqrt(area / Math.PI) * circleScaling(scale) || 1;
              if (!label.count) {
                x = shiftX - 6 + radius * Math.cos(angle);
                y = radius * Math.sin(angle);
                isHighlighted = highlightedInfra.includes(label.id);
              }

              const anchor =
                startAngle < -90 || startAngle > 90 ? "end" : "start";
              const textRotate =
                startAngle < -90 || startAngle > 90
                  ? startAngle + 180
                  : startAngle;

              /* for each link between a label (targetgroup,format,infrastructure or collection) and a project an svg path to connect them is computed (default: grey, highlighted: green, uncertainty on: transparent only visible on hover/click) */
              let lines = [];
              if (label.projects.length > 0) {
                lines = label.projects.map(project => {
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
                  const lineVisible =
                    filteredProjects.includes(project.id) &&
                    filteredLabels.includes(label.id);

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
                    lineHighlighted,
                    lineVisible
                  ];
                });
              }
              return (
                <g
                  key={label.id}
                  style={{
                    opacity: filteredLabels.includes(label.id) ? "1" : "0.3",
                    transition: "opacity 500ms"
                  }}
                >
                  {label.count && (
                    <InteractionHandler
                      isInTouchMode={isTouch}
                      onMouseOver={() => onCatHovered(label.id)}
                      onMouseLeave={() => onUnHovered()}
                      onClick={() => onCatClicked(label.id)}
                      doubleTapTreshold={500}
                    >
                      <g>
                        <circle
                          id={`label-${label.id}`}
                          r={rad}
                          cx={x}
                          cy={y}
                          cursor="POINTER"
                          stroke={isHighlighted ? "#afca0b" : "#6B6B6B"}
                          fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                          style={{
                            transition: "fill,stroke 500ms"
                          }}
                        />
                        <text
                          x={lenX}
                          y={lenY}
                          textAnchor="middle"
                          fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                          fontSize={
                            fontSizeCount(this.scale) *
                            (isHighlighted ? 1.3 : 1)
                          }
                          fontWeight="700"
                          cursor="POINTER"
                          style={{
                            transition: "fill,font-size 500ms"
                          }}
                        >
                          {label.count}
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
                          style={{
                            transition: "fill ,font-size 500ms"
                          }}
                        >
                          {splitLongTitles(label.name).map((titlePart, i) => (
                            <tspan x={textX} y={textY + i * 10} key={titlePart}>
                              {titlePart}
                            </tspan>
                          ))}
                        </text>
                      </g>
                    </InteractionHandler>
                  )}
                  {!label.count && (
                    <InteractionHandler
                      isInTouchMode={isTouch}
                      onMouseOver={() => onInfraHovered(label.id)}
                      onMouseLeave={() => onUnHovered()}
                      onClick={() => onInfraClicked(label.id)}
                      doubleTapTreshold={500}
                    >
                      <g>
                        <g>
                          {label.Einleitung ? (
                            <InfrastructureIcon
                              id={`inf-${label.id}`}
                              x={x}
                              y={y}
                              width={fontSizeText(this.scale) * 1.3}
                              heigth={fontSizeText(this.scale) * 1.3}
                              fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                              stroke={isHighlighted ? "#afca0b" : "#6B6B6B"}
                              style={{
                                cursor: "POINTER",
                                transition: "fill,stroke 500ms"
                              }}
                            />
                          ) : (
                            <CollectionIcon
                              id={`inf-${label.id}`}
                              x={x}
                              y={y}
                              width={fontSizeText(this.scale) * 1.3}
                              heigth={fontSizeText(this.scale) * 1.3}
                              fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                              stroke={isHighlighted ? "#afca0b" : "#6B6B6B"}
                              style={{
                                cursor: "POINTER",
                                transition: "fill,stroke 500ms"
                              }}
                            />
                          )}
                        </g>
                        <text
                          x={lenX}
                          y={lenY}
                          stroke={"none"}
                          textAnchor={anchor}
                          fill={isHighlighted ? "#afca0b" : "#6B6B6B"}
                          fontSize={
                            fontSizeText(this.scale) * (isHighlighted ? 1.3 : 1)
                          }
                          fontWeight="700"
                          cursor="POINTER"
                          transform={`rotate(${textRotate} ${lenX} ${lenY})`}
                          style={{
                            transition: "fill,font-size 500ms"
                          }}
                        >
                          {splitLongTitles(label.fulltext).map(
                            (titlePart, j) => (
                              <tspan x={lenX} y={lenY + j * 10} key={titlePart}>
                                {titlePart}
                              </tspan>
                            )
                          )}
                        </text>
                      </g>
                    </InteractionHandler>
                  )}

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
                              : uncertaintyOn || !line[5]
                              ? "rgba(0,0,0,0)"
                              : "rgba(255,255,255,0.1)"
                          }
                          d={`M${line[0].x},${line[0].y}C${line[1].x},${line[1].y},${line[2].x},${line[2].y},${line[3].x},${line[3].y} `}
                          style={{
                            transition: "stroke 500ms"
                          }}
                        />
                      </g>
                    ))}
                  </g>
                </g>
              );
            })}
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
                    filteredProjects={filteredProjects}
                  />
                );
              })}
            </g>
          </g>
        </svg>
        {this.renderHover(isProjectHovered)}
      </div>
    );
  }
}
