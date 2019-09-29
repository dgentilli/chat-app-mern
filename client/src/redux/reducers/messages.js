import { ADD_MESSAGE } from "../actionTypes";

const initialState = {
  allIds: [],
  byIds: {}
};

export default function(state = initialState, action) {
  //console.log("ADD_MESSAGE - reducer, action: ", action);
  switch (action.type) {
    case ADD_MESSAGE: {
      const { id, content } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            message: content
          }
        }
      };
    }
    default:
      return state;
  }
}
