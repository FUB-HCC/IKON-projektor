import React from 'react'
import TextBox from './TextBox'
import ListBox from './ListBox'
import {getFieldColor, getTopicColor, fieldsIntToString} from '../../store/utility'

import classes from './Popover.css'
import petriImg from '../../assets/Petri.png'
import MailIcon from '../../assets/envelope.svg'
import CloseIcon from '../../assets/Exit.svg'

const Popover = (props) => {
  const height = props.height * 0.75
  const width = height * (4 / 5)
  const standardHeight = height / 12

  const data = props.data

  const titleText = data.title ? data.title : 'Projekttitel'
  const researchAreaText = data.forschungsbereich ? data.forschungsbereich : 'Forschungsbereich N' // TODO
  const projectLeadText = data.project_leader ? data.project_leader : 'Projektleiter'
  const petitionerText = data.applicant ? data.applicant : 'Antragsteller'
  const mainTopicText = data.hauptthema ? data.hauptthema : 'Hauptthema' // TODO
  const startText = data.start_date ? new Date(data.start_date).toDateString() : 'kein Datum'
  const finishText = data.end_date ? new Date(data.end_date).toDateString() : 'kein Datum'

  const descriptionText = data.abstract ? data.abstract : '-keine Beschreibung verfügbar-'
  const fundingSourceText = data.sponsor ? data.sponsor : 'Geldgeber'
  const cooperationPartnerText = data.cooperating_institutions ? data.cooperating_institutions : 'keine Kooperation'

  const sideTopicList = data.side_topics ? generateSideTopicList(data.side_topics) : undefined
  const wikiHref = data.href ? data.href : 'wikipedia.com'
  const fieldColor = getFieldColor(fieldsIntToString(data.forschungsbereich)) // todo

  const Icon = (<div className={classes.logoCell} style ={{width: '20%'}}><img src={petriImg} className={classes.logo}/></div>)
  const Title = (<div className={classes.cell} style ={{width: '80%'}}><TextBox text={titleText} fontSize={2} color={fieldColor}/></div>)

  const ResearchArea = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text={researchAreaText} color={fieldColor} title={'FORSCHUNGSFELD'}/></div>)
  const ProjectLead = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text={projectLeadText} title={'PROJEKTLEITER'}/></div>)
  const Petitioner = (<div className={classes.cell} style ={{width: '33.33%'}}><TextBox text ={petitionerText} title={'ANTRAGSTELLER'}/></div>)

  const MainTopic = (<div className={classes.cell} style ={{width: '50.0%'}}><TextBox text={mainTopicText} color={getTopicColor(data.hauptthema)} title={'HAUPTTHEMA'}/></div>)
  const Start = (<div className={classes.cell} style ={{width: '25%'}}><TextBox text={startText} title={'START'}/></div>)
  const Finish = (<div className={classes.cell} style ={{width: '25%'}}><TextBox text={finishText} title={'ENDE'}/></div>)

  const Description = (<div className={classes.cell} style ={{width: '100%'}}><TextBox text={descriptionText} wikiHref={wikiHref}/></div>)

  const FundingSource = (<div className={classes.cell} style ={{width: '50%'}}><TextBox text={fundingSourceText} title={'GELDGEBER'}/></div>)
  const CooperationPartner = (<div className={classes.cell} style ={{width: '50%'}}><TextBox text={cooperationPartnerText} title={'KOOPERATIONSPARTNER'}/></div>)

  const SideTopics = (<div className={classes.cell} style ={{width: '100%'}}><ListBox title={'NEBENTHEMEN'} list={sideTopicList}/></div>)
  const OtherLinks = (<div className={classes.cell} style ={{width: '100%'}}><ListBox title={'LINKS'}/></div>)

  return (
    <div hidden={props.hidden} className={classes.popover_body} style={{width: width, height: height}}>
      <div className={classes.row} style={{height: 2 * standardHeight}}>{Icon}{Title}</div>
      <div className={classes.row} style={{height: standardHeight}}>{ResearchArea}{ProjectLead}{Petitioner}</div>
      <div className={classes.row} style={{height: standardHeight}}>{MainTopic}{Start}{Finish}</div>
      <div className={classes.row} style={{height: 4 * standardHeight}}>{Description}</div>
      <div className={classes.row} style={{height: standardHeight}}>{FundingSource}{CooperationPartner}</div>
      <div className={classes.row} style={{height: 1.5 * standardHeight}}>{SideTopics}</div>
      <div className={classes.row} style={{height: 1.5 * standardHeight}}>{OtherLinks}</div>
      <div className={classes.wikibutton} style={{height: 0.8 * standardHeight, width: 0.8 * standardHeight}} onClick={() => (window.open(wikiHref, '_blank'))}><div className={classes.wikitext}>WIKI</div></div>
      <div className={classes.mailbutton} style={{height: 0.8 * standardHeight, width: 0.8 * standardHeight}}><img src={MailIcon} className={classes.mailicon}/></div>
      <div className={classes.closebutton} style={{height: 0.8 * standardHeight, width: 0.8 * standardHeight}} onClick={props.closeModal}><img src={CloseIcon}/></div>
    </div>
  )
}

const generateSideTopicList = (sideTopics) => {
  return sideTopics.map(t => ({name: t, color: getTopicColor(t)}))
}

export default Popover
