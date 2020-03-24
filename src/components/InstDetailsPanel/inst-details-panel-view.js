import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { getFieldColor, shortenString } from "../../util/utility";

const InstDetailsPanel = props => {
  if (!props.title) {
    return (
      <div className={style.DetailsWrapper}>
        <div className={style.DetailsExit} onClick={props.returnToFilterView}>
          <Exit height={35} width={35} />
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
        <span className={style.titleText}>{props.title}</span>
      </div>

      <span className={style.infoItemTitle}>
        {props.title.includes("Kooperation")
          ? "Forschungsprojekte mit Kooperationen zwischen diesen Kontinenten:"
          : "Forschungsprojekte  mit dieser Forschungsregion"}
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
export default InstDetailsPanel;
