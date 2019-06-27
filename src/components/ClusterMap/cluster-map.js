import React from 'react'
import {connect} from 'react-redux'
import ClusterMapView from './cluster-map-view'
import _ from "lodash";

const mapStateToProps = state => {
  let clusters = [];
  if(state.main.clusterData){
    const { cluster_data, project_data } = state.main.clusterData;
    const clusterWords = cluster_data.cluster_words;
    const colors = cluster_data.cluster_colour;
    const projects = ((project_data));
    const minX = _.min(_.map(projects, c => c.embpoint[0]));
    const minY = _.min(_.map(projects, c => c.embpoint[1]));

    const transformedPoints = projects.map(p => {
      const cat = _.sample(state.main.categories)
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
    clusters = _.map(clusterIds, (id) => ({
      id: id,
      words: clusterWords[id],
      color: colors[id],
      projects: _.filter(transformedPoints, p => p.cluster === id)
    }))
  }

  return {
    clusterData: clusters,
    categories: state.main.categories
  }
}

export default connect(mapStateToProps)(ClusterMapView)
