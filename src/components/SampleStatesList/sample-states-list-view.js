import React from "react";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { shortenString } from "../../util/utility";

const SampleStatesListView = props => {
  return (
    <div className={style.DetailsWrapper} style={{ height: "83%" }}>
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
      <table className={style.infoItems}>
        <tbody>
          <tr>
            <th className={style.sampleHeader}>NAME</th>
            <th className={style.sampleHeader}>GETEILT AM</th>
          </tr>
          {props.sampleList.map((sample, i) => {
            return (
              <tr
                key={sample + " " + i}
                onClick={() => props.onClickSample(sample)}
              >
                <td width="80%" className={style.sampleName}>
                  {" "}
                  {shortenString(sample.split("|")[0], 40)}
                </td>
                <td className={style.sampleDate}>{sample.split("|")[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SampleStatesListView;
