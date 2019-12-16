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
      {props.catData.connections.length > 0 && (
        <div className={style.abstractText}>
          <span className={style.infoItemTitle}>
            Assoziierte Forschungsrojekte: <br />
          </span>
          <p>
            {[...new Set(props.catData.connections.map(c => c.id))].map(
              (con, i) => (
                <span
                  href="#"
                  onClick={() => props.showProjectDetails(con)}
                  key={i + " " + con}
                  className={style.DetailsLink}
                >
                  {props.catData.connections.find(p => p.id === con).title}
                  <br />
                </span>
              )
            )}
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
