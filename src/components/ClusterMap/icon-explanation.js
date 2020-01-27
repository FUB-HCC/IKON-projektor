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
      <p
        style={{ display: "flex", cursor: "POINTER" }}
        data-intro="Die Größe der Kreise und die Zahl neben den unterschiedlichen Zielgruppen vermittelt die Anzahl der Wissenstransferaktivitäten, die diese Zielgruppe haben"
        data-step="4"
        className={style.legendRow}
        onMouseEnter={() => props.highlightAll("categories")}
        onMouseLeave={() => props.unHighlight()}
      >
        <svg width="20" height="20">
          <circle r="10" cx={10} cy={10} className={style.tooltipIcon} />
        </svg>
        <span style={{ marginLeft: "10px" }}>Wissenstransferaktivitäten</span>
      </p>
      <p
        style={{ display: "flex", cursor: "POINTER" }}
        data-intro="Alle Verknüpfungen, die dieses Icon tragen, sind Sammlungen am Museum für Naturkunde, zu denen Forschungsprojekten einen Bezug haben können."
        data-step="5"
        className={style.legendRow}
        onMouseEnter={() => props.highlightAll("collections")}
        onMouseLeave={() => props.unHighlight()}
      >
        <CollectionIcon
          className={style.tooltipIcon}
          width="20px"
          heigth="20px"
        />
        <span style={{ marginLeft: "10px" }}>Sammlungen</span>
      </p>
      <p
        style={{ display: "flex", cursor: "POINTER" }}
        data-intro="Alle Verknüpfungen, die dieses Icon tragen, sind Laborgeräte oder andere Infrastruktur am Museum, die in Forschungsprojekten eingesetzt werden können."
        data-step="6"
        className={style.legendRow}
        onMouseEnter={() => props.highlightAll("infrastructures")}
        onMouseLeave={() => props.unHighlight()}
      >
        <InfrastructureIcon
          className={style.tooltipIcon}
          width="20px"
          heigth="20px"
        />
        <span style={{ marginLeft: "10px" }}>
          Laborgeräte und Infrastruktur
        </span>
      </p>
    </div>
  );
};

export default IconExplanation;
