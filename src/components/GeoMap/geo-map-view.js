import React from "react";
import style from "./geo-map-view.module.css";
import { ReactComponent as Africa } from "../../assets/GeoMap/continents/africa.svg";
import { ReactComponent as Europe } from "../../assets/GeoMap/continents/europe.svg";
import { ReactComponent as NorthAmerica } from "../../assets/GeoMap/continents/north-america.svg";
import { ReactComponent as SouthAmerica } from "../../assets/GeoMap/continents/south-america.svg";
import { ReactComponent as Asia } from "../../assets/GeoMap/continents/asia.svg";
import { ReactComponent as Australia } from "../../assets/GeoMap/continents/australia.svg";

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

    const arcHeight = height * 0.46;
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
            {Object.values(continentConnections).map((con, i) => (
              <path
                d={`M${con.start * width} ${arcHeight} A ${(Math.abs(
                  con.end - con.start
                ) *
                  width) /
                  2} ${(Math.abs(con.end - con.start) * width) /
                  2}  0 0 1 ${con.end * width} ${arcHeight} M ${con.start *
                  width} ${arcHeight} A ${(Math.abs(con.end - con.start) *
                  width) /
                  2} ${(Math.abs(con.end - con.start) * width) /
                  2}  0 0 0 ${con.end * width} ${arcHeight}`}
                stroke="white"
                strokeWidth={Math.max(3, con.weight * 0.5)}
                fill="none"
                opacity={0.4}
                className={style.arcHover}
                key={JSON.stringify([con.start, con.end])}
                onClick={() => {
                  this.props.showInstDetails(con.name);
                }}
              />
            ))}
          </svg>
        </div>
        <div
          className={style.mapsWrapper}
          data-step="3"
          data-intro="Die roten Punkte deuten an, wo sich die kooperierenden Institutionen auf den Kontinenten befinden. Der grüne Punkt repräsentiert hier das Museum für Naturkunde, welches den Ausgang für jede Kooperation bildet."
        >
          {continents
            .filter(c => c.institutionCount > 0)
            .map(c => {
              const instititutionsOnContinent = Object.values(
                institutions
              ).filter(ins => ins.continent === c.name);
              return (
                <div className={style.continentWrapper} key={c.name}>
                  <svg viewBox={"0 0 500 120"}>
                    <text
                      fill="#aaa"
                      x="50%"
                      y="100"
                      fontSize="400%"
                      key={c.name}
                      textAnchor="middle"
                    >
                      {c.name}
                    </text>
                  </svg>
                  <svg viewBox={"0 0 500 500"}>
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
          data-intro="Forschungsprojekte haben neben Kooperationen auch Regionen, auf welche der Fokus gelegt wird. Die Anzahl dieser kann man hier aufgeteilt auf die Kontinente sehen. Klicken Sie auf einen Kreis, um zu erfahren um welche Forschungsprojekte es sich handelt."
        >
          {continents.map((c, i) => {
            return (
              <svg width="16.66%" height="150" key={i + "region"}>
                <circle
                  cx="50%"
                  cy="50%"
                  className={style.countCircle}
                  r={Math.min(38, Math.max(5, c.forschungsregionCount))}
                  fill="#aaa"
                  onClick={() => {
                    this.props.showInstDetails(c.name + "|f");
                  }}
                />
              </svg>
            );
          })}
        </div>
      </div>
    );
  }
}
