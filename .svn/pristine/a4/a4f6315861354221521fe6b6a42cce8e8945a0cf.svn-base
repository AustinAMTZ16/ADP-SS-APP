const initialState = {
  appLoggedIn: null,
  appLoggedOut: null,
  appLogIn: null,
};
export default function( state: any = initialState, action: Function ) {
  switch( action.type ) {
    case "SECURITY_LOGGED_IN":
      return { ...state, appLoggedIn: new Date().valueOf() };
    case "SECURITY_LOGGED_OUT":
      return { ...state, appLoggedOut: new Date().valueOf() };
    case "SECURITY_LOG_IN":
      return { ...state, appLogIn: new Date().valueOf() };
    case "LOAD_DATA_LOGIN_FORM":
      return { ...state, formDataLogin: action.formDataLogin };
    default:
      return state;
  }
}
