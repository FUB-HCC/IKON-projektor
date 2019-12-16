import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";

const CatDetailsPanel = props => {
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsExit} onClick={props.returnToFilterView}>
        <Exit height={35} width={35} />
      </div>
      <div className={style.DetailsTitle}>
        <span className={style.titleTopic}>Zielgruppe</span> <br />
        <span className={style.titleText}>{props.catData.title}</span>
      </div>
      <div className={style.abstractText}>
        <span className={style.infoItemTitle}>
          Wissenstransferaktivitäten mit dieser Zielgruppe:
          <br />
        </span>
        <p>
          {props.ktas.map((kta, i) => (
            <span
              href="#"
              onClick={() => props.showKtaDetails(kta.id)}
              key={i + " " + kta.id}
              className={style.DetailsLink}
            >
              {kta.title}
              <br />
            </span>
          ))}
        </p>
      </div>
      {props.catData.project_ids.length > 0 && (
        <div className={style.abstractText}>
          <span className={style.infoItemTitle}>
            Assoziierte Forschungsprojekte: <br />
          </span>
          <p>
            {props.catData.project_ids.map(project => (
              <span
                href="#"
                onClick={() => props.showProjectDetails(project)}
                key={project}
                className={style.DetailsLink}
              >
                {
                  props.catData.connections.find(con => con.id === project)
                    .title
                }
                <br />
              </span>
            ))}
          </p>
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
        Im VIA-Wiki anschauen
      </a>
    </div>
  );
};
export default CatDetailsPanel;
