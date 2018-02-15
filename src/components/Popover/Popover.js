import React from 'react'
import TextBox from './TextBox'
import classes from './Popover.css'

const Popover = (props) => {
  const height = props.height * 0.6
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

  const Icon = (<div className={classes.cell} style ={{width: '25%'}}></div>)
  const Title = (<div className={classes.cell} style ={{width: '75%'}}><TextBox text={titleText} fontSize={2}/></div>)

  const ResearchArea = (<div className={classes.cell} style ={{width: '33.3%'}}><TextBox text={researchAreaText}/></div>)
  const ProjectLead = (<div className={classes.cell} style ={{width: '33.3%'}}><TextBox text={projectLeadText}/></div>)
  const Petitioner = (<div className={classes.cell} style ={{width: '33.3%'}}><TextBox text ={petitionerText}/></div>)

  const MainTopic = (<div className={classes.cell} style ={{width: '50.0%'}}><TextBox text={mainTopicText}/></div>)
  const Start = (<div className={classes.cell} style ={{width: '25%'}}><TextBox text={startText}/></div>)
  const Finish = (<div className={classes.cell} style ={{width: '25%'}}><TextBox text={finishText}/></div>)

  const Description = (<div className={classes.cell} style ={{width: '100%'}}><TextBox text={descriptionText}/></div>)

  const FundingSource = (<div className={classes.cell} style ={{width: '33.3%'}}><TextBox text={fundingSourceText}/></div>)
  const CooperationPartner = (<div className={classes.cell} style ={{width: '33.3%'}}><TextBox text={cooperationPartnerText}/></div>)
  const WikiLink = (<div className={classes.cell} style ={{width: '33.3%'}}><TextBox text={wikiLinkText}/></div>)

  const SideTopics = (<div className={classes.cell} style ={{width: '100%'}}></div>)

  const OtherLinks = (<div className={classes.cell} style ={{width: '100%'}}></div>)

  return (
    <div hidden={props.hidden} className={classes.popover_body} style={{width: width, height: height}}>
      <div className={classes.row} style={{height: 2 * standardHeight}}>{Icon}{Title}</div>
      <div className={classes.row} style={{height: standardHeight}}>{ResearchArea}{ProjectLead}{Petitioner}</div>
      <div className={classes.row} style={{height: standardHeight}}>{MainTopic}{Start}{Finish}</div>
      <div className={classes.row} style={{height: 4 * standardHeight}}>{Description}</div>
      <div className={classes.row} style={{height: standardHeight}}>{FundingSource}{CooperationPartner}{WikiLink}</div>
      <div className={classes.row} style={{height: 1.5 * standardHeight}}>{SideTopics}</div>
      <div className={classes.row} style={{height: 1.5 * standardHeight}}>{OtherLinks}</div>
    </div>
  )
}

export default Popover
