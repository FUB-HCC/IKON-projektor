import ProjectDetailsPanel from "../components/ProjectDetailsPanel/project-details-panel";
import CatDetailsPanel from "../components/CatDetailsPanel/cat-details-panel";
import InfraDetailsPanel from "../components/InfraDetailsPanel/infra-details-panel";
import KtaDetailsPanel from "../components/KtaDetailsPanel/kta-details-panel";
import YearDetailsPanel from "../components/YearDetailsPanel/year-details-panel";
import FilterPanel from "../components/FilterPanel/filter-panel";
import { history } from "../index";
import { initialState } from "../store/reducer/reducer";
import React from "react";
import {
  fieldsIntToString,
  fieldsStringToInt,
  topicIntToString,
  topicStringToInt
} from "./utility";

const getTupleFromIsClicked = isClicked => {
  if (isClicked.project) {
    return ["project", isClicked.project];
  }
  if (isClicked.cat) {
    return ["cat", isClicked.cat];
  }
  if (isClicked.infra) {
    return ["infra", isClicked.infra];
  }
  if (isClicked.kta) {
    return ["kta", isClicked.kta];
  }
  if (isClicked.year) {
    return ["year", isClicked.year];
  }
  return ["none", ""];
};

const getIsClickedFromTuple = tuple => {
  const [key, value] = tuple;
  if (key === "project") {
    return {
      project: value,
      infra: null,
      cat: null,
      kta: null,
      year: null
    };
  }
  if (key === "cat") {
    return {
      project: null,
      infra: null,
      cat: value,
      kta: null,
      year: null
    };
  }
  if (key === "infra") {
    return {
      project: null,
      infra: value,
      cat: null,
      kta: null,
      year: null
    };
  }
  if (key === "kta") {
    return {
      project: null,
      infra: null,
      cat: null,
      kta: value,
      year: null
    };
  }
  if (key === "year") {
    return {
      project: null,
      infra: null,
      cat: null,
      kta: null,
      year: value
    };
  }
  return {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null
  };
};

const getSideBarComponentFromTuple = tuple => {
  const [key] = tuple;
  if (key === "project") {
    return <ProjectDetailsPanel />;
  }
  if (key === "cat") {
    return <CatDetailsPanel />;
  }
  if (key === "infra") {
    return <InfraDetailsPanel />;
  }
  if (key === "kta") {
    return <KtaDetailsPanel />;
  }
  if (key === "year") {
    return <YearDetailsPanel />;
  }
  return <FilterPanel />;
};

export const pushStateToUrl = newState => {
  if (!newState.isDataProcessed) {
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
    cl: getTupleFromIsClicked(newState.isClicked)
  };

  let minifiedUrlData = {
    ...newUrlData,
    t: newUrlData.t.map(f => topicStringToInt(f)),
    f: newUrlData.f.map(t => fieldsStringToInt(t))
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
    f: urlState.f.map(t => fieldsIntToString(t))
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
      isClicked: getIsClickedFromTuple(deminifiedUrlState.cl),
      sideBarComponent: getSideBarComponentFromTuple(deminifiedUrlState.cl),
      user: userId
    }
  };
};
