import React, { Component } from "react";

import Logout from "./Logout";
import Login from "./Login";

//Redux
import { connect } from "react-redux";
import { setUser } from "../redux/actions";

class LoginControl extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      email: "",
      password: "",
      isLoggedIn: false,
      //isUser: true,
      errors: {}
    };
  }

  render() {
    //Establish a variable for the component that will render
    let loginLogout;

    //Conditional logic to determine which component to render

    if (this.props.user._id) {
      loginLogout = <Logout />;
    } else {
      loginLogout = <Login />;
    }
    //Render the appropriate component
    return <div>{loginLogout}</div>;
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};
const mapDispatchToProps = { setUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginControl);
