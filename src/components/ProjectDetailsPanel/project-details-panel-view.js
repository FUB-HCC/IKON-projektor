import React from "react";
import style from "./project-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { getFieldIcon, getFieldColor } from "../../util/utility";

const parseDescription = (string) => {
  string = string.replace(/ *„\[[^)]*\]“ */g, "");
  string = string.replace(/ *\[\[[^)]*\]\] */g, "");
  string = string.replace(/ *\[[^)]*\] */g, "");
  string = string.replace(/====/g, "'''");
  let result = string.split("'''");
  return result;
}
const parseList = (arr) => {
  if (arr[0].includes("Kein") ){
    return "Keine Daten";
  }
  return arr.map(x => x.replace(/,/, "")).join(", ");
}

const ProjectDetailsPanel = props => {
  let color = getFieldColor(props.projectData.forschungsbereich);
  let icon = getFieldIcon(props.projectData.forschungsbereich)
  let description = props.projectData.description ? parseDescription(props.projectData.description ): props.projectData.project_abstract;

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
            x="0px" y="0px"
            viewBox="0 0 100 100"
            fill={color}
            stroke={color}>
            <path d={icon}/>
          </svg>
          {props.projectData.title}
        </span>
      </div>
      <div>
        <p className={style.infoItems}>
          {"Organisationseinheit: " + props.projectData.organisationseinheit}
        </p>
        <p className={style.infoItems}>
          {"Forschungsgebiet: " + props.projectData.forschungsbereich + ", " + props.projectData.hauptthema}
        </p>
        <p className={style.infoItems}>
          {"Antragsteller: " + props.projectData.antragsteller}
        </p>
        <p className={style.infoItems}>
          {"Zeitraum: " + props.projectData.timeframe[0] + " bis " + props.projectData.timeframe[1]}
        </p>
        <h3 className={style.abstractTitle}>Beschreibung:</h3>
        <p className={style.abstractText}>
          {description.map( (part,i) => (
              <span key={i +" "+ props.projectData.id} className={style.abstractText}>
              {part}
              <br/><br/>
              </span>
            )
          )}
        </p>
        <p className={style.infoItems}>
          {"Genutzte Infrastruktur: " + parseList(props.projectData.infrastructure)}
        </p>
        <p className={style.infoItems}>
          {"Wissenstransferaktivität(en): Keine Daten"}
        </p>
        <p className={style.infoItems}>
          {"Bezug zu Sammlung: " + parseList(props.projectData.collections)}
        </p>
        <p className={style.infoItems}>
          {"Projektleiter: " + props.projectData.projektleiter}
        </p>
        <a className={style.projectDetailsLink} href={props.projectData.href}>Link to VIA</a>
      </div>
    </div>
  );
};

export default ProjectDetailsPanel;
