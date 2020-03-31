import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";
import { getFieldColor, shortenString } from "../../util/utility";

const InfraDetailsPanel = props => {
  if (!props.infraData) {
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
        {props.type === "Labor" ? (
          <InfrastructureIcon
            className={style.TitleIcon}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            fill="#aaa"
          />
        ) : (
          <CollectionIcon
            className={style.TitleIcon}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            fill="#aaa"
          />
        )}
        <span className={style.titleTopic}>{props.type + " "}</span>
        <br />
        <span className={style.titleText}>{props.infraData.fulltext}</span>
      </div>
      <span className={style.infoItemTitle}>
        Beschreibung:
        <br />
      </span>
      <div className={style.abstractText}>
        {props.type === "Labor"
          ? props.infraData.Einleitung
          : props.infraData["Beschreibung der Sammlung"]}
      </div>
      <span className={style.infoItemTitle}>
        <br />
        Forschungsprojekte, die diese Infrastruktur nutzen:
        <br />
      </span>
      {props.infraData.projects.length > 0 && (
        <p className={style.abstractText}>
          {props.infraData.projects.map(project => (
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
        </p>
      )}
      <div
        className={style.DetailsViaLink}
        onClick={() => props.openViaWiki(props.infraData.fullurl)}
      >
        Anzeigen im VIA-Wiki
      </div>
    </div>
  );
};
export default InfraDetailsPanel;
