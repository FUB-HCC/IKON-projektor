import React from "react";
import PropTypes from "prop-types";

export default class ClusterDot extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string,
  }

  static defaultProps = { x: 0, y: 0, color: "white" }

  state = { hover: false }
  setHover = hover => {
    this.setState({ hover })
    if (hover) {
      this.props.highlightCat(this.props.point._cat)
    } else {
      this.props.resetCat();
    }
  }

  render() {
    const { x, y } = this.props;
    const { hover } = this.state;

    return (
      <g
        onMouseOver={() => this.setHover(true)}
        onMouseOut={() => this.setHover(false)}
        style={{ transition: "all 300ms ease-out" }}
      >
        <circle key={"inner-" + x} cx={x} cy={y} r="2" fill={this.props.color}>
          {hover &&
          <animate
            attributeName="r"
            values="2;4;2"
            dur="2s"
            repeatCount="indefinite"
            calcMode="paced"
            fill="freeze"
          />}
          {!hover &&
          <animate
            attributeName="r"
            to="2"
            dur="1s"
            repeatCount="indefinite"
            calcMode="paced"
            fill="freeze"
          />}
        </circle>
        <circle
          key={"outer-" + x}
          cx={x}
          cy={y}
          r="4"
          fill="none"
          className="circle-border"
        >
          {hover &&
          <animate
            attributeName="r"
            values="4;9;4"
            dur="2s"
            begin="0"
            repeatCount="indefinite"
            calcMode="paced"
            fill="freeze"
          />}
          {!hover &&
          <animate
            attributeName="r"
            to="4"
            dur="1s"
            begin="0"
            repeatCount="indefinite"
            calcMode="paced"
            fill="freeze"
          />}
        </circle>
      </g>
    );
  }
}