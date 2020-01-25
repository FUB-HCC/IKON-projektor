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
  let description = props.projectData.description
    ? parseDescription(props.projectData.description)
    : props.projectData.project_abstract;

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
        <span className={style.titleText}>{props.projectData.title}</span>
      </div>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Organisationseinheit: <br />
        </span>
        {props.projectData.organisationseinheit}
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
          Antragsteller: <br />
        </span>
        {props.projectData.antragsteller}
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
      <span className={style.infoItemTitle}>
        Genutzte Infrastruktur: <br />
      </span>
      {props.projectData.infrastructures.length > 0 && (
        <p className={style.abstractText}>
          {props.projectData.infrastructures.map((con, i) => (
            <span
              href="#"
              onClick={() => props.showInfraDetails(con)}
              key={i + " " + con}
              className={style.DetailsLink}
            >
              {con}
            </span>
          ))}
        </p>
      )}
      <span className={style.infoItemTitle}>
        Bezug zu Sammlung: <br />
      </span>
      {props.projectData.collections.length > 0 && (
        <p className={style.abstractText}>
          {props.projectData.collections.map(con => {
            return (
              <span
                href="#"
                onClick={() => props.showInfraDetails(con)}
                key={con}
                className={style.DetailsLink}
              >
                {con}
              </span>
            );
          })}
        </p>
      )}
      <span className={style.infoItemTitle}>
        Wissenstransferaktivität(en): <br />
      </span>
      {props.ktas.length > 0 && (
        <p className={style.abstractText}>
          {props.ktas.map(kta => (
            <span
              href="#"
              onClick={() => props.showKtaDetails(kta.id)}
              key={kta.id}
              className={style.DetailsLink}
            >
              {kta.title}
            </span>
          ))}
        </p>
      )}
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Projektleiter: <br />
        </span>
        {props.projectData.projektleiter}
      </p>
      <a
        className={style.DetailsViaLink}
        href={props.projectData.href}
        target="_blank"
        rel="noopener noreferrer" //got warning otherwise
      >
        Im VIA-Wiki anschauen
      </a>
    </div>
  );
};

export default ProjectDetailsPanel;
