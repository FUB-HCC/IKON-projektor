import React from "react";
import style from "./cat-details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";


const CatDetailsPanel = props => {
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
        {props.catData.title}
      </span>
    </div>
    <div>
      <h2 className={style.abstractTitle}>Verbundene Projekte: </h2>
      <p className={style.abstractText}>
        {props.catData.connections.map( (con,i) => (
            <span href="#" onClick={() => props.showProjectDetails(con.id)}
            key={i +" "+props.catData.id } className={style.catProjectLink}>
            {con.title}
            <br/><br/>
            </span>
          )
        )}
      </p>
    </div>
    </div>
  );
};
//props.showProjectDetails(con.id)
export default CatDetailsPanel;
