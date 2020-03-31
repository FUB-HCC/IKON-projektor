import React from "react";
import PropTypes from "prop-types";

class InteractionHandler extends React.Component {
  constructor() {
    super();
    this.state = {
      lastTap: null
    };
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  onTouchStart(event) {}

  onTouchEnd(event) {
    if (
      event.timeStamp - this.state.lastTap < this.props.doubleTapTreshold &&
      event.timeStamp - this.state.lastTap > 0
    ) {
      this.props.onClick(event);
    } else {
      this.setState({ lastTap: event.timeStamp });
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
  doubleTapTreshold: PropTypes.number
};

export default InteractionHandler;
