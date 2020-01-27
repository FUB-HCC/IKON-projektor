import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { getFieldColor } from "../../util/utility";

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
        <span className={style.titleTopic}>Zielgruppe</span> <br />
        <span className={style.titleText}>{props.catData.title}</span>
      </div>
      <span className={style.infoItemTitle}>
        Wissenstransferaktivitäten mit dieser Zielgruppe:
        <br />
      </span>
      <div className={style.abstractText}>
        {props.ktas.map((kta, i) => (
          <span
            href="#"
            onClick={() => props.showKtaDetails(kta.id)}
            key={i + " " + kta.id}
            className={style.DetailsLink}
          >
            {kta.title.length > 70
              ? kta.title.substring(0, 70) + "..."
              : kta.title}
            <br />
          </span>
        ))}
      </div>
      {props.catData.project_ids.length > 0 && (
        <span className={style.infoItemTitle}>
          Assoziierte Forschungsprojekte: <br />
        </span>
      )}
      {props.catData.project_ids.length > 0 && (
        <div
          className={style.abstractText}
          style={{ minHeight: props.catData.project_ids.length * 3 + "%" }}
        >
          {props.catData.project_ids.map(project => (
            <span
              href="#"
              onClick={() => props.showProjectDetails(project)}
              key={project}
              className={style.DetailsLink}
              style={{
                color: getFieldColor(
                  props.catData.connections.find(con => con.id === project)
                    .project.forschungsbereich
                )
              }}
            >
              {props.catData.connections.find(con => con.id === project).title
                .length > 70
                ? props.catData.connections
                    .find(con => con.id === project)
                    .title.substring(0, 70) + "..."
                : props.catData.connections.find(con => con.id === project)
                    .title}

              <br />
            </span>
          ))}
        </div>
      )}
      <a
        className={style.DetailsViaLink}
        href={
          "https://via.museumfuernaturkunde.berlin/wiki/" + props.catData.title
        }
        target="_blank"
        rel="noopener noreferrer" //got warning otherwise
      >
        Anzeigen im VIA-Wiki
      </a>
    </div>
  );
};
export default CatDetailsPanel;
