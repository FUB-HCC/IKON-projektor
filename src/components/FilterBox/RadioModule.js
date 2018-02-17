import React from 'react'

import classes from './RadioModule.css'
import {topicToField, getTopicColor, getFieldColor} from '../../store/utility'

const radioElement = (props) => {
  const margin = '10px'
  const height = margin * 2 * props.keys.length + 'px'
  const radioElements = props.keys.sort(compare).map((k, key) => {
    return (
      <div style={{marginTop: margin, marginBottom: margin}} className={classes.Filter} key={key} >
        <div className={classes.CheckBox}>
          <input
            onChange={() => props.changeHandler(props.id, k, 'a')}
            checked={props.value.some(v => v === k)}
            className={classes.Input}
            type="checkbox"
            name={k}
            key={key}
            id={key}/>
          <label style={{backgroundColor: getTopicColor(k) === '#B0B0B0' ? getFieldColor(k) : getTopicColor(k)}} htmlFor={key}/>
        </div>
        {k}
      </div>
    )
  })
  return (
    <div style={{height: height}} className={classes.Module} onClick={() => null}>
      <div className={classes.BoxExtension}/>
      <div className={classes.SelectAll}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44.023 44.023' height='55%' onClick={() => props.toggleHandler(props.name, props.keys)}>
          <path fill='rgba(255,255,255,0.5)' d='m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z'
          />
        </svg>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 489.425 489.425' height='60%' onClick={() => props.toggleHandler(props.name, [])}>
          <path fill='rgba(255,255,255,0.5)' d='M122.825,394.663c17.8,19.4,43.2,30.6,69.5,30.6h216.9c44.2,0,80.2-36,80.2-80.2v-200.7c0-44.2-36-80.2-80.2-80.2h-216.9 c-26.4,0-51.7,11.1-69.5,30.6l-111.8,121.7c-14.7,16.1-14.7,40.3,0,56.4L122.825,394.663z M29.125,233.063l111.8-121.8 c13.2-14.4,32-22.6,51.5-22.6h216.9c30.7,0,55.7,25,55.7,55.7v200.6c0,30.7-25,55.7-55.7,55.7h-217c-19.5,0-38.3-8.2-51.5-22.6 l-111.7-121.8C23.025,249.663,23.025,239.663,29.125,233.063z'
          />
          <path fill='rgba(255,255,255,0.5)' d='M225.425,309.763c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l47.8-47.8l47.8,47.8c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6 c4.8-4.8,4.8-12.5,0-17.3l-47.9-47.8l47.8-47.8c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0l-47.8,47.8l-47.8-47.8 c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l47.8,47.8l-47.8,47.8C220.725,297.263,220.725,304.962,225.425,309.763z'
          />
        </svg>
      </div>
      <form>
        {radioElements}
      </form>
    </div>
  )
}

export default radioElement

const compare = (a, b) => {
  if (topicToField(a) < topicToField(b)) return -1
  if (topicToField(a) > topicToField(b)) return 1
  return 0
}
