import * as USERTYPES from "../actions/types";

const roleReducer = (
  state = { list: [], role: {}, permissions: [] },
  action
) => {
  switch (action.type) {
    case USERTYPES.FETCH_ROLES:
      return { ...state, list: action.payload };

    case USERTYPES.FETCH_PERMISSIONS:
      return { ...state, permissions: action.payload };

    case USERTYPES.ADD_ROLE:
      return { ...state, role: action.payload };

      case USERTYPES.UPDATE_ROLE:
        return { ...state, role: action.payload };

    case USERTYPES.USERS_ERROR:
      return { ...state, errors: action.payload };

    default:
      return state;
  }
};
export default roleReducer;
