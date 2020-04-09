import ProjectDetailsPanel from "../components/ProjectDetailsPanel/project-details-panel";
import CatDetailsPanel from "../components/CatDetailsPanel/cat-details-panel";
import InfraDetailsPanel from "../components/InfraDetailsPanel/infra-details-panel";
import KtaDetailsPanel from "../components/KtaDetailsPanel/kta-details-panel";
import YearDetailsPanel from "../components/YearDetailsPanel/year-details-panel";
import InstDetailsPanel from "../components/InstDetailsPanel/inst-details-panel";
import SampleStatesList from "../components/SampleStatesList/sample-states-list";
import FilterPanel from "../components/FilterPanel/filter-panel";
import { history } from "../index";
import { initialState } from "../store/reducer/reducer";
import React from "react";
import { topicIntToString, topicStringToInt } from "./utility";

const getTupleFromIsClicked = isClicked => {
  if (isClicked.project) {
    return [1, isClicked.project];
  }
  if (isClicked.cat) {
    return [2, isClicked.cat];
  }
  if (isClicked.infra) {
    return [3, isClicked.infra];
  }
  if (isClicked.kta) {
    return [4, isClicked.kta];
  }
  if (isClicked.year) {
    return [5, isClicked.year];
  }
  if (isClicked.inst) {
    return [6, isClicked.inst];
  }
  if (isClicked.samples) {
    return [7, isClicked.samples];
  }
  return [0, null];
};

const getIsClickedFromTuple = tuple => {
  const [key, value] = tuple;
  if (key === 1) {
    return {
      project: value,
      infra: null,
      cat: null,
      kta: null,
      year: null,
      inst: null,
      samples: null
    };
  }
  if (key === 2) {
    return {
      project: null,
      infra: null,
      cat: value,
      kta: null,
      year: null,
      inst: null,
      samples: null
    };
  }
  if (key === 3) {
    return {
      project: null,
      infra: value,
      cat: null,
      kta: null,
      year: null,
      inst: null,
      samples: null
    };
  }
  if (key === 4) {
    return {
      project: null,
      infra: null,
      cat: null,
      kta: value,
      year: null,
      inst: null,
      samples: null
    };
  }
  if (key === 5) {
    return {
      project: null,
      infra: null,
      cat: null,
      kta: null,
      year: value,
      inst: null,
      samples: null
    };
  }
  if (key === 6) {
    return {
      project: null,
      infra: null,
      cat: null,
      kta: null,
      year: null,
      inst: value,
      samples: null
    };
  }
  if (key === 7) {
    return {
      project: null,
      infra: null,
      cat: null,
      kta: null,
      year: null,
      inst: null,
      samples: value
    };
  }
  return {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null,
    inst: null,
    samples: value
  };
};

const getSideBarComponentFromTuple = tuple => {
  const [key] = tuple;
  if (key === 1) {
    return <ProjectDetailsPanel />;
  }
  if (key === 2) {
    return <CatDetailsPanel />;
  }
  if (key === 3) {
    return <InfraDetailsPanel />;
  }
  if (key === 4) {
    return <KtaDetailsPanel />;
  }
  if (key === 5) {
    return <YearDetailsPanel />;
  }
  if (key === 6) {
    return <InstDetailsPanel />;
  }
  if (key === 7) {
    return <SampleStatesList />;
  }
  return <FilterPanel />;
};

/*turns state of filters, visualization and sidebar into minified url*/
export const pushStateToUrl = newState => {
  if (!newState.isDataProcessed || !newState.isDataLoaded.data) {
    return;
  }
  let newUrlData = {
    g: newState.graph,
    f: newState.filters.forschungsgebiet.value,
    t: newState.filters.hauptthema.value,
    ti: newState.filters.time.value,
    c: newState.filters.collections.value,
    in: newState.filters.infrastructures.value,
    ta: newState.filters.targetgroups.value,
    fo: newState.filters.formats.value,
    hlf: newState.filters.highlevelFilter.value,
    cl: getTupleFromIsClicked(newState.isClicked),
    un: newState.uncertaintyOn ? 1 : 0
  };

  let minifiedUrlData = {
    ...newUrlData,
    t: newUrlData.t.map(f => topicStringToInt(f)),
    f: newUrlData.f
  };
  var newQueryString = "?";
  if (newState.user) {
    newQueryString = newQueryString.concat("uid=" + newState.user + "&");
  }
  newQueryString = newQueryString.concat(
    "state=" + btoa(JSON.stringify(minifiedUrlData))
  );
  if (newQueryString !== window.location.search) {
    history.push(newQueryString);
  }
};

/*turns minified url back into readable state*/
export const parseStateFromUrl = urlParams => {
  const stateString = urlParams.state;
  const userId = urlParams.uid;
  if (stateString == null) {
    console.log("No URL params");
    console.log("User ID found = " + urlParams.uid);
    return {
      main: {
        ...initialState,
        user: userId
      }
    };
  }
  const urlState = JSON.parse(atob(stateString));
  const deminifiedUrlState = {
    ...urlState,
    t: urlState.t.map(f => topicIntToString(f)),
    f: urlState.f
  };
  return {
    main: {
      ...initialState,
      graph: deminifiedUrlState.g,
      filters: {
        ...initialState.filters,
        forschungsgebiet: {
          ...initialState.filters.forschungsgebiet,
          value: deminifiedUrlState.f
        },
        highlevelFilter: {
          ...initialState.filters.highlevelFilter,
          value: deminifiedUrlState.hlf
        },
        hauptthema: {
          ...initialState.filters.hauptthema,
          value: deminifiedUrlState.t
        },
        time: {
          ...initialState.filters.time,
          value: deminifiedUrlState.ti
        },
        collections: {
          ...initialState.filters.collections,
          value: deminifiedUrlState.c
        },
        infrastructures: {
          ...initialState.filters.infrastructures,
          value: deminifiedUrlState.in
        },
        targetgroups: {
          ...initialState.filters.targetgroups,
          value: deminifiedUrlState.ta
        },
        formats: {
          ...initialState.filters.formats,
          value: deminifiedUrlState.fo
        }
      },
      uncertaintyOn: deminifiedUrlState.un === 1 ? true : false,
      isClicked: getIsClickedFromTuple(deminifiedUrlState.cl),
      sideBarComponent: getSideBarComponentFromTuple(deminifiedUrlState.cl),
      user: userId
    }
  };
};
