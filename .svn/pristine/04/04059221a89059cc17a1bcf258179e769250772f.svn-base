const initialState = {
  appSyncData: null,
  appToggleLoading: false,
  appToggleLoadingBlock: false,
};
export default function( state: any = initialState, action: Function ) {
  switch( action.type ) {
    case "SYNC_DATA":
      return { ...state, appSyncData: new Date().valueOf() };
    case "APP_TOGGLE_LOADING":
      return { ...state, appToggleLoading: action.appToggleLoading };
    case "APP_TOGGLE_LOADING_BLOCK":
      return { ...state, appToggleLoadingBlock: action.appToggleLoadingBlock };
    default:
      return state;
  }
}
