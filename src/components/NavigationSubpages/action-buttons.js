import React, { Component } from "react";
import { connect } from "react-redux";
import introJs from "intro.js";
import classes from "./navigation-subpages.module.css";
import { Dialog } from "@blueprintjs/core";
import { ReactComponent as Tutorial } from "../../assets/Icon-Tutorial.svg";
import { ReactComponent as Download } from "../../assets/Icon-Download.svg";
import { ReactComponent as Teilen } from "../../assets/Icon-Teilen.svg";
import { ReactComponent as Reset } from "../../assets/Icon-Reset.svg";
import {
  highlightUncertainty,
  showUncertainty,
  legendHovered,
  tutorialStarted,
  pageReset,
  shareDialogOpened,
  showSampleList
} from "../../store/actions/actions";
import { sideBarWidth } from "../../App";
class ActionButtons extends Component {
  constructor(props) {
    super();
    this.startPageTour = this.startPageTour.bind(this);
    this.dialogOpened = this.dialogOpened.bind(this);
    this.dialogClosed = this.dialogClosed.bind(this);
    this.state = {
      shareDialogIsOpen: false
    };
  }

  dialogOpened() {
    this.props.shareDialogOpened();
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
    //window.alert("Copied link: \n" + input.value);
  }

  sendToTouchscreen() {
    const input = document.getElementById("share_input");
    input.select();
    input.setSelectionRange(0, 99999);
    var today = new Date();
    var date =
      today.getDate() + "." + today.getMonth() + "." + today.getFullYear();
    console.log(JSON.stringify({ datum: date, link: window.location.search }));
  }

  startPageTour() {
    this.props.tutorialStarted();
    var tour = introJs();
    tour.setOptions({
      tooltipPosition: "auto",
      showStepNumbers: false,
      overlayOpacity: 0.1,
      tooltipClass: classes.introTooltip,
      highlightClass: classes.introHighlightClass,
      nextLabel: "Weiter",
      prevLabel: "Zurück",
      skipLabel: "Abbrechen",
      doneLabel: "Fertig"
    });
    tour
      .onbeforechange(() => {
        switch (tour._currentStep) {
          case 1: {
            this.props.onShowUncertainty(true);
            this.props.onHighlightUncertainty(true);
            break;
          }
          case 2: {
            this.props.onHighlightUncertainty(false);
            this.props.onShowUncertainty(false);
            break;
          }
          case 3: {
            this.props.legendHovered("ktas");
            break;
          }
          case 4: {
            this.props.legendHovered("collections");
            break;
          }
          case 5: {
            this.props.legendHovered("infrastructures");
            break;
          }
          default: {
            break;
          }
        }
      })
      .onexit(() => this.props.legendHovered(null));
    tour.start();
  }

  render() {
    const { shareDialogIsOpen } = this.state;
    const isTouch = window.location.pathname.includes("touch");
    return (
      <>
        <Dialog
          isOpen={shareDialogIsOpen}
          onClose={this.dialogClosed}
          className={classes.bp3Dialog}
        >
          <div className={classes.shareDialog}>
            <div className={classes.shareHeader}>
              {" "}
              Die aktuelle Auswahl teilen:{" "}
            </div>
            <div>
              <input
                id={"share_input"}
                className={classes.shareInput}
                value={window.location}
                readOnly={true}
              />
            </div>
            <div className={classes.shareButtons}>
              <span
                className={classes.shareClipboardLink}
                onClick={this.copiedToClipboard}
              >
                In die Zwischenablage kopieren
              </span>
              <span
                className={classes.shareClipboardLink}
                onClick={this.sendToTouchscreen}
              >
                An den Touchscreen schicken
              </span>
            </div>
            <div className={classes.closeShare} onClick={this.dialogClosed}>
              Fertig
            </div>
          </div>
        </Dialog>
        <div
          className={classes.rightPanel}
          id="step4"
          style={{
            maxWidth: sideBarWidth,
            minWidth: sideBarWidth,
            borderTop: isTouch ? "4px solid #0e0e0e" : "none"
          }}
        >
          <div className={classes.rightElement} onClick={this.startPageTour}>
            <Tutorial className={classes.buttonIcon} /> <p>Tutorial</p>
          </div>

          {isTouch && (
            <div
              className={classes.rightElement}
              onClick={this.props.showSampleList}
            >
              <Download className={classes.buttonIcon} />
              <p>Geteilte Ansichten</p>
            </div>
          )}

          {!isTouch && (
            <div className={classes.rightElement} onClick={this.dialogOpened}>
              <Teilen className={classes.buttonIcon} />
              <p>Teilen</p>
            </div>
          )}

          <div
            className={classes.rightElement}
            onClick={() => {
              this.props.pageReset();
            }}
          >
            <Reset className={classes.buttonIcon} /> <p>Zurücksetzen</p>
          </div>
        </div>
      </>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  legendHovered: legendKey => {
    dispatch(legendHovered(legendKey));
  },
  onHighlightUncertainty: value => {
    dispatch(highlightUncertainty(value));
  },
  onShowUncertainty: value => {
    dispatch(showUncertainty(value));
  },
  tutorialStarted: () => {
    dispatch(tutorialStarted());
  },
  pageReset: () => {
    dispatch(pageReset());
  },
  shareDialogOpened: () => {
    dispatch(shareDialogOpened());
  },
  showSampleList: () => {
    dispatch(showSampleList());
  }
});

export default connect(
  null,
  mapDispatchToProps
)(ActionButtons);
