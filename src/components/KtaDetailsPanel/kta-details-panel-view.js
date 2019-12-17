import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { ReactComponent as KtaIcon } from "../../assets/Icon-WTA.svg";

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
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsExit} onClick={props.returnToFilterView}>
        <Exit height={35} width={35} />
      </div>
      <div className={style.DetailsTitle}>
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
            {cat.title + "\n"}
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
        {props.kta.project_id && (
          <span
            href="#"
            onClick={() => props.showProjectDetails(props.kta.project_id)}
            key={props.kta.project_id}
            className={style.DetailsLink}
          >
            {props.kta.project_id + "\n "}
          </span>
        )}
      </p>
      <a
        className={style.DetailsViaLink}
        href={props.kta.href}
        target="_blank"
        rel="noopener noreferrer" //got warning otherwise
      >
        Im VIA-Wiki anschauen
      </a>
    </div>
  );
};
//props.showDetails(con.id)
export default KtaDetailsPanel;
