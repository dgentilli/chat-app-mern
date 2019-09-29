import React from "react";
import "./App.css";

import { Provider } from "react-redux";
import store from "./redux/store";

import LoginControl from "./components/LoginControl";
import ChatApp from "./components/ChatApp";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <LoginControl />
        <ChatApp />
      </div>
    </Provider>
  );
}

export default App;
