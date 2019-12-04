import React from "react";
import style from "./infra-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";

const InfraDetailsPanel = props => {
  return (
    <div className={style.projectDetailsWrapper}>
      <div
        className={style.projectDetailsExit}
        onClick={props.returnToFilterView}
      >
        <Exit height={45} width={45} />
      </div>
      <div className={style.projectDetailsTitle}>
        <span className={style.titleText}>{props.infraData.name}</span>
      </div>
      <p className={style.abstractText}>
        {props.infraData.type === "collection"
          ? "Typ: Sammlung"
          : "Typ: Laborgerät/Infrastruktur"}
      </p>
      <h3 className={style.abstractTitle}>Beschreibung:</h3>
      <p className={style.abstractText}>{props.infraData.description}</p>
      {props.infraData.connections.length > 0 && (
        <div>
          <h2 className={style.abstractTitle}>
            Forschungsprojekte, die diese Infrastruktur nutzen:{" "}
          </h2>
          <p className={style.abstractText}>
            {[...new Set(props.infraData.connections.map(c => c.id))].map(
              (con, i) => (
                <span
                  href="#"
                  onClick={() => props.showProjectDetails(con)}
                  key={i + " " + con}
                  className={style.catLinkToItem}
                >
                  {props.infraData.connections.find(p => p.id === con).title}
                  <br />
                  <br />
                </span>
              )
            )}
          </p>
        </div>
      )}
    </div>
  );
};
export default InfraDetailsPanel;
