import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import reducer from "./store/reducer/reducer";
import { updateUrl, logger, thunk } from "./store/middleware/middleware";

export const history = createBrowserHistory();

const mergedReducers = combineReducers({
  main: reducer,
  router: connectRouter(history)
});
export const store = preloadedState => {
  return createStore(
    mergedReducers,
    preloadedState,
    compose(
      applyMiddleware(routerMiddleware(history), updateUrl, logger, thunk)
    )
  );
};

ReactDOM.render(
  <Provider store={store()}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
