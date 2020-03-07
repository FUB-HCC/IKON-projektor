import React, { Component } from "react";
import { connect } from "react-redux";
import classes from "./navigation-subpages.module.css";
import {ReactComponent as Logo } from "../../assets/mfn_logo.svg";
import introJs from "intro.js";
import { changeGraph, tourStarted } from "../../store/actions/actions";
import { isTouchMode } from "../../util/utility";
import {menuBarHeight, menuBarHeightTouch} from "../../App";

class MFNLogo extends Component {
  constructor() {
    super();
    this.startTour = this.startTour.bind(this);
    this.changeGraphHandler = this.changeGraphHandler.bind(this);
  }
  render() {
    return (
      <div
        className={
          this.props.isTouch ? classes.mfnLogoTouch : classes.mfnLogo
        }
        onClick={this.startTour}
      >
        <Logo
          alt={"Museum für Naturkunde Berlin"}
          height={this.props.isTouch ? menuBarHeightTouch : menuBarHeight }
          style={{marginBottom: -7, marginLeft: -15, marginRight: -15}}
        />
      </div>
    );
  }

  changeGraphHandler(graph) {
    this.props.changeGraph(graph);
    this.setState({
      activePopover: -1
    });
  }

  startTour() {
    this.props.tourStarted();
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
            "<h2>Willkommen im MfN.projektor</h2>In dieser Visualisierungs-Software werden Drittmittelprojekte, Infrastrukturen und Wissenstransferaktivitäten am Museum für Naturkunde in Verbindung gesetzt. Entdecken Sie strategische Möglichkeiten für Austausch und Transfer!",
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
}
const mapStateToProps = state => ({
  isTouch: isTouchMode(state)
});

const mapDispatchToProps = dispatch => ({
  changeGraph: key => dispatch(changeGraph(key)),
  tourStarted: () => dispatch(tourStarted())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MFNLogo);
