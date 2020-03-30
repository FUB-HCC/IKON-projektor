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
  showSampleList,
  shareUrl,
  changeGraph
} from "../../store/actions/actions";
import { sideBarWidth } from "../../App";
class ActionButtons extends Component {
  constructor(props) {
    super();
    this.startPageTour = this.startPageTour.bind(this);
    this.startPageTourTouch = this.startPageTourTouch.bind(this);
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
    const input = document.getElementById("share_name");
    input.select();
    input.setSelectionRange(0, 140);
    var today = new Date();
    var date =
      today.getDate() +
      "." +
      (1 + today.getMonth()) +
      "." +
      today.getFullYear();
    const name = input.value ? input.value : date;
    shareUrl(name);
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
      .onexit(() => this.props.legendHovered(null))
      .start();
  }

  startPageTourTouch() {
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
      doneLabel: "Fertig",
      steps: [
        {
          intro:
            "<h2>Willkommen im MfN.projektor</h2> Touch Interaktion Tutorial",
          element: "step0"
        },

        {
          intro: "Touch Interaktion Tutorial",
          element: "step1"
        },
        {
          element: "#touchStep1",
          intro:
            "Das Herzstück der Ansicht ist die Cluster-Darstellung von Drittmittelprojekten auf Basis algorithmischer Vergleiche von Projekt-Abstracts. Projekte sind nach ihren jeweiligen <b>Forschungsgebieten</b> eingefärbt um eine interdisziplinäre Perspektive auf die Forschung am Haus zu unterstützen. Hierdurch können Drittmittelprojekte basierend auf thematischen Gemeinsamkeiten interaktiv exploriert werden."
        },
        {
          intro:
            "Als weiteres Element dieser Ansicht kann die Unsicherheits-Landschaft aktiviert werden. Da die Anordnung auf algorithmischen Schätzungen von inhaltlichen Ähnlichkeiten basiert, unterstützt dieses Element die Interpretation der Anordnung. Je heller die Färbung der Landschaft, desto sicherer ist sich der Algorithmus über die Position des jeweiligen Forschungsprojektes, und umgekehrt.",
          element: "#touchStep2"
        },
        {
          intro:
            "Die interdisziplinäre Perspektive auf Drittmittelforschung wird durch den äußeren Ring bedeutsam erweitert. Projekte werden hier, basierend auf Informationen aus dem VIA-Wiki, mit Wissenstransferaktivitäten und Infrastrukturen wie Sammlungen und Laborgeräten verknüpft. Hierdurch können einerseits Projekte weitergehend nach Gemeinsamkeiten eingeordnet werden, andererseits Potenziale für Wissenstransfer basierend auf Gemeinsamkeiten entdeckt werden.",
          element: "#touchStep3"
        },
        {
          intro:
            "Die Größe der Kreise und die Zahl neben den unterschiedlichen Zielgruppen vermittelt die Anzahl der Wissenstransferaktivitäten, die diese Zielgruppe haben",
          element: "#touchStep4"
        },
        {
          intro:
            "Alle Verknüpfungen, die dieses Icon tragen, sind Sammlungen am Museum für Naturkunde, zu denen Forschungsprojekten einen Bezug haben können.",
          element: "#touchStep5"
        },
        {
          intro:
            "Alle Verknüpfungen, die dieses Icon tragen, sind Laborgeräte oder andere Infrastruktur am Museum, die in Forschungsprojekten eingesetzt werden können.",
          element: "#touchStep6"
        },
        {
          intro:
            "Im oberen Teil werden die Anzahl und Laufzeiten von <b>Drittmittelprojekten</b> basierend auf aktuellen Informationen aus dem <a style='color: #afca0b;' href='https://via.museumfuernaturkunde.berlin/wiki/' target='_blank' rel='noopener noreferrer'>VIA-Wiki</a> und gruppiert nach <b>Forschungsgebieten</b> angezeigt. Um die Interpretation von Trend-Entwicklungen zu unterstützen, werden außerdem in dunkelgrauer Schattierung bisher noch nicht integrierte Daten zu Drittmittelprojekten dargestellt.",
          element: "touchStep7"
        }
      ]
    });
    tour
      .onbeforechange(() => {
        switch (tour._currentStep) {
          case 3: {
            this.props.onShowUncertainty(true);
            this.props.onHighlightUncertainty(true);
            break;
          }
          case 4: {
            this.props.onHighlightUncertainty(false);
            this.props.onShowUncertainty(false);
            break;
          }
          case 5: {
            this.props.legendHovered("ktas");
            break;
          }
          case 6: {
            this.props.legendHovered("collections");
            break;
          }
          case 7: {
            this.props.legendHovered("infrastructures");
            break;
          }
          case 8: {
            this.props.changeGraph("1");
            break;
          }
          default: {
            this.props.legendHovered();
            break;
          }
        }
      })
      .onexit(() => this.props.legendHovered(null))
      .start();
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
              Die aktuelle Auswahl teilen:
            </div>
            <div>
              <input
                id={"share_input"}
                className={classes.shareInput}
                value={window.location}
                readOnly={true}
              />
              <input
                id={"share_name"}
                className={classes.shareInput}
                placeholder="Bitte Namen für Ansicht eingeben"
                readOnly={false}
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
          <div
            className={classes.rightElement}
            onClick={isTouch ? this.startPageTourTouch : this.startPageTour}
          >
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
  },
  shareUrl: name => {
    dispatch(shareUrl(name));
  },
  changeGraph: key => dispatch(changeGraph(key))
});

export default connect(
  null,
  mapDispatchToProps
)(ActionButtons);
