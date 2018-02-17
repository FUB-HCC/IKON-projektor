import React from 'react'
import TextBox from './TextBox'
import ListBox from './ListBox'
import classes from './Popover.css'
import petriImg from '../../assets/Petri.png'
import MailIcon from '../../assets/envelope.svg'

const Popover = (props) => {
  const height = props.height * 0.65
  const width = height * (3 / 5)
  const standardHeight = height / 12

  const data = props.data

  const titleText = data.titel ? data.titel : 'Projekttitel'
  const researchAreaText = data.forschungsbereich ? 'Forschungsbereich ' + data.forschungsbereich : 'Forschungsbereich N'
  const projectLeadText = data.projektleiter ? data.projektleiter : 'Projektleiter'
  const petitionerText = data.antragsteller ? data.antragsteller : 'Antragsteller'
  const mainTopicText = data.hauptthema ? data.hauptthema : 'Hauptthema'
  const startText = data.start ? new Date(data.start).toDateString() : 'kein Datum'
  const finishText = data.end ? new Date(data.end).toDateString() : 'kein Datum'

  const descriptionText = data.beschreibung ? data.beschreibung : '-keine Beschreibung verfügbar-'
  const fundingSourceText = data.geldgeber ? data.geldgeber : 'Geldgeber'
  const cooperationPartnerText = data.kooperationspartner ? data.kooperationspartner : 'keine Kooperation'
  const wikiLinkText = data.href ? data.href : 'kein Link'

  const sideTopicList = data.nebenthemen ? generateSideTopicList(data.nebenthemen) : undefined
  // If data gets 'other links' category links-list needs to be defined here

  const Icon = (<div className={classes.logoCell} style ={{width: '25%'}}><img src={petriImg} className={classes.logo}/></div>)
  const Title = (<div className={classes.cell} style ={{width: '75%'}}><TextBox text={titleText} fontSize={2}/></div>)

  const ResearchArea = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text={researchAreaText}/></div>)
  const ProjectLead = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text={projectLeadText}/></div>)
  const Petitioner = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text ={petitionerText}/></div>)

  const MainTopic = (<div className={classes.cell} style ={{width: '50.0%'}}><TextBox text={mainTopicText}/></div>)
  const Start = (<div className={classes.cell} style ={{width: '25%'}}><TextBox text={startText}/></div>)
  const Finish = (<div className={classes.cell} style ={{width: '25%'}}><TextBox text={finishText}/></div>)

  const Description = (<div className={classes.cell} style ={{width: '100%'}}><TextBox text={descriptionText}/></div>)

  const FundingSource = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text={fundingSourceText}/></div>)
  const CooperationPartner = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text={cooperationPartnerText}/></div>)
  const WikiLink = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text={wikiLinkText} fontSize={1}/></div>)

  const SideTopics = (<div className={classes.cell} style ={{width: '100%'}}><ListBox title={'NEBENTHEMEN'} list={sideTopicList}/></div>)
  const OtherLinks = (<div className={classes.cell} style ={{width: '100%'}}><ListBox title={'LINKS'}/></div>)

  return (
    <div hidden={props.hidden} className={classes.popover_body} style={{width: width, height: height}}>
      <div className={classes.row} style={{height: 2 * standardHeight}}>{Icon}{Title}</div>
      <div className={classes.row} style={{height: standardHeight}}>{ResearchArea}{ProjectLead}{Petitioner}</div>
      <div className={classes.row} style={{height: standardHeight}}>{MainTopic}{Start}{Finish}</div>
      <div className={classes.row} style={{height: 4 * standardHeight}}>{Description}</div>
      <div className={classes.row} style={{height: standardHeight}}>{FundingSource}{CooperationPartner}{WikiLink}</div>
      <div className={classes.row} style={{height: 1.5 * standardHeight}}>{SideTopics}</div>
      <div className={classes.row} style={{height: 1.5 * standardHeight}}>{OtherLinks}</div>
      <div className={classes.mailbutton} style={{height: 0.8 * standardHeight, width: 0.8 * standardHeight}}><img src={MailIcon} className={classes.mailicon}/></div>
    </div>
  )
}

const generateSideTopicList = (sideTopics) => {
  return sideTopics.map(t => ({name: t, color: '#B0B0B0'}))
}

export default Popover
