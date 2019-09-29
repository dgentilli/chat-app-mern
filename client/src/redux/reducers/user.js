import { SET_USER } from "../actionTypes";

const initialState = {
  _id: "",
  email: ""
};

const userObj = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      return action.payload.userObj;
    }
    default: {
      return state;
    }
  }
};

export default userObj;
