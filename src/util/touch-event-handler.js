import React from "react";
import PropTypes from "prop-types";

class TouchEventHandler extends React.Component {
  constructor() {
    super();
    this.state = {
      startTime: null
    };
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  onTouchStart(event) {
    this.setState({ startTime: event.timeStamp });
  }

  onTouchEnd(event) {
    if (
      event.timeStamp - this.state.startTime >
      this.props.longPressThreshold
    ) {
      this.props.onLongPress();
    } else {
      this.props.onShortPress();
    }
  }

  render() {
    return (
      <g onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
        {this.props.children}
      </g>
    );
  }
}

TouchEventHandler.propTypes = {
  children: PropTypes.element.isRequired,
  onShortPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
  longPressThreshold: PropTypes.number
};

export default TouchEventHandler;
