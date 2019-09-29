import { ADD_MESSAGE, SET_USER } from "./actionTypes";

let nextMessageId = 0;

export const addMessage = content => ({
  type: ADD_MESSAGE,
  payload: {
    id: ++nextMessageId,
    content
  }
});

export const setUser = userObj => ({
  type: SET_USER,
  payload: {
    userObj
  }
});
