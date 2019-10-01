import React from "react";
import style from "./project-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";

const ProjectDetailsPanel = props => {
  console.log(props);
  return (
    <div className={style.projectDetailsWrapper}>
      <div
        className={style.projectDetailsExit}
        onClick={props.returnToFilterView}
      >
        <Exit height={45} width={45} />
      </div>
      <div className={style.projectDetailsTitle}>
        <span className={style.titleText}>
          {props.projectData.titelprojekt}
        </span>
      </div>
      <div className={style.projectDetailsAbstract}>
        <p className={style.abstractText}>
          {props.projectData.project_abstract}
        </p>
      </div>
    </div>
  );
};

export default ProjectDetailsPanel;
