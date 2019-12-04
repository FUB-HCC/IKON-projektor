import React from "react";
import style from "./kta-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";

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
    <div className={style.projectDetailsWrapper}>
      <div
        className={style.projectDetailsExit}
        onClick={props.returnToFilterView}
      >
        <Exit height={45} width={45} />
      </div>
      <div className={style.projectDetailsTitle}>
        <span className={style.titleText}>{props.kta.title}</span>
      </div>

      <p className={style.infoItems}>
        <span>
          Zielgruppen: <br />
        </span>
        {props.categories.map(cat => (
          <span
            href="#"
            onClick={() => props.showCatDetails(cat.id)}
            key={cat.id}
            className={style.catLinkToItem}
          >
            {cat.title}
            <br />
          </span>
        ))}
      </p>
      <p className={style.infoItems}>{"Format: " + props.kta.format}</p>
      <p className={style.infoItems}>
        {"Organisationseinheit: " + props.kta.organisational_unit}
      </p>
      <p className={style.infoItems}>
        {"Zeitraum/Datum: " + zeitraum(props.kta.timeframe)}
      </p>
      <h3 className={style.abstractTitle}>Beschreibung:</h3>
      <p className={style.abstractText}>
        {props.kta.description.split("https://")[0]}
      </p>
      <p className={style.infoItems}>
        <span>
          Projekte:
          <br />
        </span>
        {props.categories.map(cat =>
          [...new Set(cat.connections.map(c => c.id))].map((con, i) => (
            <span
              href="#"
              onClick={() => props.showProjectDetails(con)}
              key={i + " " + con}
              className={style.catLinkToItem}
            >
              {cat.connections.find(p => p.id === con).title + ",\n "}
            </span>
          ))
        )}
      </p>
      <a
        className={style.projectDetailsLink}
        href={props.kta.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Link zur VIA Seite
      </a>
    </div>
  );
};
//props.showProjectDetails(con.id)
export default KtaDetailsPanel;
