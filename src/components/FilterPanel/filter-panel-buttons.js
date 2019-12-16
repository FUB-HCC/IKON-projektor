import React from "react";
import style from "./panel-buttons.module.css";
import { ReactComponent as Download } from "../../assets/Icon-Download.svg";
import { ReactComponent as Reset } from "../../assets/Icon-Reset.svg";
import { ReactComponent as Teilen } from "../../assets/Icon-Teilen.svg";

class FilterPanelButtons extends React.Component {
  render() {
    return (
      <div className={style.panelButtonsWrapper}>
        <div
          className={style.titleText}
          onClick={() => window.alert("wurde exportiert!")}
        >
          <span>
            <Download className={style.buttonIcon} />
          </span>
          <br />
          <span> Exportieren</span>
        </div>

        <div
          className={style.titleText}
          onClick={() => window.alert("wurde geteilt!")}
        >
          <span>
            <Teilen className={style.buttonIcon} />
          </span>
          <br />
          <span> Teilen</span>
        </div>

        <div
          className={style.titleText}
          onClick={() => window.location.reload()}
        >
          <span>
            <Reset className={style.buttonIcon} />
          </span>{" "}
          <br />
          <span>Zurücksetzen</span>
        </div>
      </div>
    );
  }
}

export default FilterPanelButtons;
