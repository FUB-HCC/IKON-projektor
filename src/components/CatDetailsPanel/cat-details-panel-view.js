import React from "react";
import style from "./cat-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";

const CatDetailsPanel = props => {
  return (
    <div className={style.projectDetailsWrapper}>
      <div
        className={style.projectDetailsExit}
        onClick={props.returnToFilterView}
      >
        <Exit height={45} width={45} />
      </div>
      <div className={style.projectDetailsTitle}>
        <span className={style.titleText}>{props.catData.title}</span>
      </div>
      {props.catData.connections.length > 0 && (
        <div>
          <h2 className={style.abstractTitle}>
            Über eine Wissenstransferaktivität mit dieser Zielgruppe verbundene
            Projekte:{" "}
          </h2>
          <p className={style.abstractText}>
            {[...new Set(props.catData.connections.map(c => c.id))].map(
              (con, i) => (
                <span
                  href="#"
                  onClick={() => props.showProjectDetails(con)}
                  key={i + " " + con}
                  className={style.catLinkToItem}
                >
                  {props.catData.connections.find(p => p.id === con).title}
                  <br />
                  <br />
                </span>
              )
            )}
          </p>
        </div>
      )}
      <div>
        <h2 className={style.abstractTitle}>
          Wissenstransferaktivitäten mit dieser Zielgruppe:{" "}
        </h2>
        <p className={style.abstractText}>
          {props.ktas.map((kta, i) => (
            <span
              href="#"
              onClick={() => props.showKtaDetails(kta.id)}
              key={i + " " + kta.id}
              className={style.catLinkToItem}
            >
              {kta.title}
              <br />
              <br />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};
export default CatDetailsPanel;
