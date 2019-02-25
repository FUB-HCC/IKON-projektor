/* eslint-disable no-multi-str */
import React from 'react'

import classes from './SidebarFilterElementsNew.css'
// import {getFieldColor, getTopicColor} from '../../store/utility'

const SidebarFilterElementsNew = (props) => {
  const filters = <input type='checkbox' />
  return (
    <div>      
      <div className={classes.Body}>

        <div>
          <label className={classes.Title}>{props.filters[0].name}</label>
        </div>

        <div>
          {filters}
        </div>

      </div>
    </div>
  )
}

export default SidebarFilterElementsNew
