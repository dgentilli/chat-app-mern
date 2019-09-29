import React, { Component } from "react";

//Redux
import { connect } from "react-redux";
import { setUser } from "../redux/actions";

//React Bootstrap
import Alert from "react-bootstrap/Alert";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      email: "",
      password: "",
      error: {}
    };
  }

  componentDidMount() {
    //console.log("Login componentDidMount");
  }

  // Event handler for input 'onChange' events
  //// NOTE: using an arrow function so that we can easily access this.setState
  handleInputChange = e => {
    // getting user input 'email' from synthetic event passed from <input> 'onChange' & storing it in this.state.email
    this.setState({ [e.target.name]: e.target.value });
    //console.log("handleInputChange, email: ", this.state.email);
  };

  handleSendClick = async e => {
    //console.log("Login 'send' button clicked.");

    // stopping default behavior of <form> submit event, which is to refresh the page
    e.preventDefault();

    // getting email data from state (stored upon user input) & formatting for our POST request
    //TO DO: Capture password and send it to the server
    const userData = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });
    // console.log(
    //   "User login info to send to the server in the body of a POST request:",
    //   userData
    // );

    // client POST request: sending form data to the server using server API's POST '/api/users' endpoint
    fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: userData
    })
      // server response
      .then(res => {
        //console.log("Login res: ", res);
        //Convert response from string to JSON
        const resBody = res.json();

        // resolving the Promise to format a message for the user
        Promise.resolve(resBody)
          .then(userObj => {
            // console.log("Login Data submitted: " + userData);
            // console.log("Resolved Promise (login): ", userObj);

            //Error Handling
            if (res.status === 400) {
              let errMsg = userObj.msg
                ? userObj.msg
                : "Please check that your email and password are correct.";
              //console.log("Error: ", res.status);
              //Update state
              this.setState({
                error: {
                  msg: errMsg
                }
              });
              //console.log("State error: ", this.state.error);
            }

            // Redux: invoke 'setUser', payload: userObj must be in JSON format.
            this.props.setUser(userObj);
          })
          //To Do: Test with server down
          .catch(function(error) {
            //console.log(error);
          });
      });
  };

  render() {
    return (
      <div id="welcome">
        <h3>Please Login!</h3>
        <p>
          Try the app by opening two tabs and using the test credentials below.
        </p>
        <h6>Email: homer@testmail.com / Password: monorail</h6>
        <h6>Email: marge@testmail.com / Password: monorail</h6>
        <div id="user-container" />
        <div id="email-input-container">
          <input
            type="email"
            name="email"
            placeholder="Email address..."
            required={true}
            value={this.state.email}
            onChange={this.handleInputChange}
            error={this.state.error.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password..."
            required={true}
            value={this.state.password}
            onChange={this.handleInputChange}
            error={this.state.error.password}
          />
          <button
            className="email-send-btn"
            type="submit"
            value="send"
            onClick={this.handleSendClick}
          >
            Login
          </button>
        </div>
        {this.state.error.msg ? (
          <Alert id="login-alert" variant="danger">
            {this.state.error.msg}
          </Alert>
        ) : null}
      </div>
    );
  }
}

//   }
// }

//export default User;

// Redux - connect to store, bind 'setUser' action creator to Redux's store.dispatch() function
// REF: https://react-redux.js.org/api/connect#object-shorthand-form
// REF: https://react-redux.js.org/introduction/basic-tutorial#connecting-the-components

const mapStateToProps = state => {
  return { user: state.user };
};
const mapDispatchToProps = { setUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
