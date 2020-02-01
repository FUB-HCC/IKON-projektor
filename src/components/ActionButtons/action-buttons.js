import React, { Component } from "react";
import { connect } from "react-redux";
import introJs from "../../../node_modules/intro.js/intro";
import style from "./action-buttons.module.css";
import { Dialog } from "@blueprintjs/core";
import { ReactComponent as Tutorial } from "../../assets/Icon-Tutorial.svg";
import { ReactComponent as Teilen } from "../../assets/Icon-Teilen.svg";
import { ReactComponent as Reset } from "../../assets/Icon-Reset.svg";
import { setHighlightState } from "../../store/actions/actions";

class ActionButtons extends Component {
  constructor() {
    super();
    this.startPageTour = this.startPageTour.bind(this);
    this.dialogOpened = this.dialogOpened.bind(this);
    this.dialogClosed = this.dialogClosed.bind(this);
    this.state = {
      shareDialogIsOpen: false
    };
  }

  dialogOpened() {
    this.setState({ shareDialogIsOpen: true });
  }
  dialogClosed() {
    this.setState({ shareDialogIsOpen: false });
  }

  copiedToClipboard() {
    const input = document.getElementById("share_input");
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
    window.alert("Copied link: \n" + input.value);
  }

  startPageTour() {
    var tour = introJs();
    tour.setOptions({
      tooltipPosition: "auto",
      showStepNumbers: false,
      overlayOpacity: 0.1,
      tooltipClass: style.introTooltip,
      highlightClass: style.introPageHighlightClass,
      nextLabel: "Weiter",
      prevLabel: "Zurück",
      skipLabel: "Abbrechen",
      doneLabel: "Fertig"
    });
    tour
      .onchange(() => {
        if (
          this.state.active === "WISSEN" &&
          tour._introItems[1].element !== "g"
        )
          switch (tour._currentStep) {
            case 1: {
              this.props.setHighlightState(["uncertainty"]);
              break;
            }
            case 2: {
              this.props.setHighlightState([
                "infrastructure",
                "collection",
                "categories"
              ]);
              break;
            }
            case 3: {
              this.props.setHighlightState(["categories"]);
              break;
            }
            case 4: {
              this.props.setHighlightState(["infrastructure"]);
              break;
            }
            case 5: {
              this.props.setHighlightState(["collection"]);
              break;
            }
            default: {
              break;
            }
          }
      })
      .onexit(() => this.props.setHighlightState([]));
    tour.start();
  }

  render() {
    const { shareDialogIsOpen } = this.state;
    return (
      <>
        <Dialog
          isOpen={shareDialogIsOpen}
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
        <div className={style.rightPanel} id="step4">
          <div className={style.rightElement} onClick={this.startPageTour}>
            <Tutorial className={style.buttonIcon} /> <p>Tutorial</p>
          </div>
          <div className={style.rightElement} onClick={this.dialogOpened}>
            <Teilen className={style.buttonIcon} /> <p>Teilen</p>
          </div>

          <div
            className={style.rightElement}
            onClick={() =>
              window.open("http://localhost:3000/explore?", "_self")
            }
            style={{ marginRight: 0 }}
          >
            <Reset className={style.buttonIcon} /> <p>Zurücksetzen</p>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setHighlightState: value => {
    dispatch(setHighlightState(value));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(ActionButtons);
