import React from "react";
import { useDispatch } from "react-redux";
import { toOverview, changeGraph } from "../../store/actions/actions";

/* legend for the labels in the outer circle of clustervis is drawn as a fixed position div over the cluster vis. When one is hovered all links of the type are highlighted. */
const OverviewButton = props => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        position: "absolute",
        left: props.posX + "px",
        top: props.posY + "px",
        height: "auto",
        width: "auto",
        backgroundColor: "#888",
        zIndex: 99,
        fontFamily: "IBM_Plex_Mono",
        border: "10px solid #888",
        borderRadius: "5px",
        cursor: "POINTER"
      }}
      data-intro="Overview"
      data-step="7"
      id="overviewbutton"
    >
      <p onClick={() => dispatch(toOverview(Math.floor(Math.random() * 101)))}>
        random
      </p>

      <p onClick={() => dispatch(changeGraph("3"))}>
        Zurück zur Auswahl der Anordnung
      </p>
    </div>
  );
};

export default OverviewButton;
