import React from "react";
import style from "./sample-states-list.module.css";

const SampleStatesList = props => {
  return (
    <div className={style.sampleStatesList}>
      <span className={style.sampleStatesHeader}>
        Beispielabfragen und geteilte Ansichten:
      </span>
      {"<Leer>"}
    </div>
  );
};

export default SampleStatesList;
