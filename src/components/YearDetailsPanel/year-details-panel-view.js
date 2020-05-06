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
  const color = getFieldColor(props.title);
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
        {"Forschungsprojekte in diesem Forschungsbereich im Jahr "}
        {props.year}:
        <br />
      </span>
      {props.projects.length > 0 && (
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
    </div>
  );
};
export default YearDetailsPanel;
