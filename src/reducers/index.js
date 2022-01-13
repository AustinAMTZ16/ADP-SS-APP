import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import generalReducer from "./general";
import drawerReducer from "./drawer";
import securityReducer from "./security";
import syncDataReducer from "./syncData";

export default combineReducers({
  form: formReducer,
  generalReducer,
  drawerReducer,
  securityReducer,
  syncDataReducer,
});
