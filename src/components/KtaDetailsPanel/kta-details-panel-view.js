import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { ReactComponent as KtaIcon } from "../../assets/Icon-WTA.svg";
import { getFieldColor, shortenString } from "../../util/utility";

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
  if (!props.kta) {
    return (
      <div className={style.DetailsWrapper}>
        <div className={style.DetailsTitle}>
          <div className={style.DetailsExit} onClick={props.returnToFilterView}>
            <Exit height={35} width={35} />
          </div>
        </div>
      </div>
    );
  }
  const project = props.kta.Drittmittelprojekt[0];
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
        <span className={style.titleText}>{props.kta.fulltext}</span>
      </div>
      <span className={style.infoItemTitle}>
        Zielgruppen: <br />
      </span>
      <div className={style.abstractText}>
        {props.targetgroups.map(tg => (
          <span
            href="#"
            onClick={() => props.showCatDetails(tg.id)}
            key={tg.id}
            className={style.DetailsLink}
          >
            {tg.name}
            <br />
          </span>
        ))}
      </div>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Format: <br />
        </span>
        {props.kta.Format.map(format => format.name).join(", ")}
      </p>
      <p className={style.infoItems}>
        <span className={style.infoItemTitle}>
          Organisationseinheit: <br />
        </span>
        {props.kta.Organisationseinheit}
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
        {props.kta.Beschreibung[0].split("https://")[0]}
      </div>
      {project && (
        <span className={style.infoItemTitle}>
          Assoziierte Forschungsprojekte:
          <br />
        </span>
      )}
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
            {shortenString(project.displaytitle, 58)}
          </span>
        )}
      </p>
      <div
        className={style.DetailsViaLink}
        onClick={() => props.openViaWiki(props.kta.fullurl)}
      >
        Anzeigen im VIA-Wiki
      </div>
    </div>
  );
};
//props.showDetails(con.id)
export default KtaDetailsPanel;
