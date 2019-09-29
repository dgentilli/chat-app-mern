import React, { Component } from "react";

//Redux
import { connect } from "react-redux";
import { setUser } from "../redux/actions";

//CSS
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

class Logout extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      email: "",
      password: "",
      errors: {}
    };
  }
  componentDidMount() {
    //console.log("Logout componentDidMount");
  }

  render() {
    let logoutButton;
    let greeting = "Welcome " + this.props.user.email;
    logoutButton = (
      <div id="logout-button-container">
        <DropdownButton id="dropdown-basic-button" title={greeting}>
          <Dropdown.Item href="/">Logout</Dropdown.Item>
        </DropdownButton>
      </div>
    );

    return <div>{logoutButton}</div>;
  }
}
const mapStateToProps = state => {
  return { user: state.user };
};
const mapDispatchToProps = { setUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
