import React from "react";
import style from "./geo-map-view.module.css";
import { ReactComponent as Africa } from "../../assets/GeoMap/continents/africa.svg";
import { ReactComponent as Europe } from "../../assets/GeoMap/continents/europe.svg";
import { ReactComponent as NorthAmerica } from "../../assets/GeoMap/continents/north-america.svg";
import { ReactComponent as SouthAmerica } from "../../assets/GeoMap/continents/south-america.svg";
import { ReactComponent as Asia } from "../../assets/GeoMap/continents/asia.svg";
import { ReactComponent as Australia } from "../../assets/GeoMap/continents/australia.svg";

const continents = [
  {
    name: "Nordamerika",
    svg: <NorthAmerica />,
    xOffset: 61.4,
    yOffset: 53.1,
    mapWidth: 378,
    mapHeight: 384,
    longMin: -168.1311,
    longMax: -11.39,
    latMin: 7.322,
    latMax: 83.5702,
    institutionCount: 0
  },
  {
    name: "Südamerika",
    svg: <SouthAmerica />,
    xOffset: 97.8,
    yOffset: 96,
    mapWidth: 330,
    mapHeight: 384,
    longMin: -81.2897,
    longMax: -26.2463,
    latMin: -59.473,
    latMax: 12.6286,
    institutionCount: 0
  },
  {
    name: "Europa",
    svg: <Europe />,
    xOffset: 97.8,
    yOffset: 48.4,
    mapWidth: 292,
    mapHeight: 384,
    longMin: -10.6,
    longMax: 40.166,
    latMin: 34.8888,
    latMax: 71.27,
    institutionCount: 0
  },
  {
    name: "Asien",
    svg: <Asia />,
    xOffset: 63.1,
    yOffset: 55.4,
    mapWidth: 383,
    mapHeight: 387,
    longMin: 20.01,
    longMax: 189.82,
    latMin: -22.147,
    latMax: 81.328,
    institutionCount: 0
  },
  {
    name: "Afrika",
    svg: <Africa />,
    xOffset: 75.8,
    yOffset: 61.2,
    mapWidth: 348,
    mapHeight: 394,
    longMin: -17.537,
    longMax: 51.412,
    latMin: -34.822,
    latMax: 37.34,
    institutionCount: 0
  },
  {
    name: "Australien",
    svg: <Australia />,
    xOffset: 97.8,
    yOffset: 96,
    mapWidth: 330,
    mapHeight: 384,
    longMin: 112.9511,
    longMax: 159.1019,
    latMin: -54.749,
    latMax: -10.0516,
    institutionCount: 0
  }
];

const getInstitutionFromId = (institutionsList, id) =>
  institutionsList.find(institution => institution.id === id);

const distance = (continent, instiution) =>
  Math.sqrt(
    Math.pow(continent.centroidX - instiution.long, 2) +
      Math.pow(continent.centroidY - instiution.lat, 2)
  );
const disambiguateContinents = (candidates, institution) =>
  candidates.sort(
    (a, b) => distance(a, institution) - distance(b, institution)
  );
const getContinentOfInstitution = (continentList, institution) => {
  if (!institution) return null;
  if (institution.continent) {
    return institution.continent;
  }
  const candidates = continentList.filter(
    con =>
      con.longMin < institution.lon &&
      con.longMax > institution.lon &&
      con.latMin < institution.lat &&
      con.latMax > institution.lat
  );
  if (candidates.length === 0) {
    return "";
  }
  if (candidates.length > 1) {
    disambiguateContinents(candidates, institution);
  }
  institution.continent = candidates[0].name;
  candidates[0].institutionCount += 1;
  return institution.continent;
};

const mapLongToWidth = (width, continent, long) =>
  ((-continent.longMin + long) * width) /
  (continent.longMax - continent.longMin);
const distanceToEquator = lat => Math.asinh(Math.tan(lat * (Math.PI / 180)));
const mapLatToHeight = (height, continent, lat) =>
  ((distanceToEquator(lat) - distanceToEquator(continent.latMin)) * height) /
  Math.abs(
    distanceToEquator(continent.latMax) - distanceToEquator(continent.latMin)
  );

