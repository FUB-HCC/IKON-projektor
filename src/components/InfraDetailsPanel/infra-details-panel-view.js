import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";
import { getFieldColor } from "../../util/utility";

const InfraDetailsPanel = props => {
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsTitle}>
        <div className={style.DetailsExit} onClick={props.returnToFilterView}>
          <Exit height={35} width={35} />
        </div>
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
      <span className={style.infoItemTitle}>
        Beschreibung:
        <br />
      </span>
      <div className={style.abstractText}>{props.infraData.description}</div>
      <span className={style.infoItemTitle}>
        <br />
        Forschungsprojekte, die diese Infrastruktur nutzen:
        <br />
      </span>
      {props.infraData.connections.length > 0 && (
        <p className={style.abstractText}>
          {props.infraData.connections.map((con, i) => (
            <span
              href="#"
              onClick={() => props.showProjectDetails(con.id)}
              key={i + " " + con}
              className={style.DetailsLink}
              style={{
                color: getFieldColor(con.project.forschungsbereich)
              }}
            >
              {con.title.length > 70
                ? con.title.substring(0, 70) + "..."
                : con.title}
              <br />
            </span>
          ))}
        </p>
      )}
      <a
        className={style.DetailsViaLink}
        href={
          "https://via.museumfuernaturkunde.berlin/wiki/" + props.infraData.name
        }
        target="_blank"
        rel="noopener noreferrer" //got warning otherwise
      >
        Anzeigen im VIA-Wiki
      </a>
    </div>
  );
};
export default InfraDetailsPanel;
