import React from "react";
import PropTypes from "prop-types";

class InteractionHandler extends React.Component {
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
      this.props.onClick(event);
    } else {
      this.props.onMouseOver(event);
    }
  }

  render() {
    const { isInTouchMode, onMouseOver, onMouseLeave, onClick } = this.props;
    return (
      <g
        onTouchStart={isInTouchMode ? this.onTouchStart : null}
        onTouchEnd={isInTouchMode ? this.onTouchEnd : null}
        onClick={
          isInTouchMode
            ? e => e.stopPropagation()
            : e => {
                e.stopPropagation();
                onClick(e);
              }
        }
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onContextMenu={event => event.preventDefault()}
      >
        {this.props.children}
      </g>
    );
  }
}

InteractionHandler.propTypes = {
  children: PropTypes.element.isRequired,
  isInTouchMode: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  longPressThreshold: PropTypes.number
};

export default InteractionHandler;
