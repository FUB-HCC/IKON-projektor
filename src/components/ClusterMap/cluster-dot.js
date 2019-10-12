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
    const { x, y, color } = this.props;
    const { hover } = this.state;
    return (
      <g
        onMouseOver={() => this.setHover(true)}
        onMouseOut={() => this.setHover(false)}
        onClick={() => {
          this.props.showProjectDetails();
        }}
        style={{ transition: "all 300ms ease-out" }}
        transform={
          "translate(" +
          (x - this.props.radius / 40) +
          "," +
          (y - this.props.radius / 40) +
          ")"
        }
      >
        <circle
          cx={this.props.radius / 60}
          cy={this.props.radius / 60}
          r={this.props.radius / 35}
          fill={"transparent"}
        />
        <svg
          width={this.props.radius / 20}
          height={this.props.radius / 20}
          viewBox="0 0 78 78"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Project Icon Geistes</title>
          <desc>Created with Sketch.</desc>
          <g
            id="Project-Icon-Geistes"
            fill={hover ? "#DDDDDD" : color}
            stroke={hover ? "#DDDDDD" : color}
          >
            <circle id="Oval" cx="39.2" cy="39.2" r="13.8" />
            <circle id="Oval" cx="35.3" cy="15.3" r="2.3" />
            <circle id="Oval-Copy" cx="63.3" cy="35.3" r="2.3" />
            <circle id="Oval-Copy" cx="44.3" cy="64.3" r="2.3" />
            <circle id="Oval-Copy" cx="15.3" cy="43.3" r="2.3" />
            <circle
              id="Oval"
              transform="translate(53.252691, 18.252691) rotate(-315.000000) translate(-53.252691, -18.252691) "
              cx="53.2526912"
              cy="18.2526912"
              r="2.3"
            />
            <circle
              id="Oval-Copy"
              transform="translate(60.252691, 53.252691) rotate(-315.000000) translate(-60.252691, -53.252691) "
              cx="60.2526912"
              cy="53.2526912"
              r="2.3"
            />
            <circle
              id="Oval-Copy"
              transform="translate(25.252691, 58.252691) rotate(-315.000000) translate(-25.252691, -58.252691) "
              cx="25.2526912"
              cy="58.2526912"
              r="2.3"
            />
            <circle
              id="Oval-Copy"
              transform="translate(18.252691, 25.252691) rotate(-315.000000) translate(-18.252691, -25.252691) "
              cx="18.2526912"
              cy="25.2526912"
              r="2.3"
            />
            <path
              d="M39.2,2 C33.8216994,2 28.709978,3.14136088 24.0938374,5.19508089 M12.0290736,13.7915286 C8.8354205,17.2052885 6.27762234,21.221331 4.54452862,25.6508067 M2,39.2 C2,44.0512483 2.9286239,48.6856049 4.61781179,52.9350098 M12.26168,64.854864 C15.6637855,68.4260845 19.7687417,71.3216718 24.3546955,73.319773 M39.2,76.4 C44.3846383,76.4 49.3215499,75.3393557 53.8055906,73.4232111 M65.158596,65.8456894 C68.5918007,62.5004694 71.3808565,58.4973384 73.3221019,54.039958 M76.4,39.2 C76.4,34.3555338 75.4739708,29.7273533 73.7892683,25.4828146 M65.9205106,13.3184137 C62.6731512,9.96646114 58.8007072,7.22366497 54.4911374,5.27798392"
              id="Shape"
            />
            <circle id="Oval-Copy-2" cx="35.3" cy="15.3" r="2.3" />
            <circle id="Oval-Copy-3" cx="63.3" cy="35.3" r="2.3" />
            <circle id="Oval-Copy-4" cx="44.3" cy="64.3" r="2.3" />
            <circle id="Oval-Copy-5" cx="15.3" cy="43.3" r="2.3" />
            <circle
              id="Oval-Copy-6"
              transform="translate(53.252691, 18.252691) rotate(-315.000000) translate(-53.252691, -18.252691) "
              cx="53.2526912"
              cy="18.2526912"
              r="2.3"
            />
            <circle
              id="Oval-Copy-7"
              transform="translate(60.252691, 53.252691) rotate(-315.000000) translate(-60.252691, -53.252691) "
              cx="60.2526912"
              cy="53.2526912"
              r="2.3"
            />
            <circle
              id="Oval-Copy-8"
              transform="translate(25.252691, 58.252691) rotate(-315.000000) translate(-25.252691, -58.252691) "
              cx="25.2526912"
              cy="58.2526912"
              r="2.3"
            />
            <circle
              id="Oval-Copy-9"
              transform="translate(18.252691, 25.252691) rotate(-315.000000) translate(-18.252691, -25.252691) "
              cx="18.2526912"
              cy="25.2526912"
              r="2.3"
            />
          </g>
        </svg>
      </g>
    );
  }
}
