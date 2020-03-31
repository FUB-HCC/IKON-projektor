import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import {
  getFieldColor,
  shortenString,
  fieldsIntToString
} from "../../util/utility";

const YearDetailsPanel = props => {
  if (!props.title) {
    return (
      <div className={style.DetailsWrapper}>
        <div className={style.DetailsExit} onClick={props.returnToFilterView}>
          <Exit height={35} width={35} />
        </div>
      </div>
    );
  }
  const color = getFieldColor(parseInt(props.title));
  return (
    <div className={style.DetailsWrapper}>
      <div
        className={style.DetailsTitle}
        style={{
          borderBottomColor: color,
          color: color
        }}
      >
        <div className={style.DetailsExit} onClick={props.returnToFilterView}>
          <Exit height={35} width={35} />
        </div>
        <span className={style.titleTopic}>Jahr {props.year}</span> <br />
        <span className={style.titleText}>
          {isNaN(props.title) ? props.title : fieldsIntToString(props.title)}
        </span>
      </div>

      <span className={style.infoItemTitle}>
        {props.ktas.length > 0
          ? "Wissenstransferaktivitäten mit dieser Zielgruppe "
          : "Forschungsprojekte in diesem Forschungsbereich "}
        im Jahr {props.year}:
        <br />
      </span>
      {props.ktas.length > 0 && (
        <div className={style.abstractText}>
          {props.ktas.map((kta, i) => (
            <span
              href="#"
              onClick={() => props.showKtaDetails(kta.id)}
              key={i + " " + kta.id}
              className={style.DetailsLink}
            >
              {shortenString(kta.fulltext, 58)}
              <br />
            </span>
          ))}
        </div>
      )}
      {props.projects.length > 0 && props.title !== "Unveröffentlicht" && (
        <div className={style.abstractText}>
          {props.projects.map((project, i) => (
            <span
              href="#"
              onClick={() => props.showProjectDetails(project.id)}
              key={i + " " + project.id}
              className={style.DetailsLink}
              style={{
                color: color
              }}
            >
              {shortenString(project.displaytitle, 58)}
              <br />
            </span>
          ))}
        </div>
      )}
      {props.projects.length > 0 && props.title === "Unveröffentlicht" && (
        <div className={style.abstractText}>
          {props.projects.map((project, i) => (
            <span
              key={i + " " + project.id}
              className={style.DetailsLinkUnclickable}
            >
              {project.displaytitle}
              <br />
              <br />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
export default YearDetailsPanel;
