import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { ReactComponent as Icon } from "../../assets/Selected-Project.svg";
import { getFieldColor } from "../../util/utility";

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
  if (props.projectData == null) {
    return (
      <div className={style.DetailsWrapper}>
        <div className={style.DetailsExit} onClick={props.returnToFilterView}>
          <Exit height={35} width={35} />
        </div>
      </div>
    );
  }
  let color = getFieldColor(props.projectData.forschungsbereich);
  let description = props.projectData["Redaktionelle Beschreibung"]
    ? parseDescription(props.projectData["Redaktionelle Beschreibung"][0])
    : ["Keine Beschreibung vorhanden"];

  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsExit} onClick={props.returnToFilterView}>
        <Exit height={35} width={35} />
      </div>
      <div
        className={style.DetailsTitle}
        style={{ borderBottomColor: color, color: color }}
      >
        <Icon
          className={style.TitleIcon}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          fill={color}
          stroke={color}
        />
        <span className={style.titleTopic}>Forschungsprojekt</span> <br />
        <span className={style.titleText}>
          {props.projectData.displaytitle}
        </span>
      </div>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Organisationseinheit: <br />
        </span>
        {props.projectData.Organisationseinheit}
      </p>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Forschungsgebiet: <br />
        </span>
        {props.projectData.forschungsbereich +
          ", " +
          props.projectData.hauptthema}
      </p>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Kooperierende Institutionen: <br />
        </span>
        {props.projectData.Kooperationspartner.map(k => k.name).join(", ")}
      </p>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Antragsteller: <br />
        </span>
        {props.projectData["Antragstellende Person"]}
      </p>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Zeitraum: <br />
        </span>
        {props.projectData.timeframe[0] +
          " bis " +
          props.projectData.timeframe[1]}
      </p>
      <span className={style.infoItemTitle}>
        Beschreibung:
        <br />
      </span>
      <div className={style.abstractText}>
        {description.map((part, i) => (
          <p key={i}>{part}</p>
        ))}
      </div>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Projektleiter: <br />
        </span>
        {props.projectData.Projektleitung}
      </p>
    </div>
  );
};

export default ProjectDetailsPanel;
