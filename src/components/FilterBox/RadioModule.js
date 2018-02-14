import React from 'react'

import classes from './RadioModule.css'

const radioElement = (props) => {
  const margin = '15px'
  const height = margin * 2 * props.keys.length + 'px'
  const radioElements = props.keys.map((k, key) => {
    return (
      <div style={{marginTop: margin, marginBottom: margin}} className={classes.Filter} key={key} >
        <div className={classes.CheckBox}>
          <input
            onChange={() => props.changeHandler(props.id, k, 'a')}
            defaultChecked={props.value.some(v => v === k)}
            className={classes.Input}
            type="checkbox"
            name={k}
            key={key}
            id={key}/>
          <label style={{background: typeof topicColorMap[k] !== 'undefined' ? topicColorMap[k] : '#B0B0B0'}} htmlFor={key}/>
        </div>
        {k}
      </div>
    )
  })
  return (
    <div style={{height: height}} className={classes.Module} onClick={() => null}>
      <form>
        {radioElements}
      </form>
    </div>
  )
}

export default radioElement

const topicColorMap = {
  'Digitale Welt und Informationswissenschaft': '#8184a7',
  'Wissenskommunikation und Wissensforschung': '#ed9798',
  'Sammlungsentwicklung und Biodiversitätsentdeckung': '#d9ef36',
  'Evolution und Geoprozesse': '#7d913c',
  'Wissenschaftsdatenmanagement': '#8184a7',
  'Biodiversitäts- und Geoinformatik': '#8184a7',
  'Perspektiven auf Natur - PAN': '#ed9798',
  'Historische Arbeitsstelle': '#ed9798',
  'Sammlungsentwicklung': '#d9ef36',
  'Wissenschaft in der Gesellschaft': '#ed9798',
  'Bildung und Vermittlung': '#ed9798',
  'Evolutionäre Morphologie': '#7d913c',
  'Ausstellung und Wissenstransfer': '#ed9798',
  'Mikroevolution': '#7d913c',
  'Impakt- und Meteoritenforschung': '#7d913c',
  'Diversitätsdynamik': '#7d913c',
  'Biodiversitätsentdeckung': '#d9ef36',
  'IT- Forschungsinfrastrukturen': '#8184a7',
  'Kompetenzzentrum Sammlung': '#d9ef36'
}
