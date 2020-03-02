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

export default connect(mapStateToProps)(SideBarView);
