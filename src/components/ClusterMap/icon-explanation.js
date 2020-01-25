import React from "react";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";
import style from "./cluster-map-view.module.css";

const IconExplanation = props => {
  return (
    <div
      style={{
        position: "absolute",
        left: props.posX + "px",
        top: props.posY + "px",
        height: "130px",
        width: "15%",
        backgroundColor: "transparent",
        zIndex: 99,
        color: "#6B6B6B",
        fontFamily: "IBM_Plex_Mono",
        fontSize: "80%"
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <p
          style={{
            fontSize: "80%",
            fontWeight: "700"
          }}
        >
          <span>unsicher</span>
          <span>|</span>
          <span>sicher</span>
        </p>
        <svg width="80" height="15">
          <linearGradient id="grad1" x1="20%" y1="0%" x2="120%" y2="0%">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#888" />
          </linearGradient>
          <rect width="80" height="15" fill="url(#grad1)" stroke="none" />
        </svg>{" "}
        Anordnung{" "}
        <svg
          width="15"
          height="15"
          style={{ cursor: "POINTER" }}
          onClick={() =>
            window.alert(
              "Wir setzen maschinelles Lernen ein, um Forschungsprojekte hinsichtlich inhaltlicher Ähnlichkeiten anzuordnen. Die Unsicherheitslandschaft zeigt an, wie treffend der Algorithmus die Anordnung einschätzt."
            )
          }
        >
          <circle
            className={style.tooltipIcon}
            r="6"
            cx={6}
            cy={6}
            stroke="#6B6B6B"
            fill="#6B6B6B"
          />
          <text x="3" y="10" style={{ cursor: "POINTER", color: "0e0e0e" }}>
            ?
          </text>
        </svg>
      </div>
      <p style={{ display: "flex" }}>
        <svg width="20" height="20">
          <circle r="10" cx={10} cy={10} stroke="#6B6B6B" fill="#6B6B6B" />
        </svg>
        <span style={{ marginLeft: "10px" }}>Zielgruppen</span>
      </p>
      <p style={{ display: "flex" }}>
        <CollectionIcon
          width="20px"
          heigth="20px"
          fill="#6B6B6B"
          stroke="#6B6B6B"
        />
        <span style={{ marginLeft: "10px" }}>Sammlungen</span>
      </p>
      <p style={{ display: "flex" }}>
        <InfrastructureIcon
          width="20px"
          heigth="20px"
          fill="#6B6B6B"
          stroke="#6B6B6B"
        />
        <span style={{ marginLeft: "10px" }}>
          Laborgeräte und Infrastruktur
        </span>
      </p>
    </div>
  );
};

export default IconExplanation;
