import React from "react";
import style from "./cluster-map-view.module.css";

const UncertaintyExplanation = props => {
  return (
    <div
      style={{
        position: "absolute",
        left: props.posX + "px",
        bottom: props.posY + "px",
        backgroundColor: "transparent",
        zIndex: 99,
        color: "#6B6B6B",
        fontFamily: "IBM_Plex_Mono",
        fontSize: "80%"
      }}
    >
      <label
        htmlFor="toggleUncertainty"
        style={{
          fontWeight: "700",
          fontSize: "80%"
        }}
        className={style.checkboxWrapper}
      >
        <input
          type="checkbox"
          id="toggleUncertainty"
          onChange={() => props.toggleUncertainty()}
        />
        Unsicherheitslandschaft anzeigen
        <span className={style.checkmark}></span>
      </label>
      {props.showUncertainty && (
        <div
          data-intro="Um die thematische Anordnung der Projekte zu qualifizieren,ist als weiteres Element dieser Ansicht die <b>Unsicherheits-Landschaft</b> integriert. Da die Anordnung auf algorithmischen Schätzungen von inhaltlichen Ähnlichkeite basiert, ünterstützt dieses Element die Interpretation der Anordnung. Je heller die Färbung der Landschaft, desto <b>sicherer</b> ist sich der Algorithmus über die Position des jeweiligen Forschungsprojektes, und umgekehrt."
          data-step="2"
          className={style.legendRow}
          onMouseEnter={() => props.setHighlightState("uncertainty")}
          onMouseLeave={() => {
            props.unHighlight();
            props.setHighlightState();
          }}
          style={{ cursor: "POINTER" }}
        >
          <p
            style={{
              fontWeight: "700",
              fontSize: "80%",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>unsicher</span>
            <span>sicher</span>
          </p>
          <svg width="190px" height="20">
            <linearGradient id="grad1" x1="20%" y1="0%" x2="120%" y2="0%">
              <stop offset="0%" stopColor="#000" />
              <stop offset="100%" stopColor="#888" />
            </linearGradient>
            <rect width="190" height="20" fill="url(#grad1)" stroke="none" />
          </svg>
          <br />
          Anordnung{" "}
          <svg
            width="15"
            height="15"
            onClick={() =>
              window.alert(
                "Wir setzen maschinelles Lernen ein, um Forschungsprojekte hinsichtlich inhaltlicher Ähnlichkeiten anzuordnen. Die Unsicherheitslandschaft zeigt an, wie treffend der Algorithmus die Anordnung einschätzt."
              )
            }
          >
            <circle className={style.tooltipIcon} r="6" cx={6} cy={6} />
            <text x="3" y="10" style={{ cursor: "POINTER", stroke: "0e0e0e" }}>
              ?
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default UncertaintyExplanation;
