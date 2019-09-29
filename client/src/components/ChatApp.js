import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { addMessage } from "../redux/actions";

//React Bootstrap
import Alert from "react-bootstrap/Alert";

//socket.io
import io from "socket.io-client";
const socketEndpoint =
  process.env.NODE_ENV === "development"
    ? "localhost:5000"
    : "https://intense-badlands-87192.herokuapp.com/";
console.log("Socket Endpoint: ", socketEndpoint);
class ChatApp extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      message: "",
      messages: [], // ToDO: this is where we will connect with sockets to pull in all messages in the thread
      error: {}
    };
  }

  componentDidMount() {
    //console.log("ChatApp componentDidMount");
    this.openSocket();

    // fetch all messages from the server
    if (this.props.user._id) {
      let params = {};
      this.fetchMessages(params);
    }
  }

  openSocket = () => {
    const socket = io(socketEndpoint);

    socket.on("connect", () => {
      socket.send("test message");

      socket.on("chat message", msg => {
        console.log("SocketIO on 'chat message': ", msg);
        this.fetchMessages({});
      });
    });
  };

  scrollChatWindow = function() {
    const buffer = 10;

    // get height of chat thread window
    let chatWindow = document.getElementById("chat-window");
    let heightChatWindow = chatWindow.offsetHeight;

    // get height of chat thread window
    let msgList = document.getElementById("message-list");
    let heightMsgList = msgList.offsetHeight;

    // if height of list exceeds that of the window, scroll
    if (heightMsgList > heightChatWindow) {
      // calc & scroll position of chat window
      chatWindow.scrollTop = buffer + heightMsgList - heightChatWindow;
    }
  };

  postMessage() {
    const msgData = { message: this.state.message };
    if (this.props.user) msgData.user = this.props.user._id;
    // console.log(
    //   "User data to send to the server in the body of a POST request (inside postMessage):",
    //   msgData
    // );
    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(msgData)
    })
      // server response
      .then(res => {
        // parsing the server response body into text format (for logging purposes)
        const resBody = res.text();

        // resolving the Promise to format a message for the user
        Promise.resolve(resBody).then(message => {
          //console.log("message posted: " + message);

          // Redux: invoke 'addMessage' to dispatch action
          this.props.addMessage(this.state.message);

          // fetch messages again so that this.state.messages is up to date
          this.fetchMessages();

          // clear the input field
          this.setState({ message: "" });
        });
      });
  }

  // Event handler for button 'onClick' events
  //// NOTE: Using an arrow function so that we can access this.state without binding 'this' in constructor (arrow functions do not re-scope 'this')
  handleSendClick = async e => {
    //console.log("Message 'send' button clicked.");

    // stopping default behavior of <form> submit event, which is to refresh the page
    e.preventDefault();

    if (this.props.user._id) {
      this.postMessage();
    } else {
      this.setState({ error: "Please Login" });
    }
  };

  // Event handler for input 'onChange' events
  //// NOTE: using an arrow function so that we can easily access this.setState
  handleInputChange = e => {
    // getting user input 'email' from synthetic event passed from <input> 'onChange' & storing it in this.state.email
    this.setState({ message: e.target.value });
    //console.log("handleInputChange, message: ", this.state.message);
  };

  // Fetch all messages from the server
  fetchMessages(params) {
    if (!params || typeof params == "undefined") params = {};

    //console.log("fetchMessages()");

    //client POST request: sending form data to the server using server API's POST '/api/messages' endpoint
    fetch("/api/messages", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    })
      // server response
      .then(res => {
        // parsing the server response body into JSON format
        const resBody = res.json();

        // resolving the Promise to format a message for the user
        Promise.resolve(resBody).then(messages => {
          // console.log('messages (before setting state): ', messages);
          this.setState({
            isLoaded: true,
            messages: messages
          });

          //console.log("this.state.messages: ", this.state.messages);

          this.scrollChatWindow();
        });
      });
  }

  render() {
    //Determine if we need to fetch messages
    if (this.props.user._id && this.state.messages.length === 0) {
      this.fetchMessages();
    }
    //Conditional logic - are there messages to display? if not display standard msg
    let chatContent;
    let messageList = (
      <ul id="message-list">
        {this.state.messages.map(msg => (
          <li key={msg._id} id={msg._id} className="message">
            <div
              className={
                msg.user._id === this.props.user._id
                  ? "chat-bubble-right"
                  : "chat-bubble-left"
              }
            >
              {msg.body}
            </div>
          </li>
        ))}
      </ul>
    );
    let userMessage = (
      <div className="alert-message"> No messages to display </div>
    );

    if (this.state.messages.length > 0) {
      chatContent = messageList;
    } else {
      chatContent = userMessage;
    }

    return (
      <div id="chat-app-container">
        <div id="chat-window">{chatContent}</div>
        <div id="chat-input-container">
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            value={this.state.message}
            onChange={this.handleInputChange}
          />
          <button
            className="send-btn"
            type="submit"
            value="Send"
            onClick={this.handleSendClick}
          >
            <i className="send-btn-icon" />
          </button>
        </div>
        {this.state.error.length > 0 && !this.props.user._id ? (
          <Alert variant="danger">Please Login!</Alert>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

const mapDispatchToProps = { addMessage };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatApp);
