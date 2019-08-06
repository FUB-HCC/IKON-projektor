import React from 'react'
import style from './geo-map-view.module.css'
import {ReactComponent as Africa} from '../../assets/GeoMap/continents/africa.svg'
import {ReactComponent as Europe} from '../../assets/GeoMap/continents/europe.svg'
import {ReactComponent as NorthAmerica} from '../../assets/GeoMap/continents/north-america.svg'
import {ReactComponent as SouthAmerica} from '../../assets/GeoMap/continents/south-america.svg'
import {ReactComponent as Asia} from '../../assets/GeoMap/continents/asia.svg'
import {ReactComponent as Australia} from '../../assets/GeoMap/continents/australia.svg'


const GeoMapView = (props) => {
  const continents = ["Europa", "Nordamerika", "Südamerika", "Asien", "Afrika", "Australien"]
  const anchorPoints = Array(6).fill().map((v,i) => props.width/12 * (i * 2 + 1))
  console.log(anchorPoints)
  return(
    <div className={style.geoViewWrapper} style={{width: props.width, height: props.height}}>
      <div className={style.arcWrapper}>
      </div>
      <div className={style.labelWrapper}>
        {anchorPoints.map((p, i) => {
          return (<div className={style.continentLabel} key={continents[i]} style={{left: p}}>
            {continents[i]}
          </div>)
        })}
      </div>
      <div className={style.mapsWrapper}>
        <div className={style.continentWrapper}>
          <svg width={props.width / 6}>
            <g><Europe fill={'white'}/></g>
          </svg>
        </div>
        <div className={style.continentWrapper}>
          <svg width={props.width / 6}>
            <g>
              <NorthAmerica fill={'white'}/>
            </g>
          </svg>
        </div>
        <div className={style.continentWrapper}>
          <svg width={props.width / 6}>
            <g>
              <SouthAmerica fill={'white'}/>
            </g>
          </svg>
        </div>
        <div className={style.continentWrapper}>
          <svg width={props.width / 6}>
            <g>
              <Asia fill={'white'}/>
            </g>
          </svg>
        </div>
        <div className={style.continentWrapper}>
          <svg width={props.width / 6}>
            <g>
              <Africa fill={'white'}/>
            </g>
          </svg>
        </div>
        <div className={style.continentWrapper}>
          <svg width={props.width / 6}>
            <g>
              <Australia fill={'white'}/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default GeoMapView