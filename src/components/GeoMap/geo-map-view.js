import React from 'react'
import style from './geo-map-view.module.css'
import {ReactComponent as Africa} from '../../assets/GeoMap/continents/africa.svg'
import {ReactComponent as Europe} from '../../assets/GeoMap/continents/europe.svg'
import {ReactComponent as NorthAmerica} from '../../assets/GeoMap/continents/north-america.svg'
import {ReactComponent as SouthAmerica} from '../../assets/GeoMap/continents/south-america.svg'
import {ReactComponent as Asia} from '../../assets/GeoMap/continents/asia.svg'
import {ReactComponent as Australia} from '../../assets/GeoMap/continents/australia.svg'

//EXPECTS: institutions, projects, width, height, onProjectClickHandler
const GeoMapView = (props) => {
  const anchorPoints = Array(6).fill().map((v,i) => props.width/12 * (i * 2 + 1))
  let continents = {
    Europa: { latMin: -10.4608, latMax: 40.1669, longMin: 34.8088, longMax: 71.113, institutions:[] },
    Nordamerika:{ latMin: -168.1311, latMax: -12.155, longMin: 25.1155, longMax: 83.5702, institutions:[] },
    Südamerika:{ latMin: -81.2897, latMax: -26.2463, longMin: -59.473, longMax: 12.6286, institutions:[] },
    Asien:{ latMin: -9.12, latMax: 180, longMin: -67.6, longMax: 81.852, institutions:[] },
    Afrika:{ latMin: -17.537, latMax: 51.412, longMin: -34.822, longMax: 37.34, institutions:[] },
    Australien:{ latMin: 112.9511, latMax: 159.1019, longMin: -54.749, longMax: -10.0516, institutions:[] }
  }
  let connections = []

  return(
    <div className={style.geoViewWrapper} style={{width: props.width, height: props.height}}>
      <div className={style.arcWrapper}>
      </div>
      <div className={style.labelWrapper}>
        {anchorPoints.map((p, i) => {
          return (<div className={style.continentLabel} key={Object.keys(continents)[i]} style={{left: p}}>
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