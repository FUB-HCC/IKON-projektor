import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { getFieldColor, shortenString } from "../../util/utility";

const CatDetailsPanel = props => {
  if (!props.catData) {
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
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsTitle}>
        <div className={style.DetailsExit} onClick={props.returnToFilterView}>
          <Exit height={35} width={35} />
        </div>
        <span className={style.titleTopic}>{props.type}</span> <br />
        <span className={style.titleText}>{props.catData.name}</span>
      </div>
      <span className={style.infoItemTitle}>
        Wissenstransferaktivitäten:
        <br />
      </span>

      {props.catData.ktas && (
        <div className={style.abstractText}>
          {props.catData.ktas.map(kta => (
            <span
              href="#"
              onClick={() => props.showKtaDetails(kta.id)}
              key={kta.id}
              className={style.DetailsLink}
            >
              {shortenString(kta.fulltext, 58)}
              <br />
            </span>
          ))}
        </div>
      )}
      {props.catData.projects.length > 0 && (
        <span className={style.infoItemTitle}>
          Assoziierte Forschungsprojekte: <br />
        </span>
      )}
      {props.catData.projects.length > 0 && (
        <div
          className={style.abstractText}
          style={{ minHeight: props.catData.projects.length * 3 + "%" }}
        >
          {props.catData.projects.map(project => (
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
              <br />
            </span>
          ))}
        </div>
      )}
      <div
        className={style.DetailsViaLink}
        onClick={() =>
          props.openViaWiki(
            "https://via.museumfuernaturkunde.berlin/wiki/" + props.catData.name
          )
        }
      >
        Anzeigen im VIA-Wiki
      </div>
    </div>
  );
};
export default CatDetailsPanel;
