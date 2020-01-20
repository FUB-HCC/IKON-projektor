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
      <div
        data-intro="Wir setzen maschinelles Lernen ein, um Forschungsprojekte hinsichtlich inhaltlicher Ähnlichkeiten anzuordnen. Die Unsicherheitslandschaft zeigt an, wie treffend der Algorithmus die Anordnung einschätzt. An dunklen Stellen ist die Anordnung eher unpassend, an hellen eher passend."
        data-step="1"
        className={style.legendRow}
        onMouseEnter={() => props.highlightAll("projects")}
        onMouseLeave={() => props.unHighlight()}
      >
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
            <stop offset="0%" stop-color="#000" />
            <stop offset="100%" stop-color="#888" />
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
          <circle className={style.tooltipIcon} r="6" cx={6} cy={6} />
          <text x="3" y="10" style={{ cursor: "POINTER", stroke: "0e0e0e" }}>
            ?
          </text>
        </svg>
      </div>
      <p
        style={{ display: "flex" }}
        data-intro="Die Größe der Kreise und die Zahl neben den unterschiedlichen Zielgruppen vermittelt die Anzahl der Wissenstransferaktivitäten, die diese Zielgruppe haben"
        data-step="2"
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
        style={{ display: "flex" }}
        data-intro="Alle Verknüpfungen, die dieses Icon tragen, sind Sammlungen am Museum für Naturkunde, zu denen Forschungsprojekten einen Bezug haben können."
        data-step="3"
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
        style={{ display: "flex" }}
        data-intro="Alle Verknüpfungen, die dieses Icon tragen, sind Laborgeräte oder andere Infrastruktur am Museum, die in Forschungsprojekten eingesetzt werden können."
        data-step="4"
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
