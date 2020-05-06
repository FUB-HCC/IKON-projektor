import React from "react";
import style from "./geo-map-view.module.css";
import { ReactComponent as Africa } from "../../assets/GeoMap/continents/africa.svg";
import { ReactComponent as Europe } from "../../assets/GeoMap/continents/europe.svg";
import { ReactComponent as NorthAmerica } from "../../assets/GeoMap/continents/north-america.svg";
import { ReactComponent as SouthAmerica } from "../../assets/GeoMap/continents/south-america.svg";
import { ReactComponent as Asia } from "../../assets/GeoMap/continents/asia.svg";
import { ReactComponent as Australia } from "../../assets/GeoMap/continents/australia.svg";

import HoverPopover from "../HoverPopover/HoverPopover";

const continentSVGs = continent => {
  switch (continent) {
    case "Nordamerika": {
      return <NorthAmerica />;
    }
    case "Europa": {
      return <Europe />;
    }
    case "Asien": {
      return <Asia />;
    }
    case "Australien": {
      return <Australia />;
    }
    case "Afrika": {
      return <Africa />;
    }
    case "Südamerika": {
      return <SouthAmerica />;
    }
    default:
      return <Europe />;
  }
};
/* these functions translate the geolocations of institutions to the svg maps*/
const mapLongToWidth = (width, continent, lon) => {
  return (
    ((lon - continent.longMin) * width) /
    (continent.longMax - continent.longMin)
  );
};
const distanceToEquator = lat => Math.asinh(Math.tan(lat * (Math.PI / 180)));
const mapLatToHeight = (height, continent, lat) =>
  ((distanceToEquator(lat) - distanceToEquator(continent.latMin)) * height) /
  Math.abs(
    distanceToEquator(continent.latMax) - distanceToEquator(continent.latMin)
  );

