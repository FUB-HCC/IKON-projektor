import { setSideBarComponent } from "../../store/actions/actions";
import connect from "react-redux/es/connect/connect";
import SideBarView from "./sidebar-view";

const mapStateToProps = state => {
  return {
    sideBarComponent: state.main.sideBarComponent
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSideBarComponent: component => dispatch(setSideBarComponent(component))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBarView);
