import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { getFieldColor, shortenString } from "../../util/utility";

const LabelDetailsPanel = props => {
  if (!props.labelData) {
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
        <span className={style.titleTopic}>{props.type}</span> <br />
        <span className={style.titleText}>{props.labelData.name}</span>
      </div>
      {props.labelData.projects.length > 0 && (
        <span className={style.infoItemTitle}>
          Assoziierte Forschungsprojekte: <br />
        </span>
      )}
      {props.labelData.projects.length > 0 && (
        <div
          className={style.abstractText}
          style={{ minHeight: props.labelData.projects.length * 3 + "%" }}
        >
          {props.labelData.projects.map(project => (
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
        </div>
      )}
    </div>
  );
};
export default LabelDetailsPanel;