export default class GeoMapView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hovered: false,
      mouseLocation: [0, 0]
    };
    this.renderHover = this.renderHover.bind(this);
  }

  renderHover(hovered, mouseLocation) {
    return (
      hovered && (
        <HoverPopover
          width={"15em"}
          height="20px"
          locationX={mouseLocation[0]}
          locationY={mouseLocation[1]}
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
            <label>{hovered}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const {
      institutions,
      continents,
      continentConnections,
      mfn,
      height,
      width
    } = this.props;
    if (isNaN(height) || !continents) {
      return <div />;
    }

    const usedContinents = continents.filter(c => c.institutionCount > 0)
      .length;
    const contWidth = width / usedContinents;
    const factor = (width * 6) / usedContinents;
    const arcHeight = height * 0.47;
    return (
      <div
        className={style.geoMapWrapper}
        style={{ width: width, height: height }}
        data-intro="In der Ansicht <b>RAUM</b> wird eine weitere internationale Perspektive auf Drittmittelprojekte ermöglicht. So können neue Potentiale aufgedeckt werden."
        data-step="1"
      >
        <span className={style.plotTitle}>
          <br /> Forschungsprojekte nach Kooperationen
        </span>
        <div
          className={style.arcWrapper}
          data-step="2"
          data-intro=" <b>Forschungsprojekte </b> werden als <b>Bögen</b> zwischen Kontinenten visualisiert. Hierdurch tritt die internationale Kooperation, die in vielen Projekten stattfindet, in den Vordergrund. Durch Klicken auf einen Bogen, erhält man eine Liste dieser."
        >
          <svg width={width} height={arcHeight}>
            {Object.values(continentConnections)
              .filter(con => con.weight > 0)
              .map((con, i) => (
                <path
                  d={`M${con.end * factor},${arcHeight} C${con.end *
                    factor},${arcHeight -
                    Math.abs(con.end - con.start) * 0.55 * factor} ${con.start *
                    factor},${arcHeight -
                    Math.abs(con.end - con.start) * 0.55 * factor} ${con.start *
                    factor},${arcHeight}`}
                  stroke="white"
                  strokeWidth={Math.max(3, con.weight * 0.5)}
                  style={{ transition: "stroke-Width 1s" }}
                  fill="none"
                  opacity={0.4}
                  className={style.arcHover}
                  key={JSON.stringify([con.start, con.end])}
                  onClick={() => {
                    this.props.showInstDetails(con.name);
                  }}
                  onMouseOver={evt => {
                    this.setState({
                      hovered:
                        con.weight +
                        " Kooperationen mit Institutionen in " +
                        con.name.split("|")[0] +
                        " und " +
                        con.name.split("|")[1],
                      mouseLocation: [
                        evt.nativeEvent.clientX,
                        evt.nativeEvent.clientY
                      ]
                    });
                  }}
                  onMouseLeave={() => {
                    this.setState({
                      hovered: false,
                      mouseLocation: [0, 0]
                    });
                  }}
                />
              ))}
          </svg>
        </div>
        <div
          className={style.mapsWrapper}
          data-step="3"
          data-intro="Die roten Punkte deuten an, wo sich die kooperierenden Institutionen auf den Kontinenten befinden. Durch das Anklicken eines Kontinents kann eine Liste dieser Institutionen aufgerufen werden."
        >
          {continents
            .filter(c => c.institutionCount > 0)
            .map(c => {
              const instititutionsOnContinent = Object.values(
                institutions
              ).filter(ins => ins.continent === c.name);
              return (
                <div className={style.continentWrapper} key={c.name}>
                  <svg viewBox={"0 0 500 120"} width={contWidth}>
                    <text
                      fill="#aaa"
                      x="50%"
                      y="100"
                      fontSize="300%"
                      key={c.name}
                      textAnchor="middle"
                    >
                      {c.name}
                    </text>
                  </svg>
                  <svg
                    viewBox={"0 0 500 500"}
                    onMouseOver={evt => {
                      this.setState({
                        hovered:
                          c.institutionCount +
                          " Kooperationspartner in " +
                          c.name,
                        mouseLocation: [
                          evt.nativeEvent.clientX,
                          evt.nativeEvent.clientY
                        ]
                      });
                    }}
                    onMouseLeave={() => {
                      this.setState({
                        hovered: false,
                        mouseLocation: [0, 0]
                      });
                    }}
                  >
                    <g
                      className={style.continentSVG}
                      onClick={() => {
                        this.props.showInstDetails(c.name + "|c");
                      }}
                    >
                      {continentSVGs(c.name)}
                    </g>
                    <g
                      transform={`translate(${c.xOffset}, ${c.yOffset})`}
                      fill="transparent"
                    >
                      {instititutionsOnContinent.map(ins => (
                        <circle
                          fill={ins.id === mfn.id ? "#afca0b" : "red"}
                          stroke="red"
                          cx={mapLongToWidth(c.mapWidth, c, ins.lon)}
                          cy={
                            c.mapHeight -
                            mapLatToHeight(c.mapHeight, c, ins.lat)
                          }
                          r={5}
                          key={ins.name + ins.id}
                          className={style.circle}
                        />
                      ))}
                    </g>
                  </svg>
                </div>
              );
            })}
        </div>{" "}
        <span className={style.plotTitle}>
          {" "}
          Forschungsprojekte nach Forschungsregionen (Geographische
          Verschlagwortung)
        </span>
        <div
          className={style.mapsWrapper}
          data-step="4"
          data-intro="Forschungsprojekte haben neben internationalen Kooperationspartnern auch Regionen, auf welche der Forschungsfokus gelegt wird. Die Anzahl dieser kann man hier aufgeteilt auf die Kontinente sehen. Klicken Sie auf einen Kreis, um zu erfahren um welche Forschungsprojekte es sich handelt."
        >
          {continents
            .filter(c => c.institutionCount > 0)
            .map((c, i) => {
              return (
                <svg width={contWidth} height="150" key={i + "region"}>
                  <circle
                    cx="50%"
                    cy="50%"
                    className={style.countCircle}
                    r={Math.min(40, c.forschungsregionCount * 1.2)}
                    style={{ transition: "r 1s" }}
                    fill="#aaa"
                    onClick={() => {
                      this.props.showInstDetails(c.name + "|f");
                    }}
                    onMouseOver={evt => {
                      this.setState({
                        hovered:
                          c.forschungsregionCount +
                          "  Forschungsregionen in " +
                          c.name,
                        mouseLocation: [
                          evt.nativeEvent.clientX,
                          evt.nativeEvent.clientY
                        ]
                      });
                    }}
                    onMouseLeave={() => {
                      this.setState({
                        hovered: false,
                        mouseLocation: [0, 0]
                      });
                    }}
                  />
                </svg>
              );
            })}
        </div>
        {this.renderHover(this.state.hovered, this.state.mouseLocation)}
      </div>
    );
  }
}
