import React from "react";
import style from "./group-details-panel.module.css";

const ktaInfo = props => {
  return (
    <div className={style.ktaInfoWrapper}>
      <div className={style.ktaKeys}>FELD</div>
      <div className={style.ktaValues}>{props.field_of_action}</div>
      <div className={style.ktaKeys}>FORMAT</div>
      <div className={style.ktaValues}>{props.format}</div>
      <div className={style.ktaKeys}>ZIEL</div>
      <div className={style.ktaValues}>{props.goal}</div>
    </div>
  );
};

export default ktaInfo;
