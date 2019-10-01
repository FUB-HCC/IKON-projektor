import React, { Component } from "react";
import classes from "./information.module.css";

class About extends Component {
  render() {
    return(
      <div className={classes.informationPopup}>
        <div className={classes.informationText}>
          <h1>Swipe left = opens Filter</h1>
          <h1>Swipe up = closes this window</h1>
        </div>
      </div>
    );
  }
}

export default About;
