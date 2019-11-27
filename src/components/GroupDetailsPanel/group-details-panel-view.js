import React from "react";
import style from "./group-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import KtaInfo from "./kta-info-view";

const GroupDetailsPanel = props => {
  return (
    <div className={style.groupDetailsWrapper}>
      <div
        className={style.groupDetailsExit}
        onClick={props.returnToFilterView}
      >
        <Exit height={45} width={45} />
      </div>
      <div className={style.groupDetailsTitle}>
        <span className={style.titleText}>
          Zielgruppe: {props.targetGroup.title}
        </span>
      </div>
      <div className={style.groupDetailsAbstract}>
        <b>KTAS:</b>
        <br />
      </div>
      <div className={style.ktaInfoList}>
        {props.ktas.map(kta => (
          <KtaInfo key={kta.id} {...kta} />
        ))}
      </div>
    </div>
  );
};

export default GroupDetailsPanel;
