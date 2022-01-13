export function syncData(): Action {
  return {
    type: 'SYNC_DATA',
  };
}

export function toggleLoading( status ): Action {
  return {
    type: 'APP_TOGGLE_LOADING',
    appToggleLoading: status
  };
}

export function toggleLoadingBlock( status ): Action {
  return {
    type: 'APP_TOGGLE_LOADING_BLOCK',
    appToggleLoadingBlock: status
  };
}