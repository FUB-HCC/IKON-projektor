import React from "react";
import style from "./cluster-map-view.module.css";
import { useDispatch } from "react-redux";
import {
  showUncertainty,
  highlightUncertainty
} from "../../store/actions/actions";

const UncertaintyExplanation = props => {
  const dispatch = useDispatch();
  return (
    <div
      data-intro="Als weiteres Element dieser Ansicht kann die Unsicherheits-Landschaft aktiviert werden. Da die Anordnung auf algorithmischen Schätzungen von inhaltlichen Ähnlichkeiten basiert, unterstützt dieses Element die Interpretation der Anordnung. Je heller die Färbung der Landschaft, desto sicherer ist sich der Algorithmus über die Position des jeweiligen Forschungsprojektes, und umgekehrt."
      data-step="2"
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
      {props.uncertaintyOn && (
        <div
          className={style.legendRow}
          onMouseEnter={() => dispatch(highlightUncertainty(true))}
          onMouseLeave={() => dispatch(highlightUncertainty(false))}
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
            <circle className={style.tooltipIcon} r="6px" cx={6} cy={6} />
            <text className={style.tooltipIconText} x="3px" y="10px" style={{ cursor: "POINTER"}}>
              ?
            </text>
          </svg>
        </div>
      )}
      <label
        htmlFor="toggleUncertainty"
        style={{
          fontWeight: "700"
        }}
        className={style.checkboxWrapper}
      >
        <input
          type="checkbox"
          id="toggleUncertainty"
          checked={props.uncertaintyOn}
          onChange={() => dispatch(showUncertainty(!props.uncertaintyOn))}
        />
        Unsicherheitslandschaft
        <span className={style.checkmark}></span>
      </label>
    </div>
  );
};

export default UncertaintyExplanation;
