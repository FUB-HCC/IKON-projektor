import React from "react";
import PropTypes from "prop-types";

export default class ClusterDot extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string
  };

  static defaultProps = { x: 0, y: 0, color: "white" };

  state = { hover: false };
  setHover = hover => {
    this.setState({ hover });
    if (hover) {
      this.props.highlightCat(this.props.point._cat);
    } else {
      this.props.resetCat();
    }
  };

  render() {
    const { x, y } = this.props;
    const { hover } = this.state;

    return (
      <g
        onMouseOver={() => this.setHover(true)}
        onMouseOut={() => this.setHover(false)}
        onClick={() => {
          this.props.showProjectDetails();
        }}
        style={{ transition: "all 300ms ease-out" }}
      >
        <circle
          key={"inner-" + x}
          cx={x}
          cy={y}
          r={this.props.radius / 70}
          fill={this.props.color}
        >
          {hover && (
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              repeatCount="indefinite"
              calcMode="paced"
              fill="freeze"
            />
          )}
          {!hover && (
            <animate
              attributeName="r"
              to={this.props.radius / 70}
              dur="1s"
              repeatCount="indefinite"
              calcMode="paced"
              fill="freeze"
            />
          )}
        </circle>
      </g>
    );
  }
}
