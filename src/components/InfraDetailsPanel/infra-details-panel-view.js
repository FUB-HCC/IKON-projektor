import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";

const InfraDetailsPanel = props => {
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsExit} onClick={props.returnToFilterView}>
        <Exit height={35} width={35} />
      </div>
      <div className={style.DetailsTitle}>
        {props.infraData.type === "collection" ? (
          <CollectionIcon
            className={style.TitleIcon}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            fill="#aaa"
          />
        ) : (
          <InfrastructureIcon
            className={style.TitleIcon}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            fill="#aaa"
          />
        )}
        <span className={style.titleTopic}>
          {props.infraData.type === "collection"
            ? "Sammlung "
            : "Labor/Infrastruktur "}
        </span>
        <br />
        <span className={style.titleText}>{props.infraData.name}</span>
      </div>

      <div className={style.abstractText}>
        <span className={style.infoItemTitle}>
          Beschreibung:
          <br />
        </span>
        {props.infraData.description}
      </div>
      {props.infraData.connections.length > 0 && (
        <div>
          <span className={style.infoItemTitle}>
            <br />
            Forschungsprojekte, die diese Infrastruktur nutzen:
            <br />
          </span>
          <p className={style.abstractText}>
            {[...new Set(props.infraData.connections.map(c => c.id))].map(
              (con, i) => (
                <span
                  href="#"
                  onClick={() => props.showProjectDetails(con)}
                  key={i + " " + con}
                  className={style.DetailsLink}
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
      <a
        className={style.DetailsViaLink}
        href={
          "https://via.museumfuernaturkunde.berlin/wiki/" + props.infraData.name
        }
        target="_blank"
        rel="noopener noreferrer" //got warning otherwise
      >
        Im VIA-Wiki anschauen
      </a>
    </div>
  );
};
export default InfraDetailsPanel;