const edgesFromClique = clique => {
  let pairs = [];
  clique.forEach((v1, i) => {
    clique.slice(i + 1).forEach(v2 => {
      pairs.push([v1, v2]);
    });
  });
  return pairs;
};

//EXPECTS: institutions, projects, width, height, onProjectClickHandler
const GeoMapView = props => {
  const { projects, height } = props;
  if (isNaN(height) || projects == null) {
    return <div />;
  }
  let institutions = props.institutions;
  institutions = institutions.map(ins => Object.assign(ins));
  institutions = institutions.filter(ins => ins.lon && ins.lat);
  const width = props.width ? props.width : 1000;
  const institution = id => getInstitutionFromId(institutions, id);
  continents.forEach((c, i) => {
    c.anchorPoint = (width / 12) * (i * 2 + 1);
    c.centroidX = (c.longMax + c.longMin) / 2;
    c.centroidY = (c.latMax + c.latMin) / 2;
  });
  const continent = inst => getContinentOfInstitution(continents, inst);

  let connections = [];
  let institutionsInProjects = {};
  const appendInstitutionsInProjects = ins => {
    if (ins && !institutionsInProjects[ins.id]) {
      institutionsInProjects[ins.id] = Object.assign(ins);
    }
  };

  projects.forEach(project => {
    if (!institution(project.institution_id)) {
      return;
    }
    appendInstitutionsInProjects(institution(project.institution_id));
    const cooperatingInstitutions = project.cooperating_institutions.filter(
      ins => ins
    );
    cooperatingInstitutions.forEach(id =>
      appendInstitutionsInProjects(institution(id))
    );
    if (cooperatingInstitutions.length > 0) {
      connections = connections.concat(
        edgesFromClique(
          cooperatingInstitutions.concat([project.institution_id])
        )
      );
    }
    continent(institution(project.institution_id));
    cooperatingInstitutions.forEach(c => continent(institution(c)));
  });
  let continentConnections = {};
  connections.forEach(con => {
    if (!institution(con[0]) || !institution(con[1])) {
      return;
    }
    const continent1 = institution(con[0]).continent;
    const continent2 = institution(con[1]).continent;
    if (continent1 && continent2 && continent1 !== continent2) {
      const key = JSON.stringify([continent1, continent2].sort());
      if (!continentConnections[key]) {
        continentConnections[key] = {
          start: continents.find(c => continent1 === c.name).anchorPoint,
          end: continents.find(c => continent2 === c.name).anchorPoint,
          weight: 1
        };
      } else {
        continentConnections[key].weight += 1;
      }
    }
  });

  let ktas = props.ktas.filter(kta =>
    props.projects.find(
      p =>
        p.id === kta.project_id &&
        p.cooperating_institutions &&
        p.cooperating_institutions[0] !== null
    )
  );

  ktas = ktas.map(kta => ({
    ...kta,
    institutions: props.projects
      .find(p => p.id === kta.project_id)
      .cooperating_institutions.map(inst =>
        institution(inst) ? institution(inst).name : ""
      )
  }));

  let ktaInstitutions = institutions
    .map(inst => ({
      ...inst,
      ktaCount: ktas.filter(kta => kta.institutions.includes(inst.name)).length
    }))
    .sort((a, b) => b.ktaCount - a.ktaCount)
    .slice(0, 10);
  let maxCircle = 15;
  console.log(maxCircle);
  const arcHeight = height * 0.4;
  return (
    <div
      data-intro="Somit kann in dieser Ansicht einerseits die internationale Verknüpfung des Museums für Naturkunde in der Forschung betrachtet, und andererseits konkret mit Wissenstransferaktivitäten in Bezug gesetzt werden. "
      data-step="4"
    >
      <div
        className={style.geoViewWrapper}
        style={{ width: width, height: height }}
        data-intro="In der Ansicht <b>RAUM</b> wird eine weitere internationale Perspektive auf Wissenstransferaktivitäten und Drittmittelprojekte ermöglicht Hier lässt sich zum Beispiel ablesen, wann und wie Wissenstransfer aus Projekten in Kooperation mit anderen Institutionen durchgeführt wurde."
        data-step="1"
      >
        <span className={style.plotTitle}>Wissenstransferaktivitäten</span>
        <div
          className={style.tableWrapper}
          data-intro="Im oberen Teil der Ansicht werden <b>Wissenstransferaktivitäten</b> angezeigt, welche aus international vernetzten Forschungsprojekten hervorgegangen sind. Die Größe des Kreises deutet die Menge der Wissenstransferaktivitäten in bestehenden Kooperationen an."
          data-step="2"
        >
          <table>
            {ktaInstitutions.map((inst, i) => {
              return (
                <tr>
                  <td className={style.instText}>{inst.name}</td>
                  <td>
                    <svg
                      height={maxCircle * 2}
                      fill="transparent"
                      width={maxCircle * 2}
                    >
                      <circle
                        className={style.ktaCountCircle}
                        cx={maxCircle}
                        cy={maxCircle}
                        r={inst.ktaCount}
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>

        <div className={style.description}>
          Wissenstransferaktivitäten in Projekten nach Kooperation
        </div>
        <span className={style.plotTitle}>Forschungsprojekte</span>
        <div
          className={style.arcWrapper}
          data-intro="Im unteren Teil der Ansicht werden <b>Forschungsprojekte als Bögen</b> zwischen Kontinenten visualisiert. Hierdurch tritt die internationale Kooperation, die in vielen Projekten stattfindet, in den Vordergrund. Der grüne Punkt repräsentiert hier das Museum für Naturkunde, welches den Ausgang für jedes Projekt bildet."
          data-step="3"
        >
          <svg width={width} height={arcHeight}>
            {Object.values(continentConnections).map(con => (
              <path
                d={`M${con.end},${arcHeight} C${con.end},${arcHeight -
                  Math.abs(con.end - con.start) * 0.63} ${
                  con.start
                },${arcHeight - Math.abs(con.end - con.start) * 0.63} ${
                  con.start
                },${arcHeight}`}
                stroke="white"
                strokeWidth={con.weight * 0.5}
                fill="none"
                opacity={0.4}
                key={JSON.stringify([con.start, con.end])}
              />
            ))}
          </svg>
        </div>
        <div className={style.labelWrapper}>
          {continents
            .filter(c => c.institutionCount > 0)
            .map(c => {
              const instititutionsOnContinent = Object.values(
                institutionsInProjects
              ).filter(ins => ins.continent === c.name);
              return (
                <div
                  className={style.continentLabel}
                  key={c.name}
                  style={{ left: c.anchorPoint }}
                >
                  {c.name + " "}({instititutionsOnContinent.length})
                  {c.name === "Europa" && (
                    <div className={style.mfnCircle}>Museum für Naturkunde</div>
                  )}
                </div>
              );
            })}
        </div>
        <div className={style.mapsWrapper}>
          {continents
            .filter(c => c.institutionCount > 0)
            .map(c => {
              const instititutionsOnContinent = Object.values(
                institutionsInProjects
              ).filter(ins => ins.continent === c.name);
              return (
                <div className={style.continentWrapper} key={c.name}>
                  <svg width={width / 6} viewBox={"0 0 500 500"}>
                    <g fill={"#aaa"}>{c.svg}</g>
                    <g
                      transform={`translate(${c.xOffset}, ${c.yOffset})`}
                      fill="transparent"
                    >
                      {instititutionsOnContinent.map(ins => (
                        <circle
                          fill={"red"}
                          cx={mapLongToWidth(c.mapWidth, c, ins.lon)}
                          cy={
                            c.mapHeight -
                            mapLatToHeight(c.mapHeight, c, ins.lat)
                          }
                          r={5}
                          key={ins.name + ins.id}
                        />
                      ))}
                    </g>
                  </svg>
                </div>
              );
            })}
        </div>

        <div className={style.description}>
          Forschungsprojekte nach internationaler Kooperation
        </div>
      </div>
    </div>
  );
};

export default GeoMapView;
