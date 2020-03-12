import React from "react";

import { useDispatch } from "react-redux";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { unClicked } from "../../store/actions/actions";
const SampleStatesList = props => {
  const dispatch = useDispatch();
  var sampleList = [
    {
      datum: "12.2.2020",
      link:
        "http://localhost:3000/touch/explore?state=eyJnIjoiMCIsImYiOlsiMyIsIjEiLCIyIl0sInQiOlsiMSIsIjMiLCIyNyIsIjIzIiwiMjQiLCIyMiIsIjQiLCIyOCIsIjI5Il0sInRpIjpbMjAxNCwyMDIzXSwiYyI6W10sImluIjpbIjNELUxhYm9yIiwiQmlvYWt1c3Rpc2NoZXMgTGFib3IiLCJHZW9jaGVtaXNjaGVyIHVuZCBtaWtyb2FuYWx5dGlzY2hlciBMYWJvcmtvbXBsZXgiLCJIb2NobGVpc3R1bmdzcmVjaG5lciIsIk1vbGVrdWxhcmdlbmV0aXNjaGUgTGFib3JlIiwiUGFs5G9udG9sb2dpc2NoZSBQcuRwYXJhdGlvbnNsYWJvcmUiXSwidGEiOlsiRXJ3YWNoc2VuZSJdLCJmbyI6W10sImhsZiI6WyJMYWJvcmdlcuR0ZSJdLCJjbCI6WyJub25lIiwiIl19"
    }
  ];
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsTitle}>
        <div
          className={style.DetailsExit}
          onClick={() => dispatch(unClicked())}
        >
          <Exit height={35} width={35} />
        </div>
        <span className={style.titleTopic}>
          Beispielabfragen und geteilte Ansichten
        </span>
      </div>
      <div className={style.infoItems}>
        {sampleList.map((sample, i) => {
          return (
            <a
              className={style.SampleLink}
              key={sample.datum + " " + i}
              href={sample.link}
            >
              {sample.datum}
            </a>
          );
        })}
        <a className={style.SampleLink} href={window.location.pathname}>
          Test 1
        </a>
        <a className={style.SampleLink} href={window.location.pathname}>
          Test 2
        </a>
      </div>
    </div>
  );
};

export default SampleStatesList;
