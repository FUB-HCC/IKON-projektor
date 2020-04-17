import connect from "react-redux/es/connect/connect";
import SideBarView from "./sidebar-view";
import { isTouchMode } from "../../util/utility";

const mapStateToProps = state => {
  return {
    sideBarComponent: state.main.sideBarComponent,
    isDataProcessed: state.main.isDataProcessed,
    isTouch: isTouchMode(state)
  };
};

/* The sidebar contains different components depending on the state of isClicked and isTouchMode. In browser mode it holds either the FilterPanel or a DetailsPanel of one element. In touch mode it additionally includes the mfn-logo and the ActionButtons.

Each kind of panel is its own component in a separate file. In a future version this could become more compact.

Possible components:

<FilterPanel />
Holds FilterTimeline and FilterSelection, is part of initial state

<CatDetailsPanel /> Lists of ktas and projects linked to one category, which can be either a targetgroup or a format of ktas.

<InfraDetailsPanel />
Description and links to projects from either a "Sammlung" or a "Laborgerät"

<InstDetailsPanel /> (browser version only)
When element in "RAUM" view is clicked.
ARC: research projects that have cooperations with both continents
CONTINENT: list of institutions on that continent
COUNT CIRCLE: list of projects that are have a region on this continent as their "Forschungsregion"

<KtaDetailsPanel />
Information and links for one knowledge transfer activity

<ProjectDetailsPanel />
Information and links for one research project

<YearDetailsPanel />
when element in "ZEIT" view is clicked.
CATEGORY COUNT CIRCLE: List of ktas that have this targetgroup or format in this year
LINE IN STACKED AREA CHART: List of project in that subject area and year

<SampleStatesList /> (touch version only)
A list of all previously shared states, on click opens visualization in that state
*/
export default connect(mapStateToProps)(SideBarView);
