import React from "react";
import { Dialog } from "@blueprintjs/core";
import style from "./panel-buttons.module.css";
import { ReactComponent as Download } from "../../assets/Icon-Download.svg";
import { ReactComponent as Reset } from "../../assets/Icon-Reset.svg";
import { ReactComponent as Teilen } from "../../assets/Icon-Teilen.svg";

class FilterPanelButtons extends React.Component {
  constructor() {
    super();
    this.state = {
      shareDialog: false
    };
    this.dialogOpened = this.dialogOpened.bind(this);
    this.dialogClosed = this.dialogClosed.bind(this);
  }

  dialogOpened() {
    this.setState({ shareDialog: true });
  }
  dialogClosed() {
    this.setState({ shareDialog: false });
  }
  copiedToClipboard() {
    console.log("hdbnimso");
    const input = document.getElementById("share_input");
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
    window.alert("Copied link: \n" + input.value);
  }

  render() {
    const { shareDialog } = this.state;
    return (
      <div className={style.panelButtonsWrapper}>
        <Dialog
          isOpen={shareDialog}
          onClose={this.dialogClosed}
          className={style.bp3Dialog}
        >
          <div className={style.shareDialog}>
            <div className={style.shareHeader}>
              {" "}
              Die aktuelle Auswahl teilen:{" "}
            </div>
            <div>
              <input
                id={"share_input"}
                className={style.shareInput}
                value={window.location}
                readOnly={true}
              />
              <span
                className={style.shareClipboardLink}
                onClick={this.copiedToClipboard}
              >
                In die Zwischenablage kopieren
              </span>
            </div>
            <div className={style.closeShare} onClick={this.dialogClosed}>
              Fertig
            </div>
          </div>
        </Dialog>
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

        <div className={style.titleText} onClick={this.dialogOpened}>
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
