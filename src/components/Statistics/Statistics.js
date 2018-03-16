import React from 'react'
import {getFieldColor, getTopicColor} from '../../store/utility'
import StatisticsElement from './StatisticsElement'
import classes from './Statistics.css'

const Statistics = (props) => {
  const sortNewest = (a, b) => {
    const dateA = new Date(props.filteredData[a].end)
    const dateB = new Date(props.filteredData[b].end)
    return dateA > dateB ? -1 : 1
  }

  let statisticsRows = []

  if (Object.keys(props.filteredData).length > 0) {
    statisticsRows = statisticsRows.concat(props.filter[0].value.map(v => ({
      title: v,
      content: Object.keys(props.filteredData).filter(d => v === props.filteredData[d].forschungsbereichstr).length + ' Projekte',
      color: getFieldColor(v)
    })))
    statisticsRows = statisticsRows.filter(s => s.content !== '0 Projekte')

    const newestProject = props.filteredData[Object.keys(props.filteredData).sort(sortNewest)[0]]
    statisticsRows.push({
      title: 'Neuestes Projekt',
      content: newestProject.titel,
      color: getFieldColor(newestProject.forschungsbereichstr)
    })

    statisticsRows.push({
      title: 'Anzahl Themen',
      content: props.filter[1].value.length
    })

    const topicFrequency = props.filter[1].value.map(f => ({
      frequency: Object.keys(props.filteredData).filter(d => props.filteredData[d].hauptthema === f).length,
      name: f
    }))
    const mostFrequentTopic = topicFrequency.sort((a, b) => {
      return a.frequency < b.frequency ? -1 : 1
    })[topicFrequency.length - 1]
    statisticsRows.push({
      title: 'Häufigstes Thema',
      content: mostFrequentTopic.name + ' (' + mostFrequentTopic.frequency + ')',
      color: getTopicColor(mostFrequentTopic.name)
    })

    statisticsRows.push({
      title: 'Anzahl Geldgeber',
      content: props.filter[2].value.length
    })

    const sponsorFrequency = props.filter[2].value.map(f => ({
      frequency: Object.keys(props.filteredData).filter(d => props.filteredData[d].geldgeber === f).length,
      name: f
    }))
    const mostFrequentSponsor = sponsorFrequency.sort((a, b) => {
      return a.frequency < b.frequency ? -1 : 1
    })[sponsorFrequency.length - 1]
    statisticsRows.push({
      title: 'Häufigster Geldgeber',
      content: mostFrequentSponsor.name + ' (' + mostFrequentSponsor.frequency + ')'
    })
  }

  const StatisticsContent = statisticsRows.map((r, i) => <StatisticsElement key={i} title={r.title} content={r.content} color={r.color}/>)

  return (
    <div className={classes.frame}>{StatisticsContent}</div>
  )
}

export default Statistics
