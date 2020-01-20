import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { getFieldColor } from "../../util/utility";

const YearDetailsPanel = props => {
  const color = props.year.forschungsbereich
    ? getFieldColor(props.year.forschungsbereich)
    : "#aaa";
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
        <span className={style.titleTopic}>Jahr {props.year.year}</span> <br />
        <span className={style.titleText}>
          {props.year.targetgroup
            ? props.year.targetgroup
            : props.year.forschungsbereich}
        </span>
      </div>

      <span className={style.infoItemTitle}>
        {props.year.targetgroup
          ? "Wissenstransferaktivitäten mit dieser Zielgruppe "
          : "Forschungsprojekte in diesem Forschungsbereich "}
        im Jahr {props.year.year}:
        <br />
      </span>
      {props.year.ktas && (
        <div className={style.abstractText}>
          {props.year.ktas.map((kta, i) => (
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
      )}
      {props.year.projects && (
        <div className={style.abstractText}>
          {props.year.projects.map((project, i) => (
            <span
              href="#"
              onClick={() => props.showProjectDetails(project.id)}
              key={i + " " + project.id}
              className={style.DetailsLink}
              style={{
                color: color
              }}
            >
              {project.title.length > 70
                ? project.title.substring(0, 70) + "..."
                : project.title}
              <br />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
export default YearDetailsPanel;
