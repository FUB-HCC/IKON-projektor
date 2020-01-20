import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { ReactComponent as KtaIcon } from "../../assets/Icon-WTA.svg";
import { getFieldColor } from "../../util/utility";

const zeitraum = timeframe => {
  if (timeframe[0].getFullYear() > 2000) {
    if (
      timeframe[1].getDate() !== timeframe[0].getDate() &&
      timeframe[1].getFullYear() > 2000
    ) {
      return (
        "Vom " +
        timeframe[0].toLocaleDateString() +
        " bis zum " +
        timeframe[1].toLocaleDateString()
      );
    } else {
      return timeframe[0].toLocaleDateString();
    }
  } else if (timeframe[1].getFullYear() > 2000) {
    return timeframe[1].toLocaleDateString();
  }
  return "Keine Daten";
};

const KtaDetailsPanel = props => {
  const project = props.categories.map(
    cat => cat.connections.find(con => con.id === props.kta.project_id).project
  )[0];
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsTitle}>
        <div className={style.DetailsExit} onClick={props.returnToFilterView}>
          <Exit height={35} width={35} />
        </div>
        <KtaIcon
          className={style.TitleIcon}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          fill="#aaa"
        />
        <span className={style.titleTopic}>Wissenstransferaktivität</span>{" "}
        <br />
        <span className={style.titleText}>{props.kta.title}</span>
      </div>
      <span className={style.infoItemTitle}>
        Zielgruppen: <br />
      </span>
      <div className={style.abstractText}>
        {props.categories.map(cat => (
          <span
            href="#"
            onClick={() => props.showCatDetails(cat.id)}
            key={cat.id}
            className={style.DetailsLink}
          >
            {cat.title}
            <br />
          </span>
        ))}
      </div>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Format: <br />
        </span>
        {props.kta.format}
      </p>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Organisationseinheit: <br />
        </span>
        {props.kta.organisational_unit}
      </p>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Zeitraum/Datum: <br />
        </span>
        {zeitraum(props.kta.timeframe)}
      </p>
      <span className={style.infoItemTitle}>
        Beschreibung:
        <br />
      </span>
      <div className={style.abstractText}>
        {props.kta.description.split("https://")[0]}
      </div>
      <span className={style.infoItemTitle}>
        Assoziierte Forschungsprojekte:
        <br />
      </span>
      <p className={style.infoItems}>
        {project && (
          <span
            href="#"
            onClick={() => props.showProjectDetails(project.id)}
            key={project.id}
            className={style.DetailsLink}
            style={{
              color: getFieldColor(project.forschungsbereich)
            }}
          >
            {project.title.length > 70
              ? project.title.substring(0, 70) + "..."
              : project.title}
          </span>
        )}
      </p>
      <a
        className={style.DetailsViaLink}
        href={props.kta.href}
        target="_blank"
        rel="noopener noreferrer" //got warning otherwise
      >
        Anzeigen im VIA-Wiki
      </a>
    </div>
  );
};
//props.showDetails(con.id)
export default KtaDetailsPanel;
