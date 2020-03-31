import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";

const SampleStatesListView = props => {
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsTitle}>
        <div
          className={style.DetailsExit}
          onClick={() => props.returnToFilterView()}
        >
          <Exit height={35} width={35} />
        </div>
        <span className={style.titleTopic}>
          Beispielabfragen und geteilte Ansichten
        </span>
      </div>
      <div className={style.infoItems}>
        {props.sampleList.map((sample, i) => {
          return (
            <span
              className={style.SampleLink}
              key={sample + " " + i}
              onClick={() => props.onClickSample(sample)}
            >
              {sample}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SampleStatesListView;
