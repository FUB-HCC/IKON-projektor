import React from "react";
import style from "./project-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { getIcon, getFieldColor } from "../../util/utility";

const parseDescription = string => {
  /* the text in via has a few (redundant?) formatting symbols and links to images etc.
  splitting on those that mark headings ("====", "'''") */
  string = string.replace(/ *„\[[^)]*\]“ */g, "");
  string = string.replace(/ *\[\[[^)]*\]\] */g, "");
  string = string.replace(/ *\[[^)]*\] */g, "");
  string = string.replace(/====/g, "'''");
  let result = string.split("'''");
  return result;
};

const ProjectDetailsPanel = props => {
  let color = getFieldColor(props.projectData.forschungsbereich);
  let icon = getIcon(1);
  let description = props.projectData.description
    ? parseDescription(props.projectData.description)
    : props.projectData.project_abstract;

  return (
    <div className={style.projectDetailsWrapper}>
      <div
        className={style.projectDetailsExit}
        onClick={props.returnToFilterView}
      >
        <Exit height={45} width={45} />
      </div>
      <div className={style.projectDetailsTitle}>
        <span className={style.titleText}>
          <svg
            className={style.projectDetailsIcon}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            fill={color}
            stroke={color}
          >
            <path d={icon} />
          </svg>
          {props.projectData.title}
        </span>
      </div>
      <div>
        <p className={style.infoItems}>
          {"Organisationseinheit: " + props.projectData.organisationseinheit}
        </p>
        <p className={style.infoItems}>
          {"Forschungsgebiet: " +
            props.projectData.forschungsbereich +
            ", " +
            props.projectData.hauptthema}
        </p>
        <p className={style.infoItems}>
          {"Antragsteller: " + props.projectData.antragsteller}
        </p>
        <p className={style.infoItems}>
          {"Zeitraum: " +
            props.projectData.timeframe[0] +
            " bis " +
            props.projectData.timeframe[1]}
        </p>
        <h3 className={style.abstractTitle}>Beschreibung:</h3>
        <p className={style.abstractText}>
          {description.map((part, i) => (
            <span
              key={i + " " + props.projectData.id}
              className={style.abstractText}
            >
              {part}
              <br />
              <br />
            </span>
          ))}
        </p>
        <p className={style.infoItems}>
          <span>Genutzte Infrastruktur: </span>
          {props.projectData.infrastructure.map((con, i) => (
            <span
              href="#"
              onClick={() => props.showInfraDetails(con)}
              key={i + " " + con}
            >
              {con}
              <br />
            </span>
          ))}
        </p>
        <p className={style.infoItems}>
          <span>Bezug zu Sammlung: </span>
          {props.projectData.collections.map(con => {
            return (
              <span
                href="#"
                onClick={() => props.showInfraDetails(con)}
                key={con}
              >
                {con}
                <br />
              </span>
            );
          })}
        </p>
        <p className={style.infoItems}>
          <span>Wissenstransferaktivität(en): </span>
          {props.ktas.map(kta => (
            <span
              href="#"
              onClick={() => props.showKtaDetails(kta.id)}
              key={kta.id}
              className={style.catLinkToItem}
            >
              {kta.title + ",\n "}
            </span>
          ))}
        </p>
        <p className={style.infoItems}>
          {"Projektleiter: " + props.projectData.projektleiter}
        </p>
        <a
          className={style.projectDetailsLink}
          href={props.projectData.href}
          target="_blank"
          rel="noopener noreferrer" //got warning otherwise
        >
          Link to VIA
        </a>
      </div>
    </div>
  );
};

export default ProjectDetailsPanel;
