import React, { Component } from "react";
// import randomcolor from "randomcolor";
import _ from "lodash";
import "./App.css";
import ClusterView from "./ClusterView3";
import axios from "axios";
import randomcolor from "randomcolor";

const categories = [
  { title: "Museumsbesucher", connections: [], id: 0 },
  { title: "Laien", connections: [], id: 1 },
  { title: "Forschungsinstitute", connections: [], id: 2 },
  { title: "Museen", connections: [], id: 3 },
  { title: "Behörden", connections: [], id: 4 },
  { title: "Biodiversitätsforschende", connections: [], id: 5 },
  { title: "Öffentlichkeit", connections: [], id: 6 },
  { title: "Ethikrat", connections: [], id: 7 },
  { title: "Fachpublikum", connections: [], id: 8 },
  { title: "LehrerInnen & ErzieherInnen", connections: [], id: 9 },
  { title: "SchülerInnen", connections: [], id: 10 },
  { title: "Leibniz-Institute", connections: [], id: 11 },
  { title: "Akteure i. d. nat. Biodiv.-Forschung und -Politik", connections: [], id: 12 },
  { title: "Politik", connections: [], id: 13 },
  { title: "Forschungsförderer", connections: [], id: 14 },
  { title: "Studierende", connections: [], id: 15 },
  { title: "Vereine und Naturschutzverbände", connections: [], id: 16 },
  { title: "Wissenschaft", connections: [], id: 17 },
  { title: "Medien", connections: [], id: 18 },
  { title: "Wirtschaft", connections: [], id: 19 },
  // { title: "Tester", connections: [], id: 16 },
];

const clusters = [
  { id: 0, color: randomcolor() },
  { id: 1, color: randomcolor() },
  { id: 2, color: randomcolor() },
  { id: 3, color: randomcolor() },
  { id: 4, color: randomcolor() },
  { id: 5, color: randomcolor() },
  { id: 6, color: randomcolor() },
  { id: 7, color: randomcolor() },
  { id: 8, color: randomcolor() },
  { id: 9, color: randomcolor() },
  { id: 10, color: randomcolor() },
  { id: 11, color: randomcolor() },
  { id: 12, color: randomcolor() },
]

class App extends Component {
  state = {
    status: "INITIAL", // INITIAL, LOADING, PROCESS, ERROR, FINISHED
    clusterData: [],
  }

  static toGrid = (points) => {
    const sortedPoints = _.sortBy(points, "cluster")
    const gridPoints = _.map(sortedPoints, (point, i) => {
      const posX = (i % 10) * 20 + 100;
      const posY = Math.floor(i / 10) * 20 + 100;

      return {
        ...point,
        gridLocation: [
          posX,
          posY
        ]
      }
    })

    return gridPoints
  }

  static toHexGrid = (points) => {
    const sortedPoints = _.sortBy(points, "cluster")
    return sortedPoints
  }

  componentDidMount() {
    this.setState({ status: "LOADING" });
    axios.get("/dataset_v3.json")
      .then(({ data: { cluster_data, project_data } }) => {
        console.log(cluster_data, project_data)
        const clusterWords = cluster_data.cluster_words;
        const colors = cluster_data.cluster_colour;
        const projects = ((project_data));
        const minX = _.min(_.map(projects, c => c.embpoint[0]));
        const minY = _.min(_.map(projects, c => c.embpoint[1]));

        const transformedPoints = projects.map(p => {
          const cat = _.sample(categories)
          const point = ({
            ...p,
            location: [
              p.embpoint[0] - minX,
              p.embpoint[1] - minY,
            ],
            cat: cat.id,
            _cat: cat
          })
          cat.connections.push(point);

          return point
        })

        const clusterIds = _.uniq(_.map(projects, p => p.cluster));
        const clusters = _.map(clusterIds, (id) => ({
          id: id,
          words: clusterWords[id],
          color: colors[id],
          projects: _.filter(transformedPoints, p => p.cluster === id)
        }))

        this.setState({
          status: "PROCESS",
          clusterData: clusters,
        })

      }).catch(console.error)
  }

  render() {
    const { status, clusterData } = this.state;

    return (
      <div className="App">
        {
          status !== "LOADING" &&
          <ClusterView clusterData={clusterData} categories={categories} />
        }
      </div>
    );
  }
}

export default App;
