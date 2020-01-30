import React, { Component } from "react";
import { Dialog } from "@blueprintjs/core";
import introJs from "intro.js";
import "intro.js/introjs.css";
import "intro.js/themes/introjs-modern.css";
import classes from "./navigation-subpages.module.css";
import { connect } from "react-redux";
import logo from "../../assets/ikon_logo.png";
import { menuBarHeight } from "../../App";
import { changeGraph, setHighlightState } from "../../store/actions/actions";

import { ReactComponent as Tutorial } from "../../assets/Icon-Tutorial.svg";
import { ReactComponent as Reset } from "../../assets/Icon-Reset.svg";
import { ReactComponent as Teilen } from "../../assets/Icon-Teilen.svg";

class NavigationSubpages extends Component {
  constructor(props) {
    super(props);
    this.changeGraphHandler = this.changeGraphHandler.bind(this);
    this.startTour = this.startTour.bind(this);
    this.startPageTour = this.startPageTour.bind(this);
    this.dialogOpened = this.dialogOpened.bind(this);
    this.dialogClosed = this.dialogClosed.bind(this);
    let active = "WISSEN";
    switch (props.graph) {
      case "1":
        active = "ZEIT";
        break;
      case "2":
        active = "RAUM";
        break;
      default:
        break;
    }
    this.state = {
      active: active,
      shareDialog: false
    };
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

  changeGraphHandler(graph) {
    if (graph === "0") {
      this.setState({ active: "WISSEN" });
    }
    if (graph === "1") {
      this.setState({ active: "ZEIT" });
    }
    if (graph === "2") {
      this.setState({ active: "RAUM" });
    }
    this.props.changeGraph(graph);
    this.setState({
      activePopover: -1
    });
  }

  startTour() {
    var tour = introJs();
    tour.setOptions({
      tooltipPosition: "auto",
      positionPrecedence: ["right", "top", "left", "bottom"],
      showStepNumbers: false,
      overlayOpacity: 0.5,
      tooltipClass: classes.introTooltip,
      highlightClass: classes.introHighlightClass,
      skipLabel: "Benutzen",
      doneLabel: "Fertig",
      prevLabel: "Zurück",
      nextLabel: "Weiter",
      steps: [
        {
          intro:
            "<h2>Willkommen im MfN.projektor</h2>In dieser Visualisierungs-Software werden Drittmittelprojekte, Infrastrukturen und Wissenstransferaktivitäten am Museum für Naturkunde in Verbindung gesetzt. Entdecken Sie strategische Möglichkeiten für Austausch und Transfer!<h3>Beispiele explorieren:</h3><p onClick='window.alert(`Zielgruppe für Wissenstransfer finden`)'>› Zielgruppe für Wissenstransfer finden</p><p onClick=' window.alert(`Fehlende Informationen hinzufügen`)'>› Fehlende Informationen hinzufügen</p><p onClick=' window.alert(`Visualisierungszustand teilen`)'>› Visualisierungszustand teilen</p>",
          element: "step1"
        },
        {
          element: "#step1",
          intro:
            "Diese Software bietet drei Ansichten auf Forschung und Wissenstransfer am Museum für Naturkunde. Der Datensatz für die Visualisierungen stammt aus dem <a style='color: #afca0b;' href='https://via.museumfuernaturkunde.berlin/wiki/'   target='_blank' rel='noopener noreferrer'>VIA-Wiki</a>. In <b>WISSEN</b> werden die existierende Verbindungen zwischen Drittmittelprojekten, Infrastrukturen und Wissenstransferaktivitäten dargestellt. Hierdurch können zum Beispiel Inspirationen für Wissenstransfer oder Wissensaustausch zielstrebig gefunden werden."
        },
        {
          element: "#step2",
          intro:
            "In der Ansicht <b>ZEIT</b> werden die Verläufe von Wissenstransferaktivitäten und Drittmittelprojekten über die Jahre dargestellt. Hierdurch können zum Beispiel Trends gefunden werden, welche in der Planung von Wissentransfer berücksichtigt werden könnten."
        },
        {
          element: "#step3",
          intro:
            "In der Ansicht <b>RAUM</b> rückt die internationale Seite der Forschung am MfN in den Vordergrund. Die Bögen zwischen Kontinenten drücken die durch Projekte verbundenen Partnerinstitutionen aus. Langfristig findet man hier folgende Eindrücke."
        },
        {
          element: "#step4",
          intro:
            "Der <b>Tutorial-Button</b> bietet für jede der drei Ansichten eine eigene Einführung an. Mit dem <b>Teilen-Button</b> kann jeder Zustand der Visualisierung als URL geteilt werden. Der <b>Zurücksetzen-Button</b> stellt den ungefilterten Anfangszustand wieder her."
        },
        {
          element: "#step5",
          intro:
            "Jede Ansicht kann mithilfe der <b>Filter</b>  angepasst werden — und jeder resultierende Zustand wird auch bei einem Wechsel der Ansicht beibehalten. Über den <b>Zeitraum</b>-Slider kann der gesamte Betrachtungszeitraum eingeschränkt werden. Die <b>Forschungsgebiet</b>-Auswahl ermöglicht eine Unterteilung der dargestellten Drittmittelprojekte nach thematischen Kriterien. Über die <b>Wissenstransfer</b>- und <b>Infrastruktur</b>-Auswahl kann die Ansicht weiter verfeinert werden."
        },
        {
          element: "#step6",
          intro:
            "<h3>Hiermit ist diese Einführung beendet!</h3> Für eine Wiederholung entweder <b>Zurück</b> wählen oder das <b>Musem für Naturkunde Logo</b> klicken. Nicht vergessen: Für jede einzelne Ansicht ist eine gesonderte Einführung über den <b>Tutorial</b>-Button verfügbar."
        }
      ]
    });

    tour.onchange(() => {
      switch (tour._currentStep) {
        case 2: {
          this.changeGraphHandler("1");
          break;
        }
        case 3: {
          this.changeGraphHandler("2");
          break;
        }
        default: {
          this.changeGraphHandler("0");
          break;
        }
      }
    });

    tour.start();
  }

  startPageTour() {
    var tour = introJs();
    tour.setOptions({
      tooltipPosition: "auto",
      showStepNumbers: false,
      overlayOpacity: 0.1,
      tooltipClass: classes.introTooltip,
      highlightClass: classes.introPageHighlightClass,
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
    const { shareDialog } = this.state;
    return (
      <div className={classes.navbar} style={{ flexBasis: menuBarHeight }}>
        <Dialog
          isOpen={shareDialog}
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
              <span
                className={classes.shareClipboardLink}
                onClick={this.copiedToClipboard}
              >
                In die Zwischenablage kopieren
              </span>
            </div>
            <div className={classes.closeShare} onClick={this.dialogClosed}>
              Fertig
            </div>
          </div>
        </Dialog>
        <ul className={classes.leftpanel}>
          <li>
            <div
              className={classes.leftElement}
              style={{ backgroundColor: "#1c1d1f", textAlign: "center" }}
              onClick={() => this.startTour()}
            >
              <img src={logo} alt={"The logo should be here!"} />
            </div>
          </li>
          <li>
            <div
              className={
                classes.leftElement +
                " " +
                (this.state.active === "WISSEN" ? classes.active : "")
              }
              onClick={() => this.changeGraphHandler("0")}
            >
              WISSEN
            </div>
          </li>
          <li>
            <div
              className={
                classes.leftElement +
                " " +
                (this.state.active === "ZEIT" ? classes.active : "")
              }
              onClick={() => this.changeGraphHandler("1")}
            >
              ZEIT
            </div>
          </li>
          <li>
            <div
              className={
                classes.leftElement +
                " " +
                (this.state.active === "RAUM" ? classes.active : "")
              }
              onClick={() => this.changeGraphHandler("2")}
            >
              RAUM
            </div>
          </li>
        </ul>
        <ul className={classes.rightPanel} id="step4">
          <li onClick={() => this.startPageTour()}>
            <div className={classes.rightElement}>
              <Tutorial className={classes.buttonIcon} /> <p>Tutorial</p>
            </div>
          </li>
          <li onClick={this.dialogOpened}>
            <div className={classes.rightElement}>
              <Teilen className={classes.buttonIcon} /> <p>Teilen</p>
            </div>
          </li>
          <li
            onClick={() =>
              window.open("http://localhost:3000/explore?", "_self")
            }
          >
            <div className={classes.rightElement}>
              <Reset className={classes.buttonIcon} /> <p>Zurücksetzen</p>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(changeGraph(value)),
    setHighlightState: value => {
      dispatch(setHighlightState(value));
    }
  };
};
const mapStateToProps = state => {
  return {
    graph: state.main.graph
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationSubpages);
