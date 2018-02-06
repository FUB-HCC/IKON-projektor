import React from 'react'
import classes from './Navigation.css'

const navigation = (props) => {
  const colorActive = '#f0faf0'
  const colorInactive = '#989aa1'
  
  return (
    <div className={classes.Container}>
      ANSICHT
      <div onClick={() => props.onChange('graph', '0')} className={classes.Circle}>
        <svg width="100%" height="100%" id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
          <title>Petri</title>
          <g fill={props.active ? colorActive : colorInactive} stroke={props.active ? colorActive : colorInactive}>
            <path fill='none' strokeWidth='24px' d="M315.6,81.44C381.08,145.23,382,250,318.25,315.5A164.57,164.57,0,0,1,170,362.78"/>
            <path fill='none' strokeWidth='24px' d="M35.16,213.78A165.52,165.52,0,0,1,315.6,81.44"/>
            <path strokeWidth='24px' d="M61.72,290.87a165,165,0,0,1-26.56-77.09"/>
            <path strokeWidth='24px' d="M170,362.78A166,166,0,0,1,61.72,290.87"/>
            <polygon points="136 229.84 109.89 229.84 91.43 248.31 91.43 274.42 109.89 292.88 136 292.88 154.46 274.42 154.46 248.31 136 229.84"/>
            <path d="M107,215.35a31.52,31.52,0,1,0-31.52-31.52A31.52,31.52,0,0,0,107,215.35"/>
            <rect x="205.15" y="80.75" width="63.04" height="63.04"/>
            <rect x="253.23" y="215.35" width="63.04" height="63.04"/>
            <polygon points="167.52 65.33 141.41 65.33 122.94 83.8 122.94 109.91 141.41 128.37 167.52 128.37 185.98 109.91 185.98 83.8 167.52 65.33"/>
            <polygon points="317.16 136.26 291.05 136.26 272.58 154.72 272.58 180.83 291.05 199.3 317.16 199.3 335.62 180.83 335.62 154.72 317.16 136.26"/>
            <polygon points="218.2 270.23 192.09 270.23 173.63 288.69 173.63 314.8 192.09 333.26 218.2 333.26 236.66 314.8 236.66 288.69 218.2 270.23"/>
            <path d="M198.14,230.81a31.52,31.52,0,1,0-31.52-31.52,31.52,31.52,0,0,0,31.52,31.52"/>
          </g>
        </svg>
      </div>
      <div onClick={() => props.onChange('graph', '1')} className={classes.Circle}>
        <svg width="100%" height="100%" id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
          <title>Process</title>
          <g fill={props.active ? colorActive : colorInactive}>
            <path d="M339.78,252.68H60.22a10.22,10.22,0,1,1,0-20.44H339.78a10.22,10.22,0,1,1,0,20.44Z"/>
            <path d="M339.34,168.63H60.66a10.22,10.22,0,0,1,0-20.44H339.34a10.22,10.22,0,0,1,0,20.44Z"/>
            <path d="M339.78,84.59H60.25a10.22,10.22,0,0,1,0-20.44H339.78a10.22,10.22,0,1,1,0,20.44Z"/>
            <path d="M339.78,336.72H60.25a10.22,10.22,0,1,1,0-20.44H339.78a10.22,10.22,0,1,1,0,20.44Z"/>
            <polygon points="190.93 126.14 178.09 138.99 178.09 334.61 190.93 347.45 209.09 347.45 221.94 334.61 221.94 138.99 209.09 126.14 190.93 126.14"/>
            <polygon points="99.42 45.21 86.57 58.05 86.57 257.29 99.42 270.13 117.58 270.13 130.42 257.29 130.42 58.05 117.58 45.21 99.42 45.21"/>
            <path d="M313.45,252.74V147.55a21.92,21.92,0,0,0-43.85,0V252.74a21.92,21.92,0,1,0,43.85,0"/>
          </g>
        </svg>
      </div>
      <div onClick={() => props.onChange('graph', '2')} className={classes.Circle}>
        <svg width="100%" height="100%" id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
          <title>Field</title>
          <g fill={props.active ? colorActive : colorInactive}>
            <path d="M358.72,346.72H79.19a10.22,10.22,0,1,1,0-20.44H358.72a10.22,10.22,0,0,1,0,20.44Z"/>
            <path d="M59.06,44.23V303.76a10.22,10.22,0,1,1-20.44,0V44.23a10.22,10.22,0,0,1,20.44,0Z"/>
            <polygon points="269.69 174.58 354.16 212.23 391.1 172.02 306.63 134.37 269.69 174.58"/>
            <polygon points="179.88 212.73 264.35 250.38 348.34 218.21 263.87 180.56 179.88 212.73"/>
            <polygon points="102.65 258.14 187.12 295.8 259.01 255.53 174.54 217.88 102.65 258.14"/>
            <polygon points="13.51 216.03 97.98 253.68 142.4 229.64 57.93 191.99 13.51 216.03"/>
            <polygon points="198.54 161.16 197.47 197.54 261.72 171.88 298.85 131.96 250.47 155.43 198.54 161.16"/>
            <polygon points="207.04 86.75 166.42 110.44 145.24 130.55 197.43 153.82 250.89 148.09 291.51 124.4 207.04 86.75"/>
            <polygon points="192.95 157.22 141.59 133.19 105.03 163.91 64.41 187.6 148.89 225.25 189.5 201.56 192.95 157.22"/>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default navigation
