import connect from "react-redux/es/connect/connect";
import SideBarView from "./sidebar-view";

const mapStateToProps = state => {
  return {
    sideBarComponent: state.main.sideBarComponent,
    isDataProcessed: state.main.isDataProcessed
  };
};

export default connect(mapStateToProps)(SideBarView);
